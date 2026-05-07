import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Gemini
  app.post("/api/roji", async (req, res) => {
    const { action, text, targetLang, query } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Chiave API mancante nel server." });
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      let prompt = "";
      if (action === "translate") {
        prompt = `Sei Roji, un panda rosso amichevole esperto di lingue. Traduci in ${targetLang}: "${text}". Indica anche la pronuncia e note culturali in ITALIANO.`;
      } else if (action === "grammar") {
        prompt = `Sei Roji. Analizza la grammatica del testo in ${targetLang}: "${text}". Spiega gli errori in ITALIANO.`;
      } else if (action === "dictionary") {
        prompt = `Sei Roji. Spiega significato e uso di "${text}" in ${targetLang} con esempi in ITALIANO.`;
      } else if (action === "exercise") {
        prompt = `Sei Roji. Aiuta con questo esercizio di ${targetLang}: "${query}". Rispondi in ITALIANO in modo amichevole.`;
      }

      const result = await model.generateContent(prompt);
      res.json({ text: result.response.text() });
    } catch (error: any) {
      console.error("ERRORE GEMINI:", error);
      const errorMessage = error?.message || "Errore sconosciuto";
      res.status(500).json({ error: "Errore API Gemini", details: errorMessage });
    }
  });

  // Vite middleware for development
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
