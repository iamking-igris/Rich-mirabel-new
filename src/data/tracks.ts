import type { SubjectGroup } from "@/data/catalog";

export const COMPULSORY = "english";
export const PICKS = 3;

export const tracks: Record<
  SubjectGroup,
  { label: string; blurb: string; offered: string[]; usual: string[] }
> = {
  sciences: {
    label: "Science",
    blurb: "Physics, Chemistry, Biology, Mathematics",
    offered: ["physics", "chemistry", "biology", "mathematics"],
    usual: ["physics", "chemistry", "biology"],
  },
  arts: {
    label: "Art",
    blurb: "Literature, Government, History",
    offered: ["literature", "government", "history"],
    usual: ["literature", "government", "history"],
  },
  commercial: {
    label: "Commercial",
    blurb: "Economics, Accounting, Government",
    offered: ["economics", "accounting", "government"],
    usual: ["economics", "accounting", "government"],
  },
};

export const trackLabel = (group: SubjectGroup | null) => (group ? tracks[group].label : "");
