import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Laptop, Sparkles, Sliders, CheckCircle2 } from "lucide-react";
import { useContent } from "@/lib/content";

export const Route = createFileRoute("/admin/cbt")({
  component: CbtGeneratorPage,
});

function CbtGeneratorPage() {
  const subjects = useContent((s) => s.subjects);
  const [examType, setExamType] = useState<"JAMB" | "WAEC">("JAMB");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(["physics", "chemistry", "mathematics"]);
  const [questionCount, setQuestionCount] = useState(40);
  const [timerMinutes, setTimerMinutes] = useState(60);
  const [generated, setGenerated] = useState(false);

  const toggleSubject = (id: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setGenerated(true);
  };

  return (
    <div className="space-y-6 font-sans pb-16">
      <div>
        <h1 className="font-display text-3xl font-bold text-[#2A2422]">CBT Exam Generator</h1>
        <p className="mt-1 text-sm text-[#7A726D]">
          Configure mock Computer Based Test exams matching official JAMB and WAEC formats.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <form
          onSubmit={handleGenerate}
          className="md:col-span-2 rounded-3xl border border-[#E5E0D8] bg-[#FFFFFF] p-6 shadow-xs space-y-5"
        >
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A726D] mb-2">
              Exam Standard
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(["JAMB", "WAEC"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setExamType(type)}
                  className={`rounded-2xl border p-4 text-left transition-colors ${
                    examType === type
                      ? "border-[#1A4D2E] bg-[#1A4D2E]/5 text-[#1A4D2E] font-semibold"
                      : "border-[#E5E0D8] bg-[#FDFBF7] text-[#2A2422]"
                  }`}
                >
                  <p className="font-display text-lg font-bold">{type}</p>
                  <p className="text-xs text-[#7A726D] mt-0.5">
                    {type === "JAMB" ? "4-subject combination · 120 mins" : "Individual subject mock exams"}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A726D] mb-2">
              Select Subjects Included
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {subjects.map((s) => {
                const checked = selectedSubjects.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleSubject(s.id)}
                    className={`rounded-xl border px-3 py-2 text-xs font-medium text-left transition-colors flex items-center justify-between ${
                      checked
                        ? "border-[#1A4D2E] bg-[#1A4D2E] text-white"
                        : "border-[#E5E0D8] bg-[#FDFBF7] text-[#2A2422] hover:bg-[#F4EFEA]"
                    }`}
                  >
                    <span>{s.name}</span>
                    {checked && <CheckCircle2 className="size-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A726D] mb-1">
                Questions Per Subject
              </label>
              <input
                type="number"
                min={5}
                max={60}
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value) || 40)}
                className="w-full rounded-xl border border-[#E5E0D8] bg-[#FDFBF7] px-3 py-2.5 text-sm text-[#2A2422] focus:border-[#1A4D2E] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A726D] mb-1">
                Total Exam Duration (Minutes)
              </label>
              <input
                type="number"
                min={15}
                max={180}
                value={timerMinutes}
                onChange={(e) => setTimerMinutes(Number(e.target.value) || 60)}
                className="w-full rounded-xl border border-[#E5E0D8] bg-[#FDFBF7] px-3 py-2.5 text-sm text-[#2A2422] focus:border-[#1A4D2E] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-[#1A4D2E] py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#143d24] transition-colors"
          >
            Generate Mock Test Package
          </button>
        </form>

        <div className="rounded-3xl border border-[#E5E0D8] bg-[#FFFFFF] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-display text-xl font-bold text-[#2A2422]">CBT Session Preview</h3>
            <p className="text-xs text-[#7A726D] mt-1">Configured parameters for the live student environment</p>

            <div className="mt-5 space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-[#E5E0D8]/60">
                <span className="text-[#7A726D]">Standard</span>
                <span className="font-semibold text-[#2A2422]">{examType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E5E0D8]/60">
                <span className="text-[#7A726D]">Subjects</span>
                <span className="font-semibold text-[#2A2422]">{selectedSubjects.length} selected</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E5E0D8]/60">
                <span className="text-[#7A726D]">Total Items</span>
                <span className="font-semibold text-[#2A2422]">{selectedSubjects.length * questionCount} items</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E5E0D8]/60">
                <span className="text-[#7A726D]">Duration</span>
                <span className="font-semibold text-[#2A2422]">{timerMinutes} minutes</span>
              </div>
            </div>
          </div>

          {generated && (
            <div className="mt-6 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-800">
              <p className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-emerald-700" />
                CBT Test Package Active!
              </p>
              <p className="mt-1">Students can now take this simulated examination.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
