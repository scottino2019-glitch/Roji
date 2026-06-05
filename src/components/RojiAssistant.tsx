import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Languages, 
  BookOpen, 
  Pencil, 
  Sparkles, 
  X, 
  Send, 
  RotateCcw,
  Volume2,
  ChevronRight,
  Search
} from 'lucide-react';
import { 
  geminiService
} from '../services/geminiService';

type Tab = 'translate' | 'grammar' | 'dictionary' | 'exercise';

export default function RojiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('translate');
  const [input, setInput] = useState('');
  const [targetLang, setTargetLang] = useState('Inglese');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    // Listen for messages from parent if we are a widget
    const handleMessage = (event: MessageEvent) => {
      if (event.data === 'open-roji') toggleOpen(true);
      if (event.data === 'close-roji') toggleOpen(false);
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isOpen]);

  const toggleOpen = (state?: boolean) => {
    const nextState = state !== undefined ? state : !isOpen;
    setIsOpen(nextState);
    
    // Notify parent to resize iframe if needed
    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'roji-toggle',
        isOpen: nextState
      }, '*');
    }
  };

  const handleAction = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      let res;
      if (activeTab === 'translate') {
        res = await geminiService.translate(input, targetLang);
      } else if (activeTab === 'grammar') {
        res = await geminiService.checkGrammar(input, targetLang);
      } else if (activeTab === 'dictionary') {
        res = await geminiService.lookupDictionary(input, targetLang);
      } else if (activeTab === 'exercise') {
        res = await geminiService.getExerciseHelp(input, targetLang);
      }
      setResult(res);
    } catch (error: any) {
      console.error(error);
      let errorMsg = "Ops! Roji ha avuto un problemino tecnico.";
      
      // Se il server ha restituito un JSON con dettagli
      try {
        if (error instanceof Error && error.message.startsWith('{')) {
          const details = JSON.parse(error.message);
          if (details.details) errorMsg = `Errore: ${details.details}`;
        } else if (error.message) {
          errorMsg = `Errore: ${error.message}`;
        }
      } catch(e) {
        // Fallback al messaggio generico
      }
      
      setResult(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'translate' as const, icon: Languages, label: 'Traduci' },
    { id: 'grammar' as const, icon: Pencil, label: 'Correggi' },
    { id: 'dictionary' as const, icon: Search, label: 'Vocabolario' },
    { id: 'exercise' as const, icon: BookOpen, label: 'Tutor' },
  ];

  const languages = [
    'Inglese', 'Giapponese', 'Cinese (Mandarin)', 'Coreano', 
    'Italiano', 'Spagnolo', 'Francese', 'Tedesco', 'Russo', 'Hindi', 'Thai'
  ];

  return (
    <div className="fixed bottom-0 right-0 z-[999999] flex flex-col items-end pointer-events-none p-4 sm:p-6">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.8, y: 50, filter: 'blur(10px)' }}
            className="mb-4 w-[350px] max-w-[calc(100vw-2rem)] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-stone-100 pointer-events-auto"
            style={{ height: '520px', maxHeight: 'calc(100vh - 120px)' }}
          >
            {/* Header */}
            <div className="bg-orange-500 p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-orange-500 font-bold text-xl relative overflow-hidden">
                   🦊
                </div>
                <div>
                  <h3 className="font-semibold text-sm leading-tight">Assistente Roji</h3>
                  <p className="text-[10px] opacity-80 uppercase tracking-wider font-medium">Il tuo compagno linguistico</p>
                </div>
              </div>
              <button 
                onClick={() => toggleOpen(false)}
                className="hover:bg-white/20 p-1.5 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Language Selector Bar */}
            <div className="bg-stone-100 p-2 px-4 flex items-center justify-between border-b border-stone-200">
               <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Sto imparando:</span>
               <select 
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="text-xs font-bold text-orange-600 outline-none bg-transparent cursor-pointer"
               >
                 {languages.map(lang => (
                   <option key={lang}>{lang}</option>
                 ))}
               </select>
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50">
              {/* Input section */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">
                  {activeTab === 'translate' ? 'Testo da tradurre' : activeTab === 'dictionary' ? 'Parola da cercare' : 'Tuo testo / esercizio'}
                </label>
                <div className="relative group">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={
                      activeTab === 'translate' ? 'Scrivi qualcosa da tradurre...' :
                      activeTab === 'grammar' ? 'Incolla qui la frase da correggere...' :
                      activeTab === 'dictionary' ? 'Inserisci una parola...' :
                      'Incolla un esercizio o fai una domanda...'
                    }
                    className="w-full bg-white border-2 border-stone-200 rounded-2xl p-4 text-sm focus:outline-none focus:border-orange-400 transition-all min-h-[100px] resize-none pr-12 text-stone-700 shadow-sm"
                  />
                  <button 
                    onClick={handleAction}
                    disabled={loading || !input.trim()}
                    className="absolute bottom-3 right-3 bg-orange-500 text-white p-2 rounded-xl disabled:bg-stone-300 disabled:cursor-not-allowed shadow-lg hover:shadow-orange-200 transition-all hover:-translate-y-0.5"
                  >
                    {loading ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                        <RotateCcw size={18} />
                      </motion.div>
                    ) : (
                      <Send size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Result Area */}
              <AnimatePresence mode="wait">
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={typeof result === 'string' ? result : JSON.stringify(result)}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100"
                  >
                    <div className="prose prose-stone prose-sm">
                      <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest block mb-2">
                        {activeTab === 'translate' ? 'Traduzione' : activeTab === 'grammar' ? 'Correzione' : activeTab === 'dictionary' ? 'Definizione' : 'Risposta di Roji'}
                      </span>
                      <p className="text-sm text-stone-700 whitespace-pre-wrap leading-relaxed">{typeof result === 'string' ? result : JSON.stringify(result, null, 2)}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Tabs */}
            <div className="bg-white border-t border-stone-100 grid grid-cols-4 p-2 py-3">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setResult(null);
                    }}
                    className={`flex flex-col items-center gap-1 transition-all ${
                      isActive ? 'text-orange-500 scale-110' : 'text-stone-300 hover:text-stone-500'
                    }`}
                  >
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                    <span className="text-[8px] font-bold uppercase tracking-tighter">
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => toggleOpen()}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-16 h-16 bg-orange-500 rounded-full shadow-lg shadow-orange-200 flex items-center justify-center relative group pointer-events-auto"
      >
        <div className="absolute -top-1 -left-1 w-6 h-6 bg-red-800 rounded-full border-2 border-orange-500 -z-10 transition-transform group-hover:-translate-y-1 group-hover:-translate-x-1" />
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-800 rounded-full border-2 border-orange-500 -z-10 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
        <div className="text-3xl select-none">🦊</div>
        {!isOpen && (
          <span className="absolute inset-0 rounded-full animate-ping bg-orange-500 opacity-20 pointer-events-none" />
        )}
      </motion.button>
    </div>
  );
}
