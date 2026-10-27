import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SYSTEM_PROMPT = `You are an expert educational OCR engine for the Richmirabel app. 
Your job is to look at this handwritten note, understand the layout, and convert it into a structured JSON format.

Use these visual cues to categorize the text:
1. "title": The largest, most prominent text at the top of the page.
2. "subtitle": A smaller sentence right below the title explaining what the note is about.
3. "meta": Any small text at the top indicating time, date, or questions (e.g., "20 mins").
4. "objectives": If you see a list at the beginning that says "Objectives", "By the end of this...", or a numbered list of goals. Put these in the "objectives" block.
5. "heading": Words that are underlined, written larger, or isolated on their own line.
6. "paragraph": Standard blocks of handwritten text.
7. "formula": Any mathematical equation. YOU MUST convert these to KaTeX-compatible LaTeX (e.g., fractions become \\frac{}{}, square roots become \\sqrt{}).

Output MUST strictly match this JSON structure:
{
  "subject": "String",
  "topic": "String",
  "title": "String",
  "subtitle": "String",
  "meta": "String",
  "blocks": [
    { "id": "gen-uuid-1", "type": "objectives", "items": ["Goal 1"] },
    { "id": "gen-uuid-2", "type": "heading", "text": "Heading text" },
    { "id": "gen-uuid-3", "type": "paragraph", "text": "Paragraph text" },
    { "id": "gen-uuid-4", "type": "formula", "latex": "v = f \\lambda" }
  ]
}

CRITICAL RULES:
1. Generate a random unique string for every "id".
2. Return ONLY the raw JSON. No markdown formatting, no backticks.
3. If handwriting is messy, make your best educational guess based on context.`;

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: "30mb" }));
  app.use(express.urlencoded({ extended: true, limit: "30mb" }));

  // Real Gemini Vision OCR Extraction Endpoint
  app.post("/api/extract-notes", async (req, res) => {
    try {
      const { fileBase64, mimeType } = req.body;
      if (!fileBase64) {
        return res.status(400).json({ ok: false, message: "No image file provided." });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          ok: false,
          message: "GEMINI_API_KEY is not configured on the server. Please check your settings.",
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const cleanBase64 = String(fileBase64).replace(/^data:[^;]+;base64,/, "");
      const cleanMimeType = mimeType || "image/jpeg";

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            parts: [
              {
                inlineData: {
                  mimeType: cleanMimeType,
                  data: cleanBase64,
                },
              },
              {
                text: "Extract and structure this handwritten educational note into the specified JSON format.",
              },
            ],
          },
        ],
        config: {
          systemInstruction: SYSTEM_PROMPT,
          temperature: 0.0,
          responseMimeType: "application/json",
        },
      });

      const text = response.text?.trim() || "";
      if (!text) {
        return res.status(500).json({
          ok: false,
          message: "Couldn't read the note. Please try a clearer photo.",
        });
      }

      const cleanedJsonStr = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
      const parsed = JSON.parse(cleanedJsonStr);

      // Validate and ensure every block has an id
      if (Array.isArray(parsed.blocks)) {
        parsed.blocks = parsed.blocks.map((block: any, idx: number) => ({
          ...block,
          id: block.id || `gen-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 7)}`,
        }));
      } else {
        parsed.blocks = [];
      }

      return res.json({ ok: true, data: parsed });
    } catch (err: any) {
      console.error("Gemini OCR error:", err);
      return res.status(500).json({
        ok: false,
        message: err?.message || "Couldn't read the note. Please try a clearer photo.",
      });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
