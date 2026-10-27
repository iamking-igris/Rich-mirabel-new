import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  BookOpen,
  FileText,
  Sparkles,
  HelpCircle,
  Plus,
  ArrowRight,
  Search,
  CheckCircle2,
  Clock,
  Layers,
  BarChart3,
  ExternalLink,
  ChevronRight,
  GraduationCap,
} from "lucide-react";
import { useContent } from "@/lib/content";
import { loadOps } from "@/lib/admin-ops";
import type { Topic } from "@/data/catalog";

export const Route = createFileRoute("/admin/")({
  component: AdminOverviewPage,
});

function AdminOverviewPage() {
  const navigate = useNavigate();
  const subjects = useContent((s) => s.subjects);
  const upsertTopic = useContent((s) => s.upsertTopic);

  const [search, setSearch] = useState("");
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>("all");
  const [isNewTopicModalOpen, setIsNewTopicModalOpen] = useState(false);

  // New topic form state
  const [newSubId, setNewSubId] = useState(subjects[0]?.id || "physics");
  const [newTitle, setNewTitle] = useState("");
  const [newSummary, setNewSummary] = useState("");
  const [newMinutes, setNewMinutes] = useState(15);
  const [formError, setFormError] = useState("");

  const ops = loadOps();

  // Aggregate stats
  const totalSubjects = subjects.length;
  const allTopics = subjects.flatMap((s) =>
    s.topics.map((t) => ({ ...t, subjectId: s.id, subjectName: s.name }))
  );
  const totalTopics = allTopics.length;
  const publishedTopics = allTopics.filter((t) => t.status === "published").length;
  const draftTopics = allTopics.filter((t) => t.status !== "published").length;
  const totalQuestions = allTopics.reduce((acc, t) => acc + (t.questions?.length || 0), 0);
  const topicsWithNotes = allTopics.filter((t) => (t.notes?.length || 0) > 0).length;

  // Filter topics for the quick table
  const filteredTopics = allTopics.filter((t) => {
    const matchesSub = selectedSubjectFilter === "all" || t.subjectId === selectedSubjectFilter;
    const matchesQuery =
      search.trim() === "" ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.subjectName.toLowerCase().includes(search.toLowerCase()) ||
      t.summary?.toLowerCase().includes(search.toLowerCase());
    return matchesSub && matchesQuery;
  });

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setFormError("Please enter a topic title.");
      return;
    }

    const topicId = newTitle
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const uniqueId = `${topicId}-${Date.now().toString(36).substring(0, 4)}`;

    // Create blank topic with no mock-up blocks for new topics
    const freshTopic: Topic = {
      id: uniqueId,
      title: newTitle.trim(),
      minutes: Number(newMinutes) || 15,
      summary: newSummary.trim() || `Study notes and practice questions for ${newTitle.trim()}.`,
      notes: [],
      questions: [],
      status: "draft",
      origin: "demo",
    };

    upsertTopic(newSubId, freshTopic);
    setIsNewTopicModalOpen(false);
    setNewTitle("");
    setNewSummary("");
    setFormError("");

    // Jump straight to the note studio
    navigate({ to: `/admin/topics/$id`, params: { id: uniqueId } });
  };

  return (
    <div className="space-y-8 font-sans pb-16">
      {/* Top Banner / Welcome */}
      <div className="rounded-3xl border border-[#E5E0D8] bg-[#FFFFFF] p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#1A4D2E]/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#1A4D2E]/10 px-3 py-1 text-xs font-semibold text-[#1A4D2E] mb-3">
              <Sparkles className="size-3.5" />
              <span>Gemini 2.5 Flash Vision OCR · Active</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#2A2422]">
              Academic Overview & Note Studio
            </h1>
            <p className="mt-2 text-sm sm:text-base text-[#7A726D] max-w-2xl leading-relaxed">
              Curate West African secondary school syllabi, digitize handwritten teaching notes via
              Gemini Vision OCR, and publish interactive CBT question sets.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setIsNewTopicModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-[#1A4D2E] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#143d24] transition-colors"
            >
              <Plus className="size-4" />
              <span>New Topic & Note</span>
            </button>
            <Link
              to="/admin/subjects"
              className="inline-flex items-center gap-2 rounded-full border border-[#E5E0D8] bg-[#FDFBF7] px-5 py-3 text-sm font-semibold text-[#2A2422] hover:bg-[#F4EFEA] transition-colors"
            >
              <Layers className="size-4 text-[#7A726D]" />
              <span>Subjects & Content</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-[#E5E0D8] bg-[#FFFFFF] p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#7A726D]">
              Subjects
            </span>
            <div className="rounded-xl bg-[#1A4D2E]/10 p-2 text-[#1A4D2E]">
              <BookOpen className="size-4" />
            </div>
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-[#2A2422]">{totalSubjects}</p>
          <p className="mt-1 text-xs text-[#7A726D]">Physics, Chemistry, Bio, Math & more</p>
        </div>

        <div className="rounded-2xl border border-[#E5E0D8] bg-[#FFFFFF] p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#7A726D]">
              Total Topics
            </span>
            <div className="rounded-xl bg-amber-500/10 p-2 text-amber-700">
              <Layers className="size-4" />
            </div>
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-[#2A2422]">{totalTopics}</p>
          <div className="mt-1 flex items-center gap-2 text-xs text-[#7A726D]">
            <span className="text-emerald-700 font-medium">{publishedTopics} published</span>
            <span>·</span>
            <span>{draftTopics} draft</span>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E5E0D8] bg-[#FFFFFF] p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#7A726D]">
              Digitized Notes
            </span>
            <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-700">
              <FileText className="size-4" />
            </div>
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-[#2A2422]">{topicsWithNotes}</p>
          <p className="mt-1 text-xs text-[#7A726D]">WYSIWYG & KaTeX LaTeX ready</p>
        </div>

        <div className="rounded-2xl border border-[#E5E0D8] bg-[#FFFFFF] p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#7A726D]">
              Question Bank
            </span>
            <div className="rounded-xl bg-blue-500/10 p-2 text-blue-700">
              <HelpCircle className="size-4" />
            </div>
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-[#2A2422]">{totalQuestions}</p>
          <p className="mt-1 text-xs text-[#7A726D]">Multiple-choice CBT items</p>
        </div>
      </div>

      {/* Featured Note Studio Spotlight */}
      <div className="rounded-3xl border border-[#1A4D2E]/20 bg-[#F4EFEA] p-6 sm:p-7 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#1A4D2E] animate-pulse" />
              <p className="text-xs font-bold uppercase tracking-wider text-[#1A4D2E]">
                Active Note Studio Highlight
              </p>
            </div>
            <h2 className="font-display text-2xl font-bold text-[#2A2422]">
              Physics: Waves & Wave Motion
            </h2>
            <p className="text-sm text-[#7A726D]">
              Explore the drag-and-drop block editor, KaTeX formulas ($v = f\lambda$), learning
              objectives, and Gemini handwritten OCR.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/admin/topics/$id"
              params={{ id: "waves" }}
              className="inline-flex items-center gap-2 rounded-full bg-[#1A4D2E] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#143d24] transition-colors"
            >
              <span>Open Note Studio</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Subjects Catalog Grid Preview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-[#2A2422]">Curriculum Subjects</h2>
            <p className="text-xs text-[#7A726D]">
              Breakdown by subject syllabi and digitized coverage
            </p>
          </div>
          <Link
            to="/admin/subjects"
            className="text-xs font-semibold text-[#1A4D2E] hover:underline flex items-center gap-1"
          >
            <span>View All Subjects</span>
            <ChevronRight className="size-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((s) => {
            const topicCount = s.topics.length;
            const publishedCount = s.topics.filter((t) => t.status === "published").length;
            const notesCount = s.topics.filter((t) => (t.notes?.length || 0) > 0).length;
            const qCount = s.topics.reduce((acc, t) => acc + (t.questions?.length || 0), 0);

            return (
              <div
                key={s.id}
                className="rounded-2xl border border-[#E5E0D8] bg-[#FFFFFF] p-5 shadow-xs hover:border-[#1A4D2E]/40 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7A726D]">
                        {s.group}
                      </span>
                      <h3 className="font-display text-xl font-bold text-[#2A2422]">{s.name}</h3>
                    </div>
                    <span className="rounded-full bg-[#F4EFEA] px-2.5 py-1 text-[11px] font-semibold text-[#2A2422]">
                      {s.exam || "WAEC / JAMB"}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-[#7A726D] line-clamp-2 leading-relaxed">
                    {s.blurb || "Core secondary syllabus topics with digital study notes and CBT."}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-[#E5E0D8]/60">
                  <div className="flex items-center justify-between text-xs text-[#7A726D] mb-3">
                    <span>
                      <strong className="text-[#2A2422]">{topicCount}</strong> topics
                    </span>
                    <span>
                      <strong className="text-[#2A2422]">{notesCount}</strong> notes
                    </span>
                    <span>
                      <strong className="text-[#2A2422]">{qCount}</strong> questions
                    </span>
                  </div>

                  <Link
                    to="/admin/subjects"
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#E5E0D8] bg-[#FDFBF7] py-2 text-xs font-semibold text-[#2A2422] hover:bg-[#1A4D2E] hover:text-white hover:border-[#1A4D2E] transition-colors"
                  >
                    <span>Manage Topics ({topicCount})</span>
                    <ArrowRight className="size-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Topics Management & Quick OCR Launcher Table */}
      <div className="rounded-3xl border border-[#E5E0D8] bg-[#FFFFFF] p-6 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-[#2A2422]">
              Topic Lessons & Note Studio
            </h2>
            <p className="text-xs text-[#7A726D]">
              Click any topic to enter Note Studio or run Gemini handwritten note OCR
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#7A726D]" />
              <input
                type="text"
                placeholder="Search topic or subject..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-[#E5E0D8] bg-[#FDFBF7] pl-8 pr-3 py-2 text-xs text-[#2A2422] placeholder:text-[#7A726D] focus:border-[#1A4D2E] focus:outline-none"
              />
            </div>

            <select
              value={selectedSubjectFilter}
              onChange={(e) => setSelectedSubjectFilter(e.target.value)}
              className="rounded-xl border border-[#E5E0D8] bg-[#FDFBF7] px-3 py-2 text-xs text-[#2A2422] focus:border-[#1A4D2E] focus:outline-none"
            >
              <option value="all">All Subjects</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Topics Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E5E0D8] text-[#7A726D] font-semibold">
                <th className="pb-3 px-3">Subject</th>
                <th className="pb-3 px-3">Topic Title</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3">Duration</th>
                <th className="pb-3 px-3">Note Blocks</th>
                <th className="pb-3 px-3">Questions</th>
                <th className="pb-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E0D8]/60">
              {filteredTopics.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#7A726D]">
                    No topics found matching your query.
                  </td>
                </tr>
              ) : (
                filteredTopics.map((topic) => (
                  <tr key={topic.id} className="hover:bg-[#FDFBF7] transition-colors group">
                    <td className="py-3 px-3 font-medium text-[#7A726D]">{topic.subjectName}</td>
                    <td className="py-3 px-3 font-semibold text-[#2A2422]">
                      <Link
                        to="/admin/topics/$id"
                        params={{ id: topic.id }}
                        className="hover:text-[#1A4D2E] hover:underline flex items-center gap-1.5"
                      >
                        <span>{topic.title}</span>
                      </Link>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                          topic.status === "published"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {topic.status === "published" ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#7A726D]">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        <span>{topic.minutes || 15} min</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#7A726D]">
                      {topic.notes?.length || 0 > 0 ? (
                        <span className="text-[#2A2422] font-medium">
                          {topic.notes?.length} blocks
                        </span>
                      ) : (
                        <span className="text-amber-700 font-medium">Empty (needs notes)</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-[#7A726D]">
                      {topic.questions?.length || 0} questions
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to="/admin/topics/$id"
                          params={{ id: topic.id }}
                          className="inline-flex items-center gap-1 rounded-lg bg-[#1A4D2E] px-3 py-1.5 font-semibold text-white hover:bg-[#143d24] transition-colors text-[11px]"
                        >
                          <Sparkles className="size-3" />
                          <span>Note Studio / OCR</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Audit & Ops Trail */}
      <div className="rounded-3xl border border-[#E5E0D8] bg-[#FFFFFF] p-6 shadow-xs">
        <h2 className="font-display text-xl font-bold text-[#2A2422] mb-3">Recent Admin Audit</h2>
        <div className="space-y-2">
          {ops.audit.slice(0, 4).map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between text-xs py-2 border-b border-[#E5E0D8]/60 last:border-0"
            >
              <div className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-[#1A4D2E]" />
                <span className="font-semibold text-[#2A2422]">{item.action}:</span>
                <span className="text-[#7A726D]">{item.target}</span>
              </div>
              <span className="text-[11px] text-[#7A726D]">{item.at}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Create New Topic */}
      {isNewTopicModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl border border-[#E5E0D8] bg-[#FFFFFF] p-6 shadow-xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E0D8]">
              <h3 className="font-display text-xl font-bold text-[#2A2422]">Add New Topic</h3>
              <button
                type="button"
                onClick={() => setIsNewTopicModalOpen(false)}
                className="rounded-full p-1 text-[#7A726D] hover:bg-[#F4EFEA]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTopic} className="mt-4 space-y-4">
              {formError && (
                <div className="rounded-xl bg-red-50 p-3 text-xs text-red-700 font-medium">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A726D] mb-1">
                  Subject
                </label>
                <select
                  value={newSubId}
                  onChange={(e) => setNewSubId(e.target.value)}
                  className="w-full rounded-xl border border-[#E5E0D8] bg-[#FDFBF7] px-3 py-2.5 text-sm text-[#2A2422] focus:border-[#1A4D2E] focus:outline-none"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.group})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A726D] mb-1">
                  Topic Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Simple Harmonic Motion"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-xl border border-[#E5E0D8] bg-[#FDFBF7] px-3 py-2.5 text-sm text-[#2A2422] focus:border-[#1A4D2E] focus:outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A726D] mb-1">
                  One-Line Subtitle / Summary
                </label>
                <input
                  type="text"
                  placeholder="e.g., Period, frequency, displacement, and restoring force."
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  className="w-full rounded-xl border border-[#E5E0D8] bg-[#FDFBF7] px-3 py-2.5 text-sm text-[#2A2422] focus:border-[#1A4D2E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A726D] mb-1">
                  Estimated Reading Minutes
                </label>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={newMinutes}
                  onChange={(e) => setNewMinutes(Number(e.target.value) || 15)}
                  className="w-full rounded-xl border border-[#E5E0D8] bg-[#FDFBF7] px-3 py-2.5 text-sm text-[#2A2422] focus:border-[#1A4D2E] focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-[#E5E0D8] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewTopicModalOpen(false)}
                  className="rounded-full border border-[#E5E0D8] bg-[#FDFBF7] px-4 py-2 text-xs font-semibold text-[#2A2422] hover:bg-[#F4EFEA]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#1A4D2E] px-5 py-2 text-xs font-semibold text-white hover:bg-[#143d24]"
                >
                  Create & Launch Note Studio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
