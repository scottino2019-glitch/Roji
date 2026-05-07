
export const geminiService = {
  async translate(text: string, targetLanguage: string): Promise<string> {
    try {
      const res = await fetch("/api/roji", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "translate", text, targetLang: targetLanguage }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Errore di rete");
      return data.text;
    } catch (err: any) {
      console.error("Translation Error:", err);
      throw err;
    }
  },

  async checkGrammar(text: string, language: string): Promise<string> {
    try {
      const res = await fetch("/api/roji", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "grammar", text, targetLang: language }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Errore di rete");
      return data.text;
    } catch (err: any) {
      console.error("Grammar Error:", err);
      throw err;
    }
  },

  async lookupDictionary(word: string, language: string): Promise<string> {
    try {
      const res = await fetch("/api/roji", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "dictionary", text: word, targetLang: language }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Errore di rete");
      return data.text;
    } catch (err: any) {
      console.error("Dictionary Error:", err);
      throw err;
    }
  },

  async getExerciseHelp(query: string, language: string): Promise<string> {
    try {
      const res = await fetch("/api/roji", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "exercise", query, targetLang: language }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Errore di rete");
      return data.text;
    } catch (err: any) {
      console.error("Exercise Error:", err);
      throw err;
    }
  }
};
