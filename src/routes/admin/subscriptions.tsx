import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { TERM_PRICE } from "@/lib/payments";
import { naira } from "@/lib/format";

export const Route = createFileRoute("/admin/subscriptions")({
  component: SubscriptionsPage,
});

function SubscriptionsPage() {
  const [termPrice, setTermPrice] = useState(TERM_PRICE);
  const [annualPrice, setAnnualPrice] = useState(12000);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 font-sans pb-16">
      <div>
        <h1 className="font-display text-3xl font-bold text-[#2A2422]">Subscriptions & Pricing</h1>
        <p className="mt-1 text-sm text-[#7A726D]">
          Configure student term tuition, trial periods, and school group licensing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <form onSubmit={handleSave} className="rounded-3xl border border-[#E5E0D8] bg-[#FFFFFF] p-6 shadow-xs space-y-4">
          <h2 className="font-display text-xl font-bold text-[#2A2422]">Access Pricing Models</h2>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A726D] mb-1">
              Per-Term Student Access (NGN)
            </label>
            <input
              type="number"
              value={termPrice}
              onChange={(e) => setTermPrice(Number(e.target.value) || 0)}
              className="w-full rounded-xl border border-[#E5E0D8] bg-[#FDFBF7] px-3 py-2.5 text-sm text-[#2A2422] focus:border-[#1A4D2E] focus:outline-none"
            />
            <p className="text-xs text-[#7A726D] mt-1">Currently {naira(termPrice)} per academic term.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A726D] mb-1">
              Annual All-Subject Pass (NGN)
            </label>
            <input
              type="number"
              value={annualPrice}
              onChange={(e) => setAnnualPrice(Number(e.target.value) || 0)}
              className="w-full rounded-xl border border-[#E5E0D8] bg-[#FDFBF7] px-3 py-2.5 text-sm text-[#2A2422] focus:border-[#1A4D2E] focus:outline-none"
            />
            <p className="text-xs text-[#7A726D] mt-1">Currently {naira(annualPrice)} full year access.</p>
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-[#1A4D2E] py-3 text-sm font-semibold text-white hover:bg-[#143d24] transition-colors"
          >
            {saved ? "Saved Pricing Changes" : "Update Pricing Tier"}
          </button>
        </form>

        <div className="rounded-3xl border border-[#E5E0D8] bg-[#FFFFFF] p-6 shadow-xs space-y-4">
          <h2 className="font-display text-xl font-bold text-[#2A2422]">Subscription Breakdown</h2>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-[#E5E0D8]/60">
              <span className="text-[#7A726D]">Active Term Subscribers</span>
              <span className="font-bold text-[#2A2422]">142 students</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#E5E0D8]/60">
              <span className="text-[#7A726D]">Free 7-Day Trial</span>
              <span className="font-bold text-[#2A2422]">38 students</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#E5E0D8]/60">
              <span className="text-[#7A726D]">School Institutional Access</span>
              <span className="font-bold text-[#2A2422]">3 secondary schools</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
