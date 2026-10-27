import { create } from "zustand";

export type Attempt = {
  id: string;
  topicId: string;
  score: number;
  total: number;
  at: number;
  kind?: "topic" | "jamb" | "waec";
  demo?: boolean;
};

export interface SessionState {
  name: string;
  email: string;
  trialStart: number;
  subscribed: boolean;
  onboardingComplete: boolean;
  attempts: Attempt[];
  setName: (name: string) => void;
  leave: () => void;
  recordAttempt: (attempt: Attempt) => void;
}

const STORAGE_KEY = "richmirabel_session_v1";

function loadSession(): Partial<SessionState> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export const useSession = create<SessionState>((set) => {
  const saved = loadSession();
  return {
    name: saved.name || "Student",
    email: saved.email || "",
    trialStart: saved.trialStart || Date.now(),
    subscribed: saved.subscribed || false,
    onboardingComplete: saved.onboardingComplete !== undefined ? saved.onboardingComplete : true,
    attempts: saved.attempts || [],
    setName: (name) => set({ name }),
    leave: () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEY);
      }
      set({ name: "Student", email: "", attempts: [], subscribed: false });
    },
    recordAttempt: (attempt) => set((s) => ({ attempts: [...s.attempts, attempt] })),
  };
});

export function trialLeft(trialStart?: number, subscribed?: boolean): { active: boolean; label: string } {
  if (subscribed) {
    return { active: true, label: "Pro Active" };
  }
  const start = trialStart || Date.now();
  const daysPassed = (Date.now() - start) / (1000 * 60 * 60 * 24);
  const daysLeft = Math.max(0, Math.ceil(7 - daysPassed));
  if (daysLeft > 0) {
    return { active: true, label: `${daysLeft} days trial` };
  }
  return { active: false, label: "Trial expired" };
}

export function bestByTopic(attempts: Attempt[]): Map<string, { score: number; total: number }> {
  const map = new Map<string, { score: number; total: number }>();
  for (const a of attempts) {
    const existing = map.get(a.topicId);
    if (!existing || a.score / Math.max(1, a.total) > existing.score / Math.max(1, existing.total)) {
      map.set(a.topicId, { score: a.score, total: a.total });
    }
  }
  return map;
}
