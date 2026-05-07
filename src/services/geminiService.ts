import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface TranslationResult {
  translatedText: string;
  pronunciation?: string;
  notes?: string;
}

export interface GrammarResult {
  correctedText: string;
  explanation: string;
  suggestions: string[];
}

export interface DictionaryResult {
  word: string;
  meanings: {
    partOfSpeech: string;
    definition: string;
    example?: string;
  }[];
  synonyms?: string[];
}

export const geminiService = {
  async translate(text: string, targetLanguage: string): Promise<TranslationResult> {
    const res = await fetch("/api/roji", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "translate", text, targetLang: targetLanguage }),
    });
    return res.json();
  },

  async checkGrammar(text: string, language: string): Promise<GrammarResult> {
    const res = await fetch("/api/roji", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "grammar", text, targetLang: language }),
    });
    return res.json();
  },

  async lookupDictionary(word: string, language: string): Promise<DictionaryResult> {
    const res = await fetch("/api/roji", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "dictionary", text: word, targetLang: language }),
    });
    return res.json();
  },

  async getExerciseHelp(query: string, language: string): Promise<string> {
    const res = await fetch("/api/roji", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "exercise", query, targetLang: language }),
    });
    const data = await res.json();
    return data.text;
  }
};
