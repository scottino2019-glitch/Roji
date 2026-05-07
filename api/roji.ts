import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
    
    res.status(200).json({ text: responseText });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore API Roji" });
  }
}
