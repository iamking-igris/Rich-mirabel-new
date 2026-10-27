import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { HelpCircle, Search, Sparkles, Filter, ExternalLink } from "lucide-react";
import { useContent } from "@/lib/content";

export const Route = createFileRoute("/admin/past-questions")({
  component: PastQuestionsPage,
});

function PastQuestionsPage() {
  const subjects = useContent((s) => s.subjects);
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [search, setSearch] = useState("");

  const allQuestions = subjects.flatMap((s) =>
    s.topics.flatMap((t) =>
      t.questions.map((q) => ({
        ...q,
        subjectName: s.name,
        topicId: t.id,
        topicTitle: t.title,
      }))
    )
  );

  const filtered = allQuestions.filter((q) => {
    const matchesSub = selectedSubject === "all" || q.subjectName.toLowerCase() === selectedSubject.toLowerCase();
    const matchesSearch =
      search.trim() === "" ||
      q.prompt.toLowerCase().includes(search.toLowerCase()) ||
      q.topicTitle.toLowerCase().includes(search.toLowerCase());
    return matchesSub && matchesSearch;
  });

  return (
    <div className="space-y-6 font-sans pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#2A2422]">Past Questions Bank</h1>
          <p className="mt-1 text-sm text-[#7A726D]">
            Curated WAEC and JAMB exam questions organized by subject and syllabus topic.
          </p>
        </div>
        <div className="rounded-full bg-[#1A4D2E]/10 px-4 py-2 text-xs font-semibold text-[#1A4D2E] self-start sm:self-auto">
          {allQuestions.length} Questions Cataloged
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#7A726D]" />
          <input
            type="text"
            placeholder="Search questions by prompt or topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[#E5E0D8] bg-[#FFFFFF] pl-9 pr-3 py-2 text-xs text-[#2A2422] focus:border-[#1A4D2E] focus:outline-none"
          />
        </div>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="rounded-xl border border-[#E5E0D8] bg-[#FFFFFF] px-3 py-2 text-xs text-[#2A2422] focus:border-[#1A4D2E] focus:outline-none"
        >
          <option value="all">All Subjects</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#E5E0D8] p-10 text-center bg-[#FFFFFF]">
            <p className="text-sm text-[#7A726D]">No questions found matching your filter criteria.</p>
          </div>
        ) : (
          filtered.slice(0, 30).map((q, idx) => (
            <div key={q.id || idx} className="rounded-2xl border border-[#E5E0D8] bg-[#FFFFFF] p-5 shadow-xs space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-[#F4EFEA] px-2 py-0.5 text-[10px] font-semibold text-[#7A726D]">
                    {q.subjectName}
                  </span>
                  <span className="text-xs text-[#7A726D]">· {q.topicTitle}</span>
                </div>
                <Link
                  to="/admin/topics/$id"
                  params={{ id: q.topicId }}
                  className="text-xs font-semibold text-[#1A4D2E] hover:underline flex items-center gap-1"
                >
                  <span>Edit in Topic</span>
                  <ExternalLink className="size-3" />
                </Link>
              </div>

              <p className="text-sm font-medium text-[#2A2422] leading-relaxed">{q.prompt}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {q.options?.map((opt) => (
                  <div
                    key={opt.key}
                    className={`rounded-xl border px-3 py-2 text-xs flex items-center gap-2 ${
                      opt.key === q.answer
                        ? "border-[#1A4D2E] bg-[#1A4D2E]/5 font-semibold text-[#1A4D2E]"
                        : "border-[#E5E0D8] bg-[#FDFBF7] text-[#2A2422]"
                    }`}
                  >
                    <span className="size-5 rounded-full border border-current flex items-center justify-center text-[10px] font-bold shrink-0">
                      {opt.key}
                    </span>
                    <span>{opt.text}</span>
                  </div>
                ))}
              </div>

              {q.explain && (
                <div className="rounded-xl bg-[#F4EFEA] p-3 text-xs text-[#7A726D] mt-2">
                  <strong className="text-[#2A2422]">Explanation:</strong> {q.explain}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
