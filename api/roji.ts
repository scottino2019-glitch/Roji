import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, text, targetLang, query } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Chiave API mancante su Vercel." });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let prompt = "";
    if (action === "translate") {
      prompt = `Sei Roji, un panda rosso amichevole. Traduci in ${targetLang}: "${text}". Dai anche la pronuncia e note culturali in ITALIANO.`;
    } else if (action === "grammar") {
      prompt = `Sei Roji. Analizza la grammatica di questo testo in ${targetLang}: "${text}". Spiega gli errori in ITALIANO.`;
    } else if (action === "dictionary") {
      prompt = `Sei Roji. Spiega la parola "${text}" in ${targetLang} con esempi in ITALIANO.`;
    } else if (action === "exercise") {
      prompt = `Sei Roji. Aiuta con questo esercizio di ${targetLang}: "${query}". Rispondi in ITALIANO.`;
    }

    const result = await model.generateContent(prompt);
    res.status(200).json({ text: result.response.text() });
  } catch (error: any) {
    console.error("ERRORE GEMINI VERCEL:", error);
    res.status(500).json({ error: "Errore API Gemini", details: error?.message || "Errore sconosciuto" });
  }
}
