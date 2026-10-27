import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, TrendingUp, Users, BookOpen, Clock } from "lucide-react";
import { useContent } from "@/lib/content";

export const Route = createFileRoute("/admin/analytics")({
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const subjects = useContent((s) => s.subjects);
  const totalTopics = subjects.reduce((sum, s) => sum + s.topics.length, 0);

  return (
    <div className="space-y-6 font-sans pb-16">
      <div>
        <h1 className="font-display text-3xl font-bold text-[#2A2422]">Curriculum & Study Analytics</h1>
        <p className="mt-1 text-sm text-[#7A726D]">
          Topic study velocity, difficulty index from student attempts, and reading times.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-[#E5E0D8] bg-[#FFFFFF] p-5 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#7A726D]">Avg. Note Read Time</p>
          <p className="font-display text-3xl font-bold text-[#2A2422] mt-2">16.4 mins</p>
          <p className="text-xs text-[#7A726D] mt-1">Calculated across 42 active topics</p>
        </div>
        <div className="rounded-2xl border border-[#E5E0D8] bg-[#FFFFFF] p-5 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#7A726D]">CBT Completion Rate</p>
          <p className="font-display text-3xl font-bold text-[#1A4D2E] mt-2">78.2%</p>
          <p className="text-xs text-[#7A726D] mt-1">Students finishing full 40-item tests</p>
        </div>
        <div className="rounded-2xl border border-[#E5E0D8] bg-[#FFFFFF] p-5 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#7A726D]">Hardest Subject Topic</p>
          <p className="font-display text-xl font-bold text-[#2A2422] mt-2">Electrolysis (Chem)</p>
          <p className="text-xs text-[#7A726D] mt-1">Average score 52.4%</p>
        </div>
      </div>

      <div className="rounded-3xl border border-[#E5E0D8] bg-[#FFFFFF] p-6 shadow-xs space-y-4">
        <h2 className="font-display text-xl font-bold text-[#2A2422]">Subject Topic Distribution</h2>
        <div className="space-y-3">
          {subjects.map((s) => {
            const pct = Math.round((s.topics.length / Math.max(1, totalTopics)) * 100);
            return (
              <div key={s.id} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-[#2A2422]">{s.name}</span>
                  <span className="text-[#7A726D]">{s.topics.length} topics ({pct}%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#F4EFEA] overflow-hidden">
                  <div className="h-full bg-[#1A4D2E]" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
