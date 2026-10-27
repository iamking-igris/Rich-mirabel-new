import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Users, Search, ShieldCheck, Mail, Calendar } from "lucide-react";
import { demoUsers, type DemoUser } from "@/lib/admin-ops";

export const Route = createFileRoute("/admin/students")({
  component: StudentsPage,
});

function StudentsPage() {
  const [users, setUsers] = useState<DemoUser[]>(demoUsers);
  const [search, setSearch] = useState("");

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#2A2422]">Student Directory</h1>
          <p className="mt-1 text-sm text-[#7A726D]">
            Manage registered learners, track trial vs paid subscriptions, and review activity.
          </p>
        </div>
        <div className="rounded-full bg-[#1A4D2E]/10 px-4 py-2 text-xs font-semibold text-[#1A4D2E] self-start sm:self-auto">
          {users.length} Registered Students
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#7A726D]" />
        <input
          type="text"
          placeholder="Search student by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-[#E5E0D8] bg-[#FFFFFF] pl-9 pr-3 py-2 text-xs text-[#2A2422] focus:border-[#1A4D2E] focus:outline-none"
        />
      </div>

      <div className="rounded-3xl border border-[#E5E0D8] bg-[#FFFFFF] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E5E0D8] text-[#7A726D] font-semibold bg-[#FDFBF7]">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Access Tier</th>
                <th className="py-3 px-4">Enrolled Subjects</th>
                <th className="py-3 px-4">Registered</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E0D8]/60">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-[#FDFBF7] transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-[#2A2422]">{u.name}</p>
                    <p className="text-[11px] text-[#7A726D]">{u.email}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                        u.access === "Paid"
                          ? "bg-emerald-100 text-emerald-800"
                          : u.access === "Trial"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {u.access}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#7A726D]">
                    {u.subjects.join(", ")}
                  </td>
                  <td className="py-3.5 px-4 text-[#7A726D]">{u.registered}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block size-2 rounded-full ${
                        u.status === "Active" ? "bg-emerald-600" : "bg-red-500"
                      }`}
                    />
                    <span className="ml-1.5 text-xs text-[#2A2422] font-medium">{u.status}</span>
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
