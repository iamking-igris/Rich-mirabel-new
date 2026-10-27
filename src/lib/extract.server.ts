import type { NoteDocument, NoteBlock } from "@/lib/note-schema";

export type ExtractNotesResult =
  | { ok: true; data: NoteDocument }
  | { ok: false; message: string };

/**
 * Server extraction function. Calls the server-side Gemini OCR endpoint
 * to ensure API keys and models are safely kept on the server.
 */
export async function extractNotesFromImage(
  fileBase64: string,
  mimeType: string = "image/jpeg"
): Promise<ExtractNotesResult> {
  try {
    const res = await fetch("/api/extract-notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fileBase64, mimeType }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => null);
      return {
        ok: false,
        message: errData?.message || "Couldn't read the note. Please try a clearer photo.",
      };
    }

    const json = await res.json();
    if (!json.ok || !json.data) {
      return {
        ok: false,
        message: json.message || "Couldn't read the note. Please try a clearer photo.",
      };
    }

    const raw = json.data;
    const cleanBlocks: NoteBlock[] = Array.isArray(raw.blocks)
      ? raw.blocks.map((b: any, idx: number) => {
          const id = b.id || `gen-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 7)}`;
          if (b.type === "objectives") {
            return {
              id,
              type: "objectives" as const,
              items: Array.isArray(b.items) ? b.items.map(String).filter(Boolean) : ["Objective"],
            };
          }
          if (b.type === "formula") {
            return {
              id,
              type: "formula" as const,
              latex: typeof b.latex === "string" ? b.latex : "",
            };
          }
          if (b.type === "heading") {
            return {
              id,
              type: "heading" as const,
              text: typeof b.text === "string" ? b.text : "Heading",
            };
          }
          if (b.type === "diagram") {
            return {
              id,
              type: "diagram" as const,
              imageUrl: typeof b.imageUrl === "string" && b.imageUrl ? b.imageUrl : "/media/physics.jpg",
              caption: typeof b.caption === "string" ? b.caption : "",
            };
          }
          return {
            id,
            type: "paragraph" as const,
            text: typeof b.text === "string" ? b.text : "",
          };
        })
      : [];

    const doc: NoteDocument = {
      subject: typeof raw.subject === "string" ? raw.subject : "",
      topic: typeof raw.topic === "string" ? raw.topic : "",
      title: typeof raw.title === "string" ? raw.title : "Untitled Lesson",
      subtitle: typeof raw.subtitle === "string" ? raw.subtitle : "",
      meta: typeof raw.meta === "string" ? raw.meta : "15 min · 4 questions · 2 theory",
      blocks: cleanBlocks,
    };

    return { ok: true, data: doc };
  } catch (err: any) {
    return {
      ok: false,
      message: err?.message || "Couldn't read the note. Please try a clearer photo.",
    };
  }
}
