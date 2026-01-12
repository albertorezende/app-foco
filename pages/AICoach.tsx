
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { suggestPriorities } from '../geminiService';
import { useAppContext } from '../App';
import { TaskCategory } from '../types';

const AICoachPage: React.FC = () => {
  const navigate = useNavigate();
  const { addTask } = useAppContext();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const handleAsk = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    const result = await suggestPriorities(input);
    setSuggestions(result);
    setIsLoading(false);
  };

  const acceptSuggestions = () => {
    suggestions.forEach(s => {
      // Corrected TaskCategory key from WORK to TRABALHO
      addTask({
        title: s.title,
        category: (s.category as TaskCategory) || TaskCategory.TRABALHO,
      });
    });
    navigate('/');
  };

  return (
    <div className="pb-32 bg-background-light dark:bg-background-dark min-h-screen">
      <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md p-4 text-center border-b border-gray-100 dark:border-gray-800">
        <h2 className="text-lg font-bold flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-primary filled">auto_awesome</span>
          Coach IA
        </h2>
      </header>

      <main className="px-6 py-8 max-w-md mx-auto space-y-6">
        <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
          <h3 className="text-primary font-bold mb-2">Descreva seu dia</h3>
          <p className="text-xs text-gray-500 mb-4">
            Me conte tudo o que você tem para fazer hoje e eu vou te ajudar a escolher as 3 prioridades mais importantes.
          </p>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            className="w-full bg-white dark:bg-surface-dark border-gray-200 dark:border-gray-800 rounded-xl p-4 text-sm focus:ring-primary focus:border-primary min-h-[120px]"
            placeholder="Tenho reunião as 10h, preciso levar o cachorro no vet, terminar o relatório..."
          />
          <button
            onClick={handleAsk}
            disabled={isLoading}
            className="w-full mt-4 bg-primary text-white font-bold py-3 rounded-xl shadow-sm active:scale-95 disabled:opacity-50 transition-all"
          >
            {isLoading ? 'ANALISANDO...' : 'DEFINIR PRIORIDADES'}
          </button>
        </div>

        {suggestions.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white">Sugestões do Coach</h3>
            <div className="space-y-2">
              {suggestions.map((s, i) => (
                <div key={i} className="bg-white dark:bg-surface-dark p-4 rounded-xl shadow-card border border-gray-50 dark:border-gray-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-primary uppercase">{s.category}</p>
                    <p className="text-sm font-semibold">{s.title}</p>
                  </div>
                  <span className="material-symbols-outlined text-gray-300">check_circle</span>
                </div>
              ))}
            </div>
            <button
              onClick={acceptSuggestions}
              className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-bold py-4 rounded-xl shadow-floating transition-all active:scale-95"
            >
              ACEITAR E ADICIONAR
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default AICoachPage;
