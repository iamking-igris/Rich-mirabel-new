export type DemoUser = {
  id: string; name: string; email: string; registered: string; status: "Active" | "Suspended";
  subjects: string[]; lastActive: string; access: "Trial" | "Paid" | "Expired" | "Manual";
};
export type DemoTicket = { id: string; user: string; category: string; body: string; status: "Open" | "Pending" | "Closed"; priority: "Low" | "Normal" | "High"; };
export type DemoJob = { id: string; type: "Notes" | "Quiz"; pages: number; status: "Queued" | "Needs review" | "Completed" | "Failed"; created: string; };
export type AuditEvent = { id: string; actor: string; action: string; target: string; at: string; reason?: string; };

export const demoUsers: DemoUser[] = [
  { id: "u_01", name: "Adaeze Okonkwo", email: "adaeze@example.com", registered: "2026-10-02", status: "Active", subjects: ["Physics", "Chemistry", "Mathematics", "English"], lastActive: "2026-10-24", access: "Trial" },
  { id: "u_02", name: "Chinedu Bello", email: "chinedu@example.com", registered: "2026-09-18", status: "Active", subjects: ["Physics", "Mathematics", "Biology", "English"], lastActive: "2026-10-23", access: "Paid" },
  { id: "u_03", name: "Fatima Yusuf", email: "fatima@example.com", registered: "2026-08-30", status: "Active", subjects: ["Chemistry", "Biology", "Mathematics", "English"], lastActive: "2026-10-20", access: "Paid" },
  { id: "u_04", name: "Tunde Adebayo", email: "tunde@example.com", registered: "2026-10-10", status: "Suspended", subjects: ["Physics", "Chemistry", "Biology", "English"], lastActive: "2026-10-12", access: "Expired" },
  { id: "u_05", name: "Ngozi Eze", email: "ngozi@example.com", registered: "2026-10-15", status: "Active", subjects: ["Physics", "Mathematics", "English", "Chemistry"], lastActive: "2026-10-24", access: "Manual" },
];

export const demoTickets: DemoTicket[] = [
  { id: "t_01", user: "Adaeze Okonkwo", category: "Payment", body: "Paid but access still shows trial.", status: "Open", priority: "High" },
  { id: "t_02", user: "Chinedu Bello", category: "Lesson content", body: "Wave diagram label is unclear.", status: "Pending", priority: "Normal" },
  { id: "t_03", user: "Fatima Yusuf", category: "Incorrect answer", body: "Quadratic Q3 key looks wrong.", status: "Open", priority: "Normal" },
];

export const demoJobs: DemoJob[] = [
  { id: "j_notes_01", type: "Notes", pages: 6, status: "Needs review", created: "2026-10-23" },
  { id: "j_quiz_01", type: "Quiz", pages: 12, status: "Needs review", created: "2026-10-22" },
  { id: "j_notes_02", type: "Notes", pages: 4, status: "Completed", created: "2026-10-20" },
  { id: "j_quiz_02", type: "Quiz", pages: 8, status: "Failed", created: "2026-10-19" },
];

export const demoAudit: AuditEvent[] = [
  { id: "a1", actor: "admin", action: "Published lesson", target: "Physics · Waves", at: "2026-10-23 14:10" },
  { id: "a2", actor: "admin", action: "Approved answer key", target: "Quadratic Q3", at: "2026-10-22 09:40", reason: "Matched teacher key" },
  { id: "a3", actor: "admin", action: "Granted manual access", target: "Ngozi Eze", at: "2026-10-15 11:00", reason: "School arrangement" },
];

const KEY = "richmirabel-admin-ops";
type Ops = { tickets: DemoTicket[]; jobs: DemoJob[]; audit: AuditEvent[]; users: DemoUser[] };

export function loadOps(): Ops {
  if (typeof localStorage === "undefined") return { tickets: demoTickets, jobs: demoJobs, audit: demoAudit, users: demoUsers };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { tickets: demoTickets, jobs: demoJobs, audit: demoAudit, users: demoUsers };
    return JSON.parse(raw) as Ops;
  } catch { return { tickets: demoTickets, jobs: demoJobs, audit: demoAudit, users: demoUsers }; }
}
export function saveOps(ops: Ops) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(ops));
}
