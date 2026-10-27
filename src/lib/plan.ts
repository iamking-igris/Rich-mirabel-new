import type { Subject, Topic } from "@/data/catalog";
import type { Attempt } from "@/lib/session";
import { bestByTopic } from "@/lib/session";

export type Pick = { subject: Subject; topic: Topic; reason: "Revisit" | "Next up" | "Start here"; ratio?: number };

/**
 * What to study today.
 * 1. The weakest topic under 60% comes back first.
 * 2. Otherwise rotate subjects, least recently studied first, and open its first unsat topic.
 */
export function nextTopic(mine: Subject[], attempts: Attempt[]): Pick | null {
  const best = bestByTopic(attempts);
  const rows = mine.flatMap((subject) => subject.topics.map((topic) => ({ subject, topic })));

  const weak = rows
    .filter((r) => best.has(r.topic.id))
    .map((r) => ({ ...r, ratio: best.get(r.topic.id)!.score / best.get(r.topic.id)!.total }))
    .filter((r) => r.ratio < 0.6)
    .sort((a, b) => a.ratio - b.ratio)[0];
  if (weak) return { subject: weak.subject, topic: weak.topic, reason: "Revisit", ratio: weak.ratio };

  const lastSat = (subject: Subject) =>
    Math.max(0, ...attempts.filter((a) => subject.topics.some((t) => t.id === a.topicId)).map((a) => a.at));
  const order = [...mine].sort((a, b) => lastSat(a) - lastSat(b));
  for (const subject of order) {
    const topic = subject.topics.find((t) => !best.has(t.id));
    if (topic) return { subject, topic, reason: attempts.length ? "Next up" : "Start here" };
  }
  return null;
}

export function studyDays(attempts: Attempt[]) {
  return new Set(attempts.map((a) => new Date(a.at).toDateString())).size;
}
