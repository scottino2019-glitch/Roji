
export const geminiService = {
  async translate(text: string, targetLanguage: string): Promise<string> {
    const res = await fetch("/api/roji", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "translate", text, targetLang: targetLanguage }),
    });
    const data = await res.json();
    return data.text;
  },

  async checkGrammar(text: string, language: string): Promise<string> {
    const res = await fetch("/api/roji", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "grammar", text, targetLang: language }),
    });
    const data = await res.json();
    return data.text;
  },

  async lookupDictionary(word: string, language: string): Promise<string> {
    const res = await fetch("/api/roji", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "dictionary", text: word, targetLang: language }),
    });
    const data = await res.json();
    return data.text;
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
