import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import type { Choice, NoteBlock as CatalogNoteBlock, Question, Subject, Topic } from "@/data/catalog";
import { cn } from "@/lib/cn";
import { locateTopic, useContent } from "@/lib/content";
import { NotePreviewRenderer } from "@/components/NotePreviewRenderer";
import { useNoteStore } from "@/lib/useNoteStore";
import { extractNotesFromImage } from "@/lib/extract.server";
import type { NoteBlock } from "@/lib/note-schema";

export const Route = createFileRoute("/admin/topics/$id")({ component: Editor });

const field = "mt-1 w-full rounded-xl border border-line bg-surface px-3 py-3 text-sm font-sans text-ink focus:border-primary focus:outline-none transition-colors";
const KEYS: Choice[] = ["A", "B", "C", "D"];

function catalogNotesToDocBlocks(notes: CatalogNoteBlock[], objectives?: string[]): NoteBlock[] {
  const blocks: NoteBlock[] = [];
  if (objectives && objectives.length > 0) {
    blocks.push({
      id: `obj-${Date.now()}`,
      type: "objectives",
      items: objectives,
    });
  }
  notes.forEach((n, idx) => {
    if (n.heading) {
      blocks.push({ id: `h-${idx}-${Date.now()}`, type: "heading", text: n.heading });
    }
    if (n.formula) {
      blocks.push({ id: `f-${idx}-${Date.now()}`, type: "formula", latex: n.formula });
    }
    n.paragraphs.forEach((p, pIdx) => {
      blocks.push({ id: `p-${idx}-${pIdx}-${Date.now()}`, type: "paragraph", text: p });
    });
    if (n.diagramCaption) {
      blocks.push({ id: `d-${idx}-${Date.now()}`, type: "diagram", imageUrl: "/media/physics.jpg", caption: n.diagramCaption });
    }
  });
  return blocks;
}

function docBlocksToCatalogNotes(blocks: NoteBlock[]): { notes: CatalogNoteBlock[]; objectives: string[] } {
  const result: CatalogNoteBlock[] = [];
  let objectives: string[] = [];
  let current: CatalogNoteBlock = { heading: "Overview", paragraphs: [] };

  for (const b of blocks) {
    if (b.type === "objectives") {
      objectives = b.items.filter((item) => item.trim());
    } else if (b.type === "heading") {
      if (current.paragraphs.length > 0 || current.formula || current.diagramCaption) {
        result.push(current);
      }
      current = { heading: b.text || "Section", paragraphs: [] };
    } else if (b.type === "paragraph") {
      if (b.text.trim()) current.paragraphs.push(b.text.trim());
    } else if (b.type === "formula") {
      current.formula = b.latex;
    } else if (b.type === "diagram") {
      current.diagramCaption = b.caption;
    }
  }
  if (current.heading || current.paragraphs.length > 0 || current.formula || current.diagramCaption) {
    result.push(current);
  }
  return {
    notes: result,
    objectives,
  };
}

function Editor() {
  const { id } = Route.useParams();
  const subjects = useContent((s) => s.subjects);
  const found = locateTopic(subjects, id);
  if (!found) return <p>That topic is not on Richmirabel.</p>;
  return <Form key={id} subject={found.subject} initial={found.topic} />;
}

function validate(t: Topic): string | null {
  if (!t.title.trim()) return "Add a title.";
  if (t.status !== "draft") {
    if (t.notes.length === 0) return "Add at least one note block before publishing.";
    const bad = t.notes.findIndex((b) => !b.heading.trim() || b.paragraphs.length === 0);
    if (bad >= 0) return `Note block ${bad + 1} needs a heading and a paragraph.`;
    if (t.questions.length < 4) return "Add at least 4 questions before publishing.";
    for (let i = 0; i < t.questions.length; i++) {
      const q = t.questions[i];
      if (!q.prompt.trim()) return `Question ${i + 1} has no prompt.`;
      if (q.options.some((o) => !o.text.trim())) return `Question ${i + 1} has an empty option.`;
      if (!q.explain?.trim()) return `Question ${i + 1} has no explanation.`;
    }
  }
  return null;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

function Form({ subject, initial }: { subject: Subject; initial: Topic }) {
  const upsert = useContent((s) => s.upsertTopic);
  const [topic, setTopic] = useState<Topic>(structuredClone(initial));
  const [tab, setTab] = useState<"Details" | "Source" | "Note" | "Questions" | "Preview">("Details");
  const [sources, setSources] = useState<{ name: string; url: string; type: string; file: File }[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [dirty, setDirty] = useState(false);

  // Zustand Note Store
  const doc = useNoteStore((s) => s.doc);
  const loadTopic = useNoteStore((s) => s.loadTopic);
  const setDocument = useNoteStore((s) => s.setDocument);
  const updateMeta = useNoteStore((s) => s.updateMeta);

  // Initialize and load topic in Zustand store on mount
  useEffect(() => {
    loadTopic(topic.id, {
      subject: subject.name,
      topic: topic.title.toUpperCase(),
      title: topic.title,
      subtitle: topic.summary || "",
      meta: `${topic.minutes || 10} min · ${topic.questions.length} questions · 2 theory`,
      blocks: catalogNotesToDocBlocks(topic.notes, topic.objectives),
    });
  }, [topic.id, subject.name, topic.title, topic.summary, topic.minutes, topic.questions.length, topic.objectives, loadTopic]);

  const edit = (patch: Partial<Topic>) => { setTopic((t) => ({ ...t, ...patch })); setDirty(true); setMsg(null); };
  const move = <T,>(list: T[], i: number, d: number) => { const n = [...list]; const j = i + d; if (j < 0 || j >= n.length) return n; [n[i], n[j]] = [n[j], n[i]]; return n; };
  const setQ = (i: number, patch: Partial<Question>) => edit({ questions: topic.questions.map((q, k) => (k === i ? { ...q, ...patch } : q)) });

  // Real Gemini Vision OCR Extraction Pipeline
  async function handleOcrImageUpload(file: File) {
    if (!file.type.startsWith("image/")) {
      setOcrError("Please upload an image file (PNG, JPG, or WebP).");
      return;
    }
    setOcrLoading(true);
    setOcrError(null);
    setMsg(null);

    // Save in sources for teacher record-keeping
    const nextSource = {
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
      file,
    };
    setSources((current) => [nextSource, ...current]);

    try {
      const base64 = await fileToBase64(file);
      const res = await extractNotesFromImage(base64, file.type);
      if (res.ok) {
        const fullDoc = {
          ...res.data,
          subject: res.data.subject || subject.name,
          topic: res.data.topic || topic.title.toUpperCase(),
          title: res.data.title || topic.title,
        };
        setDocument(fullDoc);
        setDirty(true);
        setOcrLoading(false);
        // Seamlessly switch to Note tab for instant WYSIWYG review
        setTab("Note");
      } else {
        setOcrLoading(false);
        setOcrError(res.message || "Couldn't read the note. Please try a clearer photo.");
      }
    } catch (err: any) {
      setOcrLoading(false);
      setOcrError(err?.message || "Couldn't read the note. Please try a clearer photo.");
    }
  }

  function save(status: "published" | "draft") {
    // Sync current doc from Zustand into catalog topic
    const { notes: syncedNotes, objectives: syncedObjectives } = docBlocksToCatalogNotes(doc.blocks);
    const next: Topic = {
      ...topic,
      title: doc.title || topic.title,
      summary: doc.subtitle || topic.summary,
      objectives: syncedObjectives.length > 0 ? syncedObjectives : topic.objectives,
      notes: syncedNotes,
      status,
    };
    const err = validate(next);
    if (err) { setMsg({ ok: false, text: err }); return; }
    upsert(subject.id, next);
    setTopic(next);
    setDirty(false);
    setMsg({ ok: true, text: status === "published" ? "Published." : "Saved." });
  }

  return (
    <div className="max-w-4xl">
      <Link to="/admin/subjects" className="inline-flex min-h-11 items-center text-sm font-semibold text-primary hover:underline">← Subjects & Content</Link>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-muted">{subject.name}</p>
          <h1 className="font-display text-4xl">{doc.title || topic.title || "Untitled topic"}</h1>
        </div>
        <p className="text-sm text-muted">{topic.status === "draft" ? "Draft" : "Published"}{dirty ? " · unsaved changes" : ""}</p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2" role="tablist">
        {(["Details", "Source", "Note", "Questions", "Preview"] as const).map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={cn(
              "min-h-11 rounded-full border px-5 text-sm font-semibold transition-all",
              tab === t ? "border-ink bg-ink text-primary-fg" : "border-line bg-surface hover:bg-paper"
            )}
          >
            {t}{t === "Questions" ? ` (${topic.questions.length})` : t === "Note" ? ` (${doc.blocks.length})` : t === "Source" ? ` (${sources.length})` : ""}
          </button>
        ))}
      </div>

      {/* TAB 1: Source Tab with Real Gemini OCR Upload */}
      {tab === "Source" && (
        <div className="mt-5 space-y-6">
          {/* Custom OCR File Upload Dropzone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragging(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const droppedFiles = Array.from(e.dataTransfer.files);
              const imageFile = droppedFiles.find((f) => f.type.startsWith("image/"));
              if (imageFile) {
                handleOcrImageUpload(imageFile);
              } else if (droppedFiles.length > 0) {
                setOcrError("Please drop an image file (PNG, JPG, or WebP).");
              }
            }}
            onClick={() => !ocrLoading && fileInputRef.current?.click()}
            className={cn(
              "relative rounded-3xl border-2 border-dashed p-8 sm:p-12 text-center transition-all cursor-pointer shadow-xs",
              isDragging
                ? "border-[#1A4D2E] bg-[#1A4D2E]/10 scale-[0.99]"
                : "border-[#1A4D2E]/30 bg-[#FDFBF7] hover:border-[#1A4D2E] hover:bg-[#FDFBF7]/90 hover:shadow-sm",
              ocrLoading && "cursor-default pointer-events-none"
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleOcrImageUpload(file);
                }
                e.target.value = "";
              }}
            />

            {ocrLoading ? (
              <div className="py-6">
                {/* Custom Slick Concentric Spinner */}
                <div className="relative size-16 mx-auto mb-5">
                  <div className="absolute inset-0 rounded-full border-4 border-[#1A4D2E]/15" />
                  <div className="absolute inset-0 rounded-full border-4 border-[#1A4D2E] border-t-transparent animate-spin" />
                  <div className="absolute inset-2 rounded-full border-2 border-[#1A4D2E]/35 border-b-transparent animate-spin [animation-direction:reverse] [animation-duration:1.4s]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="size-2 rounded-full bg-[#1A4D2E] animate-pulse" />
                  </div>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl text-[#1A4D2E] font-medium tracking-tight">
                  Gemini is reading the handwriting...
                </h3>
                <p className="font-sans text-sm text-[#6B6B6B] mt-2 max-w-md mx-auto leading-relaxed">
                  Analyzing layout, identifying learning objectives and headings, and converting mathematical equations into KaTeX LaTeX...
                </p>
              </div>
            ) : (
              <div className="py-4">
                {/* Upload Icon */}
                <div className="mx-auto size-14 rounded-2xl bg-[#1A4D2E]/10 text-[#1A4D2E] flex items-center justify-center mb-4 transition-transform group-hover:scale-105">
                  <svg className="size-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                    <path d="M12 12v9" strokeLinecap="round" />
                    <path d="m16 16-4-4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl text-[#2A2422] font-medium tracking-tight">
                  Upload Handwritten Note (Image)
                </h3>
                <p className="font-sans text-sm text-[#6B6B6B] mt-2 max-w-md mx-auto leading-relaxed">
                  Drag & drop your handwritten lesson photo here, or click to browse. Gemini will convert it directly into structured WYSIWYG blocks.
                </p>

                <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#1A4D2E] px-6 py-2.5 font-sans text-xs font-semibold text-white shadow-xs hover:bg-[#153e25] transition-colors">
                  <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  Choose Photo from Device
                </div>

                <p className="mt-3 text-[11px] font-sans text-[#8C827A]">
                  Supports JPG, PNG, and WebP · KaTeX formulas converted automatically
                </p>
              </div>
            )}
          </div>

          {/* Custom Error Toast */}
          {ocrError && (
            <div className="rounded-2xl border border-red-200 bg-red-50/80 p-4 flex items-start justify-between gap-3 text-sm text-red-800 shadow-2xs">
              <div className="flex items-start gap-2.5">
                <svg className="size-5 shrink-0 text-red-600 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <div>
                  <p className="font-semibold">{ocrError}</p>
                  <p className="text-xs text-red-600 mt-0.5">
                    Ensure good lighting, flat paper, and high contrast for optimal handwriting recognition.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOcrError(null)}
                className="text-red-500 hover:text-red-800 text-xs font-semibold"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Uploaded Reference Documents */}
          <div>
            <div className="flex items-center justify-between">
              <h4 className="font-serif text-lg text-[#2A2422]">Uploaded Source Records ({sources.length})</h4>
              <button
                type="button"
                onClick={() => setTab("Note")}
                className="text-xs font-semibold text-[#1A4D2E] hover:underline"
              >
                Go to Note Studio →
              </button>
            </div>
            <p className="text-xs text-muted mt-0.5">
              Source photographs remain stored with the lesson for administrative reference.
            </p>

            <ul className="mt-3 space-y-2">
              {sources.map((file, i) => (
                <li key={file.url} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line bg-surface px-4 py-2.5 text-sm">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="font-serif font-bold text-xs text-muted">{i + 1}.</span>
                    <span className="truncate max-w-xs sm:max-w-md font-sans text-xs sm:text-sm font-medium">{file.name}</span>
                  </div>
                  <span className="flex gap-2">
                    <button type="button" onClick={() => setPreview(file.url)} className="min-h-9 rounded-full border border-line px-3 text-xs font-medium hover:bg-paper">Preview</button>
                    <button type="button" onClick={() => handleOcrImageUpload(file.file)} className="min-h-9 rounded-full border border-[#1A4D2E]/30 bg-[#1A4D2E]/10 text-[#1A4D2E] px-3 text-xs font-semibold hover:bg-[#1A4D2E]/20">Re-Extract</button>
                    <button type="button" onClick={() => setSources((current) => current.filter((_, k) => k !== i))} className="min-h-9 rounded-full border border-line px-3 text-xs hover:bg-red-50 text-red-600">Remove</button>
                  </span>
                </li>
              ))}
              {sources.length === 0 && (
                <li className="rounded-2xl border border-line bg-surface p-6 text-center text-sm text-muted font-sans">
                  No source notes uploaded yet. Upload a photo above to start AI extraction.
                </li>
              )}
            </ul>

            {preview && (
              <div className="mt-4 rounded-2xl border border-line bg-surface p-4">
                <div className="flex items-center justify-between pb-3 border-b border-line mb-3">
                  <p className="text-xs font-semibold text-muted uppercase tracking-wider">Source Preview</p>
                  <button type="button" onClick={() => setPreview(null)} className="text-xs font-semibold text-primary">Close preview</button>
                </div>
                {sources.find((s) => s.url === preview)?.type === "application/pdf" ? (
                  <iframe title="Source PDF" src={preview} className="h-96 w-full rounded-xl" />
                ) : (
                  <img src={preview} alt="Uploaded source" className="max-h-[500px] w-full rounded-xl object-contain bg-paper" />
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Note Tab with the full WYSIWYG Editor */}
      {tab === "Note" && (
        <div className="mt-5 space-y-3">
          <div className="rounded-3xl border border-[#E5E0D8] bg-[#FDFBF7] shadow-sm overflow-hidden">
            {/* Subtle top document bar */}
            <div className="border-b border-[#E5E0D8] bg-[#F7F4EE] px-5 py-3 flex items-center justify-between text-xs font-sans text-[#6B6B6B]">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-[#1A4D2E]" />
                <span className="font-medium text-[#2A2422]">
                  {doc.subject || subject.name} / {doc.title || topic.title}
                </span>
                <span className="text-[#8C827A]">
                  · {doc.blocks.length} block{doc.blocks.length === 1 ? "" : "s"}
                </span>
              </div>
              <span className="text-[11px] text-[#8C827A]">
                Hover block for drag handle · Click text to edit inline
              </span>
            </div>

            {/* WYSIWYG Editable Note Studio */}
            <NotePreviewRenderer readOnly={false} />
          </div>
        </div>
      )}

      {/* TAB 3: Preview Tab with Read-Only Student View */}
      {tab === "Preview" && (
        <div className="mt-5 space-y-4">
          <div className="flex items-center justify-between px-1">
            <p className="text-sm text-muted">
              {topic.status === "draft"
                ? "Draft student preview — exactly what the student sees upon release."
                : "Student Lesson View — live published display."}
            </p>
            <button
              type="button"
              onClick={() => setTab("Note")}
              className="text-xs font-semibold text-[#1A4D2E] hover:underline"
            >
              Open in Note Editor →
            </button>
          </div>

          <div className="rounded-3xl border border-[#E5E0D8] bg-[#FDFBF7] shadow-sm overflow-hidden">
            {/* Read-Only Clean Student View */}
            <NotePreviewRenderer readOnly={true} />
          </div>
        </div>
      )}

      {/* TAB 4: Details Tab (Cleaned up: Diagram & Objectives removed, synced with Zustand) */}
      {tab === "Details" && (
        <div className="mt-5 space-y-5">
          <div className="rounded-2xl border border-line bg-surface p-6 shadow-xs space-y-4">
            <div>
              <label className="block font-sans text-xs font-semibold text-muted uppercase tracking-wider mb-1" htmlFor="topic-title">
                Topic Title
              </label>
              <input
                id="topic-title"
                value={doc.title}
                onChange={(e) => {
                  updateMeta("title", e.target.value);
                  edit({ title: e.target.value });
                }}
                className={field}
                placeholder="Topic Title (e.g., Quadratic Equations)"
              />
              <p className="mt-1 text-xs text-muted font-sans">
                Directly synchronized with the lesson title in Note Studio and student view.
              </p>
            </div>

            <div>
              <label className="block font-sans text-xs font-semibold text-muted uppercase tracking-wider mb-1" htmlFor="topic-summary">
                One-line summary (Subtitle)
              </label>
              <input
                id="topic-summary"
                value={doc.subtitle}
                onChange={(e) => {
                  updateMeta("subtitle", e.target.value);
                  edit({ summary: e.target.value });
                }}
                className={field}
                placeholder="Core concept summary..."
              />
              <p className="mt-1 text-xs text-muted font-sans">
                Displayed as the lesson subtitle right beneath the main title.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-sans text-xs font-semibold text-muted uppercase tracking-wider mb-1" htmlFor="topic-minutes">
                  Minutes to read (Estimated)
                </label>
                <input
                  id="topic-minutes"
                  type="number"
                  min={1}
                  value={topic.minutes}
                  onChange={(e) => {
                    const min = Math.max(1, Number(e.target.value) || 1);
                    edit({ minutes: min });
                    updateMeta("meta", `${min} min · ${topic.questions.length} questions · 2 theory`);
                  }}
                  className={field}
                />
              </div>

              <div>
                <label className="block font-sans text-xs font-semibold text-muted uppercase tracking-wider mb-1" htmlFor="topic-meta">
                  Note Meta Line
                </label>
                <input
                  id="topic-meta"
                  type="text"
                  value={doc.meta}
                  onChange={(e) => updateMeta("meta", e.target.value)}
                  className={field}
                  placeholder="20 min · 4 questions · 2 theory"
                />
              </div>
            </div>
          </div>

          {/* Callout informing about Objectives and Diagrams */}
          <div className="rounded-2xl border border-[#1A4D2E]/20 bg-[#1A4D2E]/5 p-5 flex items-start gap-3 shadow-xs">
            <span className="inline-flex size-6 shrink-0 rounded-full bg-[#1A4D2E] text-white items-center justify-center mt-0.5">
              <svg className="size-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div className="text-sm">
              <p className="font-serif font-bold text-[#2A2422]">
                Learning Objectives & Diagrams moved to Note Studio
              </p>
              <p className="text-xs text-[#6B6B6B] mt-1 leading-relaxed font-sans">
                Learning objectives are now editable as a styled checklist block directly inside the note, and diagrams can be placed anywhere in the lesson flow with captions and image URLs.
              </p>
              <button
                type="button"
                onClick={() => setTab("Note")}
                className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-[#1A4D2E] hover:underline font-sans"
              >
                Go to Note Studio →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Questions Tab */}
      {tab === "Questions" && (
        <div className="mt-5 space-y-4">
          {topic.questions.map((q, i) => (
            <div key={q.id} className="rounded-2xl border border-line bg-surface p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold">Question {i + 1}</p>
                <div className="flex">
                  <button type="button" aria-label="Move up" onClick={() => edit({ questions: move(topic.questions, i, -1) })} className="inline-flex size-11 items-center justify-center"><ArrowUp className="size-4" /></button>
                  <button type="button" aria-label="Move down" onClick={() => edit({ questions: move(topic.questions, i, 1) })} className="inline-flex size-11 items-center justify-center"><ArrowDown className="size-4" /></button>
                  <button type="button" aria-label="Delete question" onClick={() => { if (confirm(`Delete question ${i + 1}?`)) edit({ questions: topic.questions.filter((_, k) => k !== i) }); }} className="inline-flex size-11 items-center justify-center"><Trash2 className="size-4" /></button>
                </div>
              </div>
              <label className="mt-2 block text-sm">Prompt<textarea rows={2} value={q.prompt} onChange={(e) => setQ(i, { prompt: e.target.value })} className={field} /></label>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {q.options.map((o, k) => (
                  <label key={o.key} className="block text-sm">Option {o.key}
                    <input value={o.text} onChange={(e) => setQ(i, { options: q.options.map((x, j) => (j === k ? { ...x, text: e.target.value } : x)) })} className={field} />
                  </label>
                ))}
              </div>
              <fieldset className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                <legend className="mb-1">Correct answer</legend>
                {KEYS.map((k) => (
                  <label key={k} className={cn("flex min-h-11 min-w-11 items-center justify-center gap-1 rounded-full border px-4", q.answer === k ? "border-primary bg-primary text-primary-fg" : "border-line")}>
                    <input type="radio" name={`ans-${q.id}`} checked={q.answer === k} onChange={() => setQ(i, { answer: k })} className="sr-only" />{k}
                  </label>
                ))}
              </fieldset>
              <label className="mt-3 block text-sm">Explanation<textarea rows={2} value={q.explain} onChange={(e) => setQ(i, { explain: e.target.value })} className={field} /></label>
            </div>
          ))}
          <button type="button" onClick={() => edit({ questions: [...topic.questions, { id: `${topic.id}-q${Date.now().toString(36)}`, prompt: "", options: KEYS.map((key) => ({ key, text: "" })), answer: "A", explain: "" }] })} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-surface px-5 text-sm font-semibold"><Plus className="size-4" />Add question</button>
        </div>
      )}

      {/* Persistent Bottom Bar */}
      <div className="sticky bottom-0 mt-8 flex flex-wrap items-center gap-3 border-t border-line bg-paper/95 py-3 backdrop-blur">
        <button type="button" onClick={() => save("published")} className="min-h-12 rounded-full bg-primary px-6 font-semibold text-primary-fg">Publish</button>
        <button type="button" onClick={() => save("draft")} className="min-h-12 rounded-full border border-line bg-surface px-6 font-semibold">Save as draft</button>
        <p role="status" aria-live="polite" className={cn("text-sm", msg && !msg.ok && "font-semibold")}>{msg?.text}</p>
      </div>
    </div>
  );
}
