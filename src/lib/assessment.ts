import type { Choice, Question } from "@/data/catalog";
import type { Attempt } from "@/lib/session";

export function scoreObjective(questions: Question[], picks: Record<string, Choice | undefined>) {
  let score = 0, total = 0, marked = 0;
  for (const q of questions) {
    if (q.answer == null || q.answerKeyStatus === "missing") continue;
    total += 1; marked += 1;
    if (picks[q.id] === q.answer) score += 1;
  }
  return { score, total, marked };
}
export function shownAttempts(attempts: Attempt[], opts?: { includeDemo?: boolean }) {
  if (opts?.includeDemo === false) return attempts.filter(a => !a.demo);
  return attempts;
}
export function attemptsByKind(attempts: Attempt[]) {
  return {
    topic: attempts.filter(a => a.kind === "topic" || !a.kind),
    jamb: attempts.filter(a => a.kind === "jamb"),
    waec: attempts.filter(a => a.kind === "waec"),
  };
}
export function keyLabel(status?: Question["answerKeyStatus"]) {
  if (status === "demo") return "Demo answer key";
  if (status === "shipped") return "Answer key";
  if (status === "missing") return "No key";
  return "Answer key";
}
