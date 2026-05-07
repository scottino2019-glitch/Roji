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

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // API Routes
  app.post("/api/roji", async (req, res) => {
    const { action, text, targetLang, query } = req.body;
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Chiave Gemini non configurata nel server." });
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

      let prompt = "";
      if (action === "translate") {
        prompt = `Traduci il testo in ${targetLang}. Fornisci la traduzione, la pronuncia (se asiatica) e note culturali in ITALIANO. Testo: "${text}"`;
      } else if (action === "grammar") {
        prompt = `Controlla la grammatica in ${targetLang} del testo: "${text}". Spiega gli errori e dai suggerimenti in ITALIANO.`;
      } else if (action === "dictionary") {
        prompt = `Definizione per "${text}" in ${targetLang}. Spiegazioni ed esempi in ITALIANO.`;
      } else if (action === "exercise") {
        prompt = `Sei Roji, un panda rosso insegnante. Aiuta con questo esercizio di ${targetLang}: "${query}". Rispondi in ITALIANO in modo amichevole.`;
      }

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      // We'll try to parse JSON if we requested it in the prompt, 
      // but for simplicity and robustness we return text for now.
      res.json({ text: responseText });
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
