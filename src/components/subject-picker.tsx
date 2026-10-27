import { Check, Lock } from "lucide-react";
import { useState } from "react";
import type { Subject, SubjectGroup } from "@/data/catalog";
import { COMPULSORY, PICKS, tracks } from "@/data/tracks";
import { cn } from "@/lib/cn";
import { photoOf, plural } from "@/lib/format";

export function ClassCards({ value, onChange }: { value: SubjectGroup | null; onChange: (g: SubjectGroup) => void }) {
  return (
    <div role="radiogroup" aria-label="Class" className="grid gap-3 sm:grid-cols-3">
      {(Object.keys(tracks) as SubjectGroup[]).map((id) => {
        const on = value === id;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(id)}
            className={cn(
              "min-h-24 rounded-2xl border p-5 text-left",
              on ? "border-primary bg-surface ring-2 ring-primary" : "border-line bg-surface hover:border-ink",
            )}
          >
            <span className="flex items-center justify-between">
              <span className="font-display text-2xl">{tracks[id].label}</span>
              {on && <Check className="size-5 text-primary" aria-hidden />}
            </span>
            <span className="mt-1 block text-sm text-muted">{tracks[id].blurb}</span>
          </button>
        );
      })}
    </div>
  );
}

export function SubjectPicker({
  subjects,
  track,
  picked,
  onChange,
}: {
  subjects: Subject[];
  track: SubjectGroup;
  picked: string[];
  onChange: (ids: string[]) => void;
}) {
  const [more, setMore] = useState(false);
  const ready = subjects.filter((s) => s.topics.length > 0 && s.id !== COMPULSORY);
  const mine = tracks[track].offered
    .map((id) => ready.find((s) => s.id === id))
    .filter((s): s is Subject => Boolean(s));
  const others = ready.filter((s) => !mine.some((m) => m.id === s.id));
  const english = subjects.find((s) => s.id === COMPULSORY);
  const full = picked.length >= PICKS;

  function toggle(id: string) {
    if (picked.includes(id)) onChange(picked.filter((x) => x !== id));
    else if (!full) onChange([...picked, id]);
  }

  const chip = (s: Subject) => {
    const on = picked.includes(s.id);
    const blocked = !on && full;
    return (
      <li key={s.id}>
        <button
          type="button"
          aria-pressed={on}
          disabled={blocked}
          onClick={() => toggle(s.id)}
          className={cn(
            "flex min-h-16 w-full items-center gap-3 rounded-2xl border p-2 pr-4 text-left",
            on ? "border-primary bg-surface ring-2 ring-primary" : "border-line bg-surface",
            blocked && "opacity-45",
          )}
        >
          <img src={photoOf(s)} alt="" className="photo size-12 shrink-0 rounded-xl object-cover" />
          <span className="min-w-0 flex-1">
            <span className="block font-medium">{s.name}</span>
            <span className="block text-xs text-muted">{plural(s.topics.length, "topic")}</span>
          </span>
          {on && <Check className="size-5 text-primary" aria-hidden />}
        </button>
      </li>
    );
  };

  return (
    <div>
      <p className="text-sm text-muted" aria-live="polite">
        {picked.length} of {PICKS} chosen{full ? ". Remove one to swap." : "."}
      </p>
      {english && (
        <div className="mt-4 flex min-h-16 items-center gap-3 rounded-2xl border border-line bg-soft p-2 pr-4">
          <img src={photoOf(english)} alt="" className="photo size-12 shrink-0 rounded-xl object-cover" />
          <span className="flex-1">
            <span className="block font-medium">{english.name}</span>
            <span className="block text-xs text-muted">Compulsory for JAMB</span>
          </span>
          <Lock className="size-4 text-muted" aria-hidden />
        </div>
      )}
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">{mine.map(chip)}</ul>
      <button
        type="button"
        aria-expanded={more}
        onClick={() => setMore((v) => !v)}
        className="mt-4 min-h-11 text-sm font-semibold text-primary"
      >
        {more ? "Hide other subjects" : "Other subjects"}
      </button>
      {more && <ul className="mt-1 grid gap-2 sm:grid-cols-2">{others.map(chip)}</ul>}
    </div>
  );
}

export function monthOptions() {
  const out: { value: string; label: string }[] = [];
  const now = new Date();
  for (let i = 1; i <= 14; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    out.push({
      value: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      label: d.toLocaleDateString("en-NG", { month: "long", year: "numeric" }),
    });
  }
  return out;
}
