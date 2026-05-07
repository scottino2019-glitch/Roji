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
      console.error("ERRORE: GEMINI_API_KEY non trovata.");
      return res.status(500).json({ error: "La chiave API Gemini non è configurata. Inseriscila nelle impostazioni (Settings)." });
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      let prompt = "";
      if (action === "translate") {
        prompt = `Sei Roji, un panda rosso amichevole esperto di lingue. 
        Traduci il seguente testo in ${targetLang}. 
        Fornisci:
        1. La traduzione corretta.
        2. La pronuncia fonetica (se la lingua usa caratteri non latini).
        3. Eventuali brevi note grammaticali o culturali interessanti in ITALIANO.
        
        Testo da tradurre: "${text}"
        Rispondi in modo cordiale.`;
      } else if (action === "grammar") {
        prompt = `Sei Roji, un panda rosso insegnante.
        Analizza la grammatica del seguente testo in ${targetLang}: "${text}".
        Spiega eventuali errori in ITALIANO e fornisci la versione corretta. 
        Sii incoraggiante!`;
      } else if (action === "dictionary") {
        prompt = `Sei Roji. Spiega il significato della parola "${text}" in ${targetLang}.
        Fornisci definizioni semplici, esempi d'uso e se possibile dei sinonimi.
        Spiega tutto in ITALIANO.`;
      } else if (action === "exercise") {
        prompt = `Sei Roji, un panda rosso tutor. 
        Aiuta lo studente con questo esercizio o domanda di ${targetLang}: "${query}".
        Non dare solo la soluzione, spiega il ragionamento in ITALIANO in modo che lo studente possa imparare.`;
      }

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      res.json({ text: responseText });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: "Si è verificato un errore durante la comunicazione con Roji. Riprova più tardi." });
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
