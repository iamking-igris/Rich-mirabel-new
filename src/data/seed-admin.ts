import type { SubjectGroup } from "@/data/catalog";
import type { PaymentRecord } from "@/lib/payments";

export type StudentRow = {
  id: string;
  name: string;
  pathway: SubjectGroup;
  subjects: string[];
  status: "Trial" | "Paid" | "Expired";
  joinedDaysAgo: number;
  activeDaysAgo: number;
  topics: number;
  avg: number;
};

const s = (
  id: string,
  name: string,
  pathway: SubjectGroup,
  subjects: string[],
  status: StudentRow["status"],
  joinedDaysAgo: number,
  activeDaysAgo: number,
  topics: number,
  avg: number,
): StudentRow => ({ id, name, pathway, subjects: ["english", ...subjects], status, joinedDaysAgo, activeDaysAgo, topics, avg });

export const seedStudents: StudentRow[] = [
  s("s01", "Adaeze", "sciences", ["physics", "chemistry", "biology"], "Paid", 34, 0, 9, 78),
  s("s02", "Tunde", "sciences", ["mathematics", "physics", "chemistry"], "Paid", 31, 1, 8, 71),
  s("s03", "Chiamaka", "commercial", ["economics", "accounting", "government"], "Paid", 29, 0, 7, 83),
  s("s04", "Ibrahim", "sciences", ["physics", "chemistry", "mathematics"], "Paid", 27, 2, 6, 64),
  s("s05", "Zainab", "arts", ["literature", "government", "history"], "Paid", 24, 1, 6, 76),
  s("s06", "Emeka", "commercial", ["economics", "accounting", "government"], "Trial", 1, 0, 2, 58),
  s("s07", "Folake", "sciences", ["biology", "chemistry", "physics"], "Trial", 1, 0, 3, 69),
  s("s08", "Chidi", "arts", ["literature", "government", "history"], "Expired", 12, 9, 4, 52),
  s("s09", "Aisha", "sciences", ["mathematics", "physics", "chemistry"], "Paid", 21, 0, 8, 81),
  s("s10", "Seun", "commercial", ["economics", "accounting", "government"], "Expired", 10, 8, 3, 47),
  s("s11", "Ngozi", "arts", ["literature", "government", "history"], "Trial", 0, 0, 1, 75),
  s("s12", "Yusuf", "sciences", ["physics", "chemistry", "biology"], "Paid", 18, 3, 7, 66),
  s("s13", "Bola", "commercial", ["economics", "accounting", "government"], "Paid", 16, 1, 5, 72),
  s("s14", "Kelechi", "sciences", ["mathematics", "physics", "biology"], "Trial", 1, 1, 2, 55),
  s("s15", "Hauwa", "arts", ["literature", "government", "history"], "Paid", 15, 2, 6, 79),
  s("s16", "Tobi", "sciences", ["physics", "chemistry", "biology"], "Expired", 9, 7, 3, 44),
  s("s17", "Amara", "commercial", ["economics", "accounting", "government"], "Paid", 13, 0, 6, 74),
  s("s18", "Segun", "sciences", ["mathematics", "physics", "chemistry"], "Trial", 0, 0, 1, 62),
  s("s19", "Fatima", "arts", ["literature", "government", "history"], "Paid", 11, 1, 5, 70),
  s("s20", "Damilola", "sciences", ["physics", "chemistry", "biology"], "Paid", 8, 0, 4, 77),
];

export const seedWeakTopics = [
  { topicId: "waves", avg: 46 },
  { topicId: "mole", avg: 51 },
  { topicId: "trial-balance", avg: 54 },
  { topicId: "indices", avg: 57 },
  { topicId: "concord", avg: 61 },
];

export const seedRecent = [
  { name: "Adaeze", topicId: "waves", score: 3, total: 4, minutesAgo: 12 },
  { name: "Emeka", topicId: "demand-supply", score: 2, total: 4, minutesAgo: 41 },
  { name: "Folake", topicId: "cell", score: 4, total: 4, minutesAgo: 95 },
  { name: "Ngozi", topicId: "genres", score: 3, total: 4, minutesAgo: 180 },
  { name: "Aisha", topicId: "quadratic", score: 4, total: 4, minutesAgo: 320 },
  { name: "Amara", topicId: "double-entry", score: 3, total: 4, minutesAgo: 600 },
];

const DAY = 24 * 60 * 60 * 1000;
const methods: PaymentRecord["method"][] = ["Card", "Bank transfer", "USSD", "Card"];

export function seedPayments(now = Date.now()): PaymentRecord[] {
  const paid = seedStudents
    .filter((x) => x.status === "Paid")
    .map((x, i) => ({
      reference: `RM-${(0x4a7c1 + i * 977).toString(36).toUpperCase()}`,
      name: x.name,
      amount: 4500,
      method: methods[i % methods.length],
      at: now - Math.max(0, x.joinedDaysAgo - 1) * DAY - i * 3_600_000,
      status: "Successful" as const,
    }));
  const failed: PaymentRecord[] = [
    { reference: "RM-9F2K1", name: "Seun", amount: 4500, method: "Card", at: now - 8 * DAY, status: "Failed" },
    { reference: "RM-8D4P7", name: "Tobi", amount: 4500, method: "USSD", at: now - 6 * DAY, status: "Failed" },
  ];
  return [...paid, ...failed].sort((a, b) => b.at - a.at);
}
