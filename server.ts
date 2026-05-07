import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const ai = new GoogleGenAI(process.env.GEMINI_API_KEY || "");
  const model = ai.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  // API Routes
  app.post("/api/roji", async (req, res) => {
    const { action, text, targetLang, query } = req.body;
    
    try {
      let prompt = "";
      let responseSchema: any = null;

      if (action === "translate") {
        prompt = `Traduci il testo in ${targetLang}. Fornisci la traduzione, la pronuncia (se asiatica) e note culturali in ITALIANO. Testo: "${text}"`;
        responseSchema = {
          type: Type.OBJECT,
          properties: {
            translatedText: { type: Type.STRING },
            pronunciation: { type: Type.STRING },
            notes: { type: Type.STRING },
          },
          required: ["translatedText"],
        };
      } else if (action === "grammar") {
        prompt = `Controlla la grammatica in ${targetLang} del testo: "${text}". Spiega gli errori e dai suggerimenti in ITALIANO.`;
        responseSchema = {
          type: Type.OBJECT,
          properties: {
            correctedText: { type: Type.STRING },
            explanation: { type: Type.STRING },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["correctedText", "explanation"],
        };
      } else if (action === "dictionary") {
        prompt = `Definizione per "${text}" in ${targetLang}. Spiegazioni ed esempi in ITALIANO.`;
        responseSchema = {
          type: Type.OBJECT,
          properties: {
            word: { type: Type.STRING },
            meanings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  partOfSpeech: { type: Type.STRING },
                  definition: { type: Type.STRING },
                  example: { type: Type.STRING },
                },
                required: ["partOfSpeech", "definition"]
              }
            }
          },
          required: ["word", "meanings"],
        };
      } else if (action === "exercise") {
        prompt = `Sei Roji, un panda rosso insegnante. Aiuta con questo esercizio di ${targetLang}: "${query}". Rispondi in ITALIANO in modo amichevole.`;
      }

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: responseSchema ? {
          responseMimeType: "application/json",
          responseSchema: responseSchema,
        } : undefined,
      });

      const responseText = result.response.text();
      res.json(responseSchema ? JSON.parse(responseText) : { text: responseText });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Errore API Roji" });
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
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
