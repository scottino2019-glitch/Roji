import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "" 
});

export const geminiService = {
  async translate(text: string, targetLanguage: string): Promise<string> {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Sei Roji, un panda rosso amichevole esperto di lingue. 
        Traduci il seguente testo in ${targetLanguage}. 
        Fornisci:
        1. La traduzione corretta.
        2. La pronuncia fonetica (se la lingua usa caratteri non latini).
        3. Brevi note culturali o grammaticali in ITALIANO.
        
        Testo: "${text}"`,
      });
      return response.text || "Nessun testo generato.";
    } catch (err: any) {
      console.error("Gemini Error:", err);
      throw err;
    }
  },

  async checkGrammar(text: string, language: string): Promise<string> {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Sei Roji, un panda rosso insegnante. Analizza la grammatica del testo in ${language}: "${text}". Spiega gli errori e dai la versione corretta in ITALIANO.`,
      });
      return response.text || "Nessun testo generato.";
    } catch (err: any) {
      console.error("Gemini Error:", err);
      throw err;
    }
  },

  async lookupDictionary(word: string, language: string): Promise<string> {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Sei Roji. Spiega il significato di "${word}" in ${language}. Fornisci esempi d'uso in ITALIANO.`,
      });
      return response.text || "Nessun testo generato.";
    } catch (err: any) {
      console.error("Gemini Error:", err);
      throw err;
    }
  },

  async getExerciseHelp(query: string, language: string): Promise<string> {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Sei Roji. Aiuta con questo esercizio di ${language}: "${query}". Rispondi in ITALIANO in modo amichevole.`,
      });
      return response.text || "Nessun testo generato.";
    } catch (err: any) {
      console.error("Gemini Error:", err);
      throw err;
    }
  }
};
