import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  BookOpen,
  Plus,
  Search,
  Sparkles,
  Clock,
  Layers,
  FileText,
  HelpCircle,
  Trash2,
  CheckCircle,
  Eye,
  Check,
  AlertCircle,
  FolderOpen,
} from "lucide-react";
import { useContent } from "@/lib/content";
import type { Topic, Subject } from "@/data/catalog";

export const Route = createFileRoute("/admin/subjects")({
  component: AdminSubjectsPage,
});

function AdminSubjectsPage() {
  const navigate = useNavigate();
  const subjects = useContent((s) => s.subjects);
  const upsertSubject = useContent((s) => s.upsertSubject);
  const upsertTopic = useContent((s) => s.upsertTopic);
  const removeTopic = useContent((s) => s.removeTopic);

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft" | "needs-notes">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New topic form
  const [modalSubId, setModalSubId] = useState<string>(subjects[0]?.id || "physics");
  const [topicTitle, setTopicTitle] = useState("");
  const [topicSummary, setTopicSummary] = useState("");
  const [topicMinutes, setTopicMinutes] = useState(15);
  const [errorMsg, setErrorMsg] = useState("");

  const currentSubject = subjects.find((s) => s.id === selectedSubjectId);

  // Collect topics to display
  const allTopicItems = subjects.flatMap((s) =>
    s.topics.map((t) => ({ ...t, subjectId: s.id, subjectName: s.name, subjectExam: s.exam }))
  );

  const filteredTopics = allTopicItems.filter((t) => {
    const matchesSubject = selectedSubjectId === "all" || t.subjectId === selectedSubjectId;
    const matchesQuery =
      search.trim() === "" ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.summary?.toLowerCase().includes(search.toLowerCase()) ||
      t.subjectName.toLowerCase().includes(search.toLowerCase());

    let matchesStatus = true;
    if (statusFilter === "published") matchesStatus = t.status === "published";
    if (statusFilter === "draft") matchesStatus = t.status !== "published";
    if (statusFilter === "needs-notes") matchesStatus = (t.notes?.length || 0) === 0;

    return matchesSubject && matchesQuery && matchesStatus;
  });

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicTitle.trim()) {
      setErrorMsg("Please enter a title for the topic.");
      return;
    }

    const baseSlug = topicTitle
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const newId = `${baseSlug}-${Date.now().toString(36).substring(0, 4)}`;

    // Brand new topic: clean blank notes with no mock-up data until blocks added or uploaded
    const freshTopic: Topic = {
      id: newId,
      title: topicTitle.trim(),
      minutes: Number(topicMinutes) || 15,
      summary: topicSummary.trim() || `Study notes and practice questions for ${topicTitle.trim()}.`,
      notes: [],
      questions: [],
      status: "draft",
      origin: "demo",
    };

    upsertTopic(modalSubId, freshTopic);
    setIsModalOpen(false);
    setTopicTitle("");
    setTopicSummary("");
    setErrorMsg("");

    navigate({ to: `/admin/topics/$id`, params: { id: newId } });
  };

  const handleTogglePublish = (subjectId: string, topic: Topic) => {
    const nextStatus = topic.status === "published" ? "draft" : "published";
    upsertTopic(subjectId, { ...topic, status: nextStatus });
  };

  const handleDeleteTopic = (subjectId: string, topicId: string, topicTitle: string) => {
    if (confirm(`Are you sure you want to delete topic "${topicTitle}"?`)) {
      removeTopic(subjectId, topicId);
    }
  };

  return (
    <div className="space-y-7 font-sans pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#2A2422]">Subjects & Content</h1>
          <p className="mt-1 text-sm text-[#7A726D]">
            Curriculum syllabi, digitized handwritten teaching notes, and exam question sets.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setModalSubId(selectedSubjectId === "all" ? (subjects[0]?.id || "physics") : selectedSubjectId);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-full bg-[#1A4D2E] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#143d24] transition-colors self-start sm:self-auto"
        >
          <Plus className="size-4" />
          <span>New Topic</span>
        </button>
      </div>

      {/* Subject Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          type="button"
          onClick={() => setSelectedSubjectId("all")}
          className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
            selectedSubjectId === "all"
              ? "bg-[#1A4D2E] text-white"
              : "bg-[#FFFFFF] border border-[#E5E0D8] text-[#2A2422] hover:bg-[#F4EFEA]"
          }`}
        >
          All Subjects ({subjects.reduce((sum, s) => sum + s.topics.length, 0)})
        </button>

        {subjects.map((sub) => {
          const isSelected = selectedSubjectId === sub.id;
          return (
            <button
              key={sub.id}
              type="button"
              onClick={() => setSelectedSubjectId(sub.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                isSelected
                  ? "bg-[#1A4D2E] text-white"
                  : "bg-[#FFFFFF] border border-[#E5E0D8] text-[#2A2422] hover:bg-[#F4EFEA]"
              }`}
            >
              <span>{sub.name}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                  isSelected ? "bg-white/20 text-white" : "bg-[#F4EFEA] text-[#7A726D]"
                }`}
              >
                {sub.topics.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Subject Information Card (when single subject selected) */}
      {currentSubject && (
        <div className="rounded-2xl border border-[#E5E0D8] bg-[#FFFFFF] p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7A726D]">
                {currentSubject.group} · {currentSubject.exam}
              </span>
              <span className="size-1 rounded-full bg-[#E5E0D8]" />
              <span className="text-[11px] font-semibold text-[#1A4D2E]">
                {currentSubject.topics.length} curriculum topics
              </span>
            </div>
            <h2 className="font-display text-2xl font-bold text-[#2A2422] mt-0.5">
              {currentSubject.name}
            </h2>
            <p className="mt-1 text-xs text-[#7A726D] max-w-2xl">{currentSubject.blurb}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setModalSubId(currentSubject.id);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#1A4D2E] bg-[#1A4D2E]/5 px-4 py-2 text-xs font-semibold text-[#1A4D2E] hover:bg-[#1A4D2E] hover:text-white transition-colors"
            >
              <Plus className="size-3.5" />
              <span>Add Topic to {currentSubject.name}</span>
            </button>
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#7A726D]" />
          <input
            type="text"
            placeholder="Search topic title or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[#E5E0D8] bg-[#FFFFFF] pl-9 pr-3 py-2 text-xs text-[#2A2422] placeholder:text-[#7A726D] focus:border-[#1A4D2E] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#7A726D] hidden sm:inline">Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="rounded-xl border border-[#E5E0D8] bg-[#FFFFFF] px-3 py-2 text-xs text-[#2A2422] focus:border-[#1A4D2E] focus:outline-none"
          >
            <option value="all">All Topics ({allTopicItems.length})</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
            <option value="needs-notes">Needs Notes (Empty)</option>
          </select>
        </div>
      </div>

      {/* Topic Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTopics.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-[#E5E0D8] p-12 text-center bg-[#FFFFFF]">
            <FolderOpen className="size-8 mx-auto text-[#7A726D] mb-2" />
            <p className="font-display text-lg font-bold text-[#2A2422]">No topics found</p>
            <p className="mt-1 text-xs text-[#7A726D]">
              Try clearing filters or click "New Topic" to create a new lesson.
            </p>
          </div>
        ) : (
          filteredTopics.map((topic) => {
            const isPublished = topic.status === "published";
            const hasNotes = (topic.notes?.length || 0) > 0;
            const qCount = topic.questions?.length || 0;

            return (
              <div
                key={topic.id}
                className="rounded-2xl border border-[#E5E0D8] bg-[#FFFFFF] p-5 shadow-xs hover:border-[#1A4D2E]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7A726D]">
                        {topic.subjectName}
                      </span>
                      <h3 className="font-display text-lg font-bold text-[#2A2422] leading-tight">
                        {topic.title}
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleTogglePublish(topic.subjectId, topic)}
                      title={`Click to mark as ${isPublished ? "Draft" : "Published"}`}
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors shrink-0 ${
                        isPublished
                          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                          : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                      }`}
                    >
                      {isPublished ? (
                        <>
                          <CheckCircle className="size-3" />
                          <span>Published</span>
                        </>
                      ) : (
                        <>
                          <Clock className="size-3" />
                          <span>Draft</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="mt-2 text-xs text-[#7A726D] line-clamp-2 leading-relaxed">
                    {topic.summary || "No description provided yet."}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-[#7A726D]">
                    <span className="inline-flex items-center gap-1 rounded-md bg-[#F4EFEA] px-2 py-0.5">
                      <Clock className="size-3 text-[#7A726D]" />
                      <span>{topic.minutes || 15} min read</span>
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 ${
                        hasNotes
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      <FileText className="size-3" />
                      <span>{hasNotes ? `${topic.notes.length} Note Blocks` : "Empty Note"}</span>
                    </span>

                    <span className="inline-flex items-center gap-1 rounded-md bg-[#F4EFEA] px-2 py-0.5">
                      <HelpCircle className="size-3 text-[#7A726D]" />
                      <span>{qCount} Questions</span>
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#E5E0D8]/60 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleDeleteTopic(topic.subjectId, topic.id, topic.title)}
                    className="p-1.5 rounded-lg text-[#7A726D] hover:text-red-700 hover:bg-red-50 transition-colors"
                    title="Delete topic"
                  >
                    <Trash2 className="size-4" />
                  </button>

                  <div className="flex items-center gap-2">
                    <Link
                      to="/admin/topics/$id"
                      params={{ id: topic.id }}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#1A4D2E] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#143d24] transition-colors"
                    >
                      <Sparkles className="size-3.5" />
                      <span>Note Studio & OCR</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Add Topic */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl border border-[#E5E0D8] bg-[#FFFFFF] p-6 shadow-xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E0D8]">
              <h3 className="font-display text-xl font-bold text-[#2A2422]">Create New Topic</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-1 text-[#7A726D] hover:bg-[#F4EFEA]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTopic} className="mt-4 space-y-4">
              {errorMsg && (
                <div className="rounded-xl bg-red-50 p-3 text-xs text-red-700 font-medium">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A726D] mb-1">
                  Subject
                </label>
                <select
                  value={modalSubId}
                  onChange={(e) => setModalSubId(e.target.value)}
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
                  placeholder="e.g., Photosynthesis & Plant Nutrition"
                  value={topicTitle}
                  onChange={(e) => setTopicTitle(e.target.value)}
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
                  placeholder="e.g., Light and dark reactions, chlorophyll, and factors affecting rate."
                  value={topicSummary}
                  onChange={(e) => setTopicSummary(e.target.value)}
                  className="w-full rounded-xl border border-[#E5E0D8] bg-[#FDFBF7] px-3 py-2.5 text-sm text-[#2A2422] focus:border-[#1A4D2E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A726D] mb-1">
                  Estimated Reading Duration (Minutes)
                </label>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={topicMinutes}
                  onChange={(e) => setTopicMinutes(Number(e.target.value) || 15)}
                  className="w-full rounded-xl border border-[#E5E0D8] bg-[#FDFBF7] px-3 py-2.5 text-sm text-[#2A2422] focus:border-[#1A4D2E] focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-[#E5E0D8] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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
