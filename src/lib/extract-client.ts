import { extractNotesFromImage } from "@/lib/extract.server";
import type { NoteBlock } from "@/data/catalog";

export type Extracted = { objectives: string[]; notes: NoteBlock[] };
export type ExtractResult =
  | { ok: true; extracted: Extracted }
  | { ok: false; reason: string; message: string };

export async function extractFromFile(file: File): Promise<ExtractResult> {
  const base64 = await file.arrayBuffer().then((buf) => btoa(String.fromCharCode(...new Uint8Array(buf))));
  const result = await extractNotesFromImage(base64, file.type);
  if (!result.ok) {
    return { ok: false, reason: "ocr-error", message: result.message };
  }

  const objectivesBlock = result.data.blocks.find((b) => b.type === "objectives");
  const objectives = objectivesBlock && objectivesBlock.type === "objectives" ? objectivesBlock.items : [];
  const notes: NoteBlock[] = [];
  let current: NoteBlock = { heading: "Overview", paragraphs: [] };

  for (const b of result.data.blocks) {
    if (b.type === "heading") {
      if (current.paragraphs.length > 0 || current.formula) {
        notes.push(current);
      }
      current = { heading: b.text, paragraphs: [] };
    } else if (b.type === "paragraph") {
      current.paragraphs.push(b.text);
    } else if (b.type === "formula") {
      current.formula = b.latex;
    }
  }
  if (current.paragraphs.length > 0 || current.formula) {
    notes.push(current);
  }

  return { ok: true, extracted: { objectives, notes } };
}
