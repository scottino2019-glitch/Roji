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
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Traduci il seguente testo in ${targetLanguage}. 
      REGOLE:
      - Fornisci la traduzione accurata.
      - Se la lingua di destinazione è asiatica (Cinese, Giapponese, Coreano), includi SEMPRE la pronuncia fonetica (Pinyin, Romaji, ecc.).
      - Aggiungi note culturali o linguistiche se interessanti.
      - Rispondi in ITALIANO per le note e la spiegazione.
      
      Testo: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            translatedText: { type: Type.STRING },
            pronunciation: { type: Type.STRING },
            notes: { type: Type.STRING },
          },
          required: ["translatedText"],
        },
      },
    });

    try {
      return JSON.parse(response.text || "{}");
    } catch {
      return { translatedText: response.text || "Errore nella traduzione" };
    }
  },

  async checkGrammar(text: string, language: string): Promise<GrammarResult> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Controlla la grammatica, l'ortografia e la sintassi del seguente testo in ${language}. 
      Fornisci correzioni e suggerimenti contestuali.
      IMPORTANTE: Fornisci 'explanation' e 'suggestions' in ITALIANO.
      Return a JSON object with:
      - correctedText: la versione corretta nel testo originale
      - explanation: breve spiegazione degli errori (in ITALIANO)
      - suggestions: array di modi alternativi per esprimere l'idea (in ITALIANO).
      
      Testo: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            correctedText: { type: Type.STRING },
            explanation: { type: Type.STRING },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
          },
          required: ["correctedText", "explanation", "suggestions"],
        },
      },
    });

    return JSON.parse(response.text || "{}");
  },

  async lookupDictionary(word: string, language: string): Promise<DictionaryResult> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Fornisci una voce di dizionario per la parola "${word}" nella lingua "${language}".
      IMPORTANTE: Fornisci le definizioni e gli esempi in ITALIANO.
      Se la lingua è asiatica, includi la pronuncia fonetica nella definizione.
      Return a JSON object with:
      - word: la parola base
      - meanings: array di oggetti con partOfSpeech, definition (in ITALIANO), e example (nella lingua originale e traduzione italiana)
      - synonyms: (opzionale) array di sinonimi.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
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
            },
            synonyms: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
          },
          required: ["word", "meanings"],
        },
      },
    });

    return JSON.parse(response.text || "{}");
  },

  async getExerciseHelp(query: string, language: string): Promise<string> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Sei un simpatico insegnante di lingue a forma di Panda Rosso di nome Roji. 
      Uno studente ha bisogno di aiuto con questo esercizio o domanda riguardante la lingua ${language}: "${query}".
      Fornisci una spiegazione chiara, semplice e incoraggiante IN ITALIANO. Usa emoji e sii amichevole.
      Se utile, fornisci esempi o tabelle grammaticali.`,
    });

    return response.text || "Scusa, Roji non è riuscito a elaborare l'esercizio.";
  }
};
