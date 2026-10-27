import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DollarSign, CheckCircle2, Search, ArrowUpRight } from "lucide-react";
import { naira } from "@/lib/format";

export const Route = createFileRoute("/admin/payments")({
  component: PaymentsPage,
});

const demoPayments = [
  { id: "PAY-901", user: "Adaeze Okonkwo", amount: 4500, method: "Paystack Card", date: "2026-10-24 11:20", status: "Successful" },
  { id: "PAY-902", user: "Chinedu Bello", amount: 4500, method: "Bank Transfer", date: "2026-10-23 15:45", status: "Successful" },
  { id: "PAY-903", user: "Fatima Yusuf", amount: 12000, method: "Paystack Card", date: "2026-10-20 09:12", status: "Successful" },
  { id: "PAY-904", user: "Tunde Adebayo", amount: 4500, method: "USSD", date: "2026-10-12 18:30", status: "Failed" },
  { id: "PAY-905", user: "Ngozi Eze", amount: 4500, method: "Paystack Card", date: "2026-10-10 14:02", status: "Successful" },
];

function PaymentsPage() {
  const [search, setSearch] = useState("");

  const filtered = demoPayments.filter(
    (p) =>
      p.user.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = demoPayments
    .filter((p) => p.status === "Successful")
    .reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="space-y-6 font-sans pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#2A2422]">Payments & Revenue</h1>
          <p className="mt-1 text-sm text-[#7A726D]">
            Track verified tuition payments, transaction logs, and payout balances.
          </p>
        </div>
        <div className="rounded-2xl border border-[#1A4D2E]/20 bg-[#1A4D2E]/5 px-5 py-3 text-right">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#1A4D2E]">Total Term Revenue</p>
          <p className="font-display text-2xl font-bold text-[#1A4D2E]">{naira(totalRevenue)}</p>
        </div>
      </div>

      <div className="rounded-3xl border border-[#E5E0D8] bg-[#FFFFFF] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E5E0D8] text-[#7A726D] font-semibold bg-[#FDFBF7]">
                <th className="py-3 px-4">Reference</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E0D8]/60">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-[#FDFBF7] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-semibold text-[#2A2422]">{p.id}</td>
                  <td className="py-3.5 px-4 font-medium text-[#2A2422]">{p.user}</td>
                  <td className="py-3.5 px-4 font-bold text-[#2A2422]">{naira(p.amount)}</td>
                  <td className="py-3.5 px-4 text-[#7A726D]">{p.method}</td>
                  <td className="py-3.5 px-4 text-[#7A726D]">{p.date}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                        p.status === "Successful"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
