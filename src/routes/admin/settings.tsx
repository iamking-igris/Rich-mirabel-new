import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Settings, Sparkles, Check, Database, RefreshCw } from "lucide-react";
import { useContent } from "@/lib/content";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const resetContent = useContent((s) => s.resetContent);
  const [geminiStatus, setGeminiStatus] = useState("Connected · gemini-2.5-flash");
  const [resetDone, setResetDone] = useState(false);

  const handleResetCatalog = () => {
    if (confirm("Reset curriculum content to shipped seed defaults? Custom topics will be refreshed.")) {
      resetContent();
      setResetDone(true);
      setTimeout(() => setResetDone(false), 3000);
    }
  };

  return (
    <div className="space-y-6 font-sans pb-16">
      <div>
        <h1 className="font-display text-3xl font-bold text-[#2A2422]">Admin & System Settings</h1>
        <p className="mt-1 text-sm text-[#7A726D]">
          Configure AI engine models, curriculum seed state, and system credentials.
        </p>
      </div>

      <div className="rounded-3xl border border-[#E5E0D8] bg-[#FFFFFF] p-6 shadow-xs space-y-5">
        <h2 className="font-display text-xl font-bold text-[#2A2422]">AI OCR Configuration</h2>
        <div className="rounded-2xl border border-[#1A4D2E]/20 bg-[#1A4D2E]/5 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#1A4D2E] p-2 text-white">
              <Sparkles className="size-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#2A2422]">Gemini Vision OCR Engine</p>
              <p className="text-xs text-[#7A726D]">Model: gemini-2.5-flash (TanStack Server Function)</p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-semibold">
            {geminiStatus}
          </span>
        </div>
      </div>

      <div className="rounded-3xl border border-[#E5E0D8] bg-[#FFFFFF] p-6 shadow-xs space-y-4">
        <h2 className="font-display text-xl font-bold text-[#2A2422]">Curriculum Data State</h2>
        <p className="text-xs text-[#7A726D]">
          Reset local catalog cache to default WAEC/JAMB physics, chemistry, biology, and math syllabi.
        </p>
        <button
          type="button"
          onClick={handleResetCatalog}
          className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors"
        >
          <RefreshCw className="size-3.5" />
          <span>{resetDone ? "Catalog Restored to Defaults!" : "Reset Content Catalog"}</span>
        </button>
      </div>
    </div>
  );
}
