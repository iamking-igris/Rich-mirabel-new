import { create } from "zustand";
import { persist } from "zustand/middleware";
import { guides as seedGuides, news as seedNews, subjects as seedSubjects, type Subject, type Topic } from "@/data/catalog";
import { withDemoPhysicsTopics } from "@/data/demo";

type Content = {
  subjects: Subject[]; news: typeof seedNews; guides: typeof seedGuides;
  upsertSubject: (subject: Subject) => void; upsertTopic: (subjectId: string, topic: Topic) => void;
  removeTopic: (subjectId: string, topicId: string) => void;
  upsertNews: (item: (typeof seedNews)[number]) => void; removeNews: (id: string) => void; resetContent: () => void;
};
function seedWithDemo(): Subject[] {
  return seedSubjects.map((s) => s.id !== "physics" ? s : { ...s, topics: withDemoPhysicsTopics(s.topics) });
}
export const useContent = create<Content>()(
  persist(
    (set) => ({
      subjects: seedWithDemo(), news: seedNews, guides: seedGuides,
      upsertSubject: (subject) => set((s) => ({ subjects: s.subjects.some(x => x.id === subject.id) ? s.subjects.map(x => x.id === subject.id ? subject : x) : [...s.subjects, subject] })),
      upsertTopic: (subjectId, topic) => set((s) => ({ subjects: s.subjects.map(subject => {
        if (subject.id !== subjectId) return subject;
        const exists = subject.topics.some(t => t.id === topic.id);
        return { ...subject, topics: exists ? subject.topics.map(t => t.id === topic.id ? topic : t) : [...subject.topics, topic] };
      })})),
      removeTopic: (subjectId, topicId) => set((s) => ({ subjects: s.subjects.map(subject => subject.id === subjectId ? { ...subject, topics: subject.topics.filter(t => t.id !== topicId) } : subject) })),
      upsertNews: (item) => set((s) => ({ news: s.news.some(x => x.id === item.id) ? s.news.map(x => x.id === item.id ? item : x) : [item, ...s.news] })),
      removeNews: (id) => set((s) => ({ news: s.news.filter(item => item.id !== id) })),
      resetContent: () => set({ subjects: seedWithDemo(), news: seedNews, guides: seedGuides }),
    }),
    {
      name: "richmirabel-content", version: 3,
      merge: (persisted, current) => {
        const saved = (persisted ?? {}) as Partial<Content>;
        const savedSubjects = saved.subjects ?? [];
        const subjects = seedSubjects.map((seed) => {
          const mine = savedSubjects.find(s => s.id === seed.id);
          if (!mine) return seed.id === "physics" ? { ...seed, topics: withDemoPhysicsTopics(seed.topics) } : seed;
          const baseTopics = seed.id === "physics" ? withDemoPhysicsTopics(seed.topics) : seed.topics;
          const missing = baseTopics.filter(t => !mine.topics.some(x => x.id === t.id));
          const mergedTopics = mine.topics.map(mt => {
            const fromSeed = baseTopics.find(t => t.id === mt.id);
            if (fromSeed && fromSeed.origin === "shipped") return { ...fromSeed, ...mt, origin: "shipped" as const, notes: fromSeed.notes, questions: fromSeed.questions, theory: fromSeed.theory, objectives: fromSeed.objectives };
            if (fromSeed && fromSeed.origin === "demo" && mt.origin !== "shipped") return fromSeed;
            return mt;
          });
          return { ...mine, group: seed.group, photo: seed.photo, topics: [...mergedTopics, ...missing] };
        });
        const extra = savedSubjects.filter(s => !seedSubjects.some(x => x.id === s.id));
        return { ...current, ...saved, subjects: [...subjects, ...extra] };
      },
    },
  ),
);
export function publishedSubjects(subjects: Subject[]) {
  return subjects
    .filter((subject) => subject.available !== false)
    .map((subject) => ({ ...subject, topics: subject.topics.filter((topic) => topic.status !== "draft") }));
}
export const AVAILABLE_SUBJECT_IDS = new Set(["physics", "chemistry", "biology", "mathematics"]);
export function availableSubjects(subjects: Subject[]) {
  return publishedSubjects(subjects).filter(s => AVAILABLE_SUBJECT_IDS.has(s.id) && s.topics.length > 0);
}
export const JAMB_OPTIONAL_IDS = ["physics", "chemistry", "biology", "mathematics"] as const;
export const COMING_SOON_SCIENCE = ["Chemistry", "Biology", "Mathematics", "Further Mathematics", "Agricultural Science"] as const;
export function locateTopic(subjects: Subject[], topicId: string) {
  for (const subject of subjects) {
    const topic = subject.topics.find(item => item.id === topicId);
    if (topic) return { subject, topic };
  }
  return null;
}
export function groupByMainTopic(topics: Topic[]) {
  const map = new Map<string, Topic[]>();
  for (const t of topics) {
    const key = t.mainTopic ?? "Topics";
    const list = map.get(key) ?? [];
    list.push(t); map.set(key, list);
  }
  return [...map.entries()].map(([main, items]) => ({ main, items }));
}
export function visibleTopics(topics: Topic[], demoMode: boolean) {
  if (demoMode) return topics;
  return topics.filter(t => t.origin !== "demo");
}
