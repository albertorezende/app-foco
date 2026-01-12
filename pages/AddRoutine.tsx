
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';
import { Period, TaskCategory } from '../types';

const AddRoutinePage: React.FC = () => {
  const navigate = useNavigate();
  const { addRoutine } = useAppContext();
  const [title, setTitle] = useState('');
  const [period, setPeriod] = useState<Period>(Period.MORNING);
  const [category, setCategory] = useState<TaskCategory>(TaskCategory.SAUDE);
  const [points, setPoints] = useState(1);
  const [penalty, setPenalty] = useState(3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addRoutine({
      title,
      period,
      category,
      points,
      penalty
    });
    navigate('/routine');
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen">
      <header className="sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center px-4 h-16 max-w-md mx-auto w-full">
          <button onClick={() => navigate(-1)} className="size-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="flex-1 text-center text-lg font-bold tracking-tight">Criar Rotina Fixa</h1>
          <div className="size-10"></div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-md mx-auto p-4 pb-32 flex flex-col gap-6">
        {/* Nome */}
        <section className="bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-card border border-primary/5">
          <label className="block">
            <span className="flex items-center gap-2 text-sm font-semibold text-primary uppercase tracking-wider mb-3">
              <span className="material-symbols-outlined text-[18px]">edit_note</span> O que você vai fazer?
            </span>
            <input 
              autoFocus 
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-background-light dark:bg-background-dark border-0 rounded-xl px-4 py-4 text-lg font-medium placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 transition-all text-slate-900 dark:text-white" 
              placeholder="Ex: Meditar 15 min" 
              type="text"
            />
          </label>
        </section>

        {/* Categoria */}
        <section className="bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-card border border-primary/5">
          <span className="flex items-center gap-2 text-sm font-semibold text-primary uppercase tracking-wider mb-4">
            <span className="material-symbols-outlined text-[18px]">category</span> Categoria
          </span>
          <div className="grid grid-cols-2 gap-2">
            {Object.values(TaskCategory).map(cat => (
              <button 
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${category === cat ? 'bg-primary text-white border-primary shadow-sm' : 'bg-slate-50 border-slate-100 text-slate-400 dark:bg-slate-800 dark:border-slate-700'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Período */}
        <section className="bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-card border border-primary/5">
          <span className="flex items-center gap-2 text-sm font-semibold text-primary uppercase tracking-wider mb-4">
            <span className="material-symbols-outlined text-[18px]">schedule</span> Qual período?
          </span>
          <div className="grid grid-cols-3 gap-3">
            {[Period.MORNING, Period.AFTERNOON, Period.EVENING].map((p) => (
              <label key={p} className="relative cursor-pointer group">
                <input 
                  className="peer sr-only" 
                  name="period" 
                  type="radio" 
                  checked={period === p}
                  onChange={() => setPeriod(p)}
                />
                <div className="flex flex-col items-center justify-center h-24 rounded-xl border-2 border-transparent bg-background-light dark:bg-background-dark peer-checked:bg-primary/5 peer-checked:border-primary transition-all duration-200">
                  <span className={`material-symbols-outlined mb-1 text-gray-400 peer-checked:text-primary text-3xl ${period === p ? 'filled' : ''}`}>
                    {p === Period.MORNING ? 'wb_twilight' : p === Period.AFTERNOON ? 'light_mode' : 'dark_mode'}
                  </span>
                  <span className="text-xs font-bold text-gray-500 peer-checked:text-primary dark:text-gray-400">
                    {p}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </section>

        {/* Gamificação */}
        <section className="bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-card border border-primary/5">
          <span className="flex items-center gap-2 text-sm font-semibold text-primary uppercase tracking-wider mb-4">
            <span className="material-symbols-outlined text-[18px]">sports_score</span> Gamificação
          </span>
          <div className="grid grid-cols-2 gap-4">
            {/* Positivo */}
            <div className="bg-green-50 dark:bg-green-900/10 rounded-2xl p-4 flex flex-col items-center border border-green-100 dark:border-green-800">
              <span className="text-[10px] font-black text-green-700 dark:text-green-400 uppercase mb-2">Concluído</span>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setPoints(p => Math.max(0, p - 0.5))}
                  className="size-7 rounded-full bg-white dark:bg-green-900 shadow-sm flex items-center justify-center text-green-700 font-bold"
                >-</button>
                <span className="text-xl font-black text-green-600 dark:text-green-400">+{points}</span>
                <button 
                  onClick={() => setPoints(p => Math.min(20, p + 0.5))}
                  className="size-7 rounded-full bg-white dark:bg-green-900 shadow-sm flex items-center justify-center text-green-700 font-bold"
                >+</button>
              </div>
            </div>
            {/* Negativo */}
            <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl p-4 flex flex-col items-center border border-red-100 dark:border-red-800">
              <span className="text-[10px] font-black text-red-700 dark:text-red-400 uppercase mb-2">Pendente</span>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setPenalty(p => Math.max(0, p - 0.5))}
                  className="size-7 rounded-full bg-white dark:bg-red-900 shadow-sm flex items-center justify-center text-red-700 font-bold"
                >-</button>
                <span className="text-xl font-black text-red-600 dark:text-red-400">-{penalty}</span>
                <button 
                  onClick={() => setPenalty(p => Math.min(20, p + 0.5))}
                  className="size-7 rounded-full bg-white dark:bg-red-900 shadow-sm flex items-center justify-center text-red-700 font-bold"
                >+</button>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-4">
          <button 
            onClick={handleSubmit} 
            className="w-full h-14 bg-primary hover:bg-primary-dark text-white rounded-2xl font-black text-md shadow-floating active:scale-95 transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
          >
            <span className="material-symbols-outlined">save</span> Salvar Rotina
          </button>
        </div>
      </main>
    </div>
  );
};

export default AddRoutinePage;
