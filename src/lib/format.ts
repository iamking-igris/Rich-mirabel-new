export const plural = (n: number, one: string, many = one + "s") =>
  `${n} ${n === 1 ? one : many}`;

export const naira = (n: number) => "₦" + n.toLocaleString("en-NG");

export const questionCount = (topics: { questions: unknown[] }[]) =>
  topics.reduce((sum, topic) => sum + topic.questions.length, 0);

const PHOTO_ALIAS: Record<string, string> = {
  economics: "mathematics",
  accounting: "hero",
  literature: "english",
  history: "government",
};

export const photoOf = (subject: { id: string; photo?: string }) =>
  subject.photo ?? `/media/${PHOTO_ALIAS[subject.id] ?? subject.id}.jpg`;

export function monthLabel(value: string | null) {
  if (!value) return "";
  const [y, m] = value.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-NG", { month: "long", year: "numeric" });
}

export function weeksUntil(month: string | null) {
  if (!month) return null;
  const [y, m] = month.split("-").map(Number);
  const target = new Date(y, m - 1, 1).getTime();
  const weeks = Math.ceil((target - Date.now()) / (7 * 24 * 60 * 60 * 1000));
  return weeks > 0 ? weeks : null;
}
