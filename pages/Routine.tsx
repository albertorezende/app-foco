
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';
import { Period } from '../types';

const RoutinePage: React.FC = () => {
  const { state, toggleRoutine } = useAppContext();
  const navigate = useNavigate();

  if (!state) return null;

  const sections = [
    { type: Period.MORNING, icon: 'wb_sunny', color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    { type: Period.AFTERNOON, icon: 'partly_cloudy_day', color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { type: Period.EVENING, icon: 'nights_stay', color: 'text-indigo-500', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
  ];

  return (
    <div className="pb-32 page-transition">
      <header className="sticky top-0 z-50 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-xl px-6 py-6 flex items-center justify-between border-b border-primary/5">
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-2xl bg-primary shadow-floating flex items-center justify-center text-white">
            <span className="material-symbols-outlined filled text-2xl">self_improvement</span>
          </div>
          <h1 className="font-headline font-black text-xl text-slate-900 dark:text-white uppercase tracking-tight">Rotina Diária</h1>
        </div>
        <div className="bg-emerald-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black shadow-lg">
          {state.routines.filter(r => r.completed).length} / {state.routines.length}
        </div>
      </header>

      <main className="px-6 mt-8 space-y-12 max-w-md mx-auto">
        {sections.map(section => {
          const items = state.routines.filter(r => r.period === section.type);
          const completedCount = items.filter(i => i.completed).length;

          return (
            <section key={section.type} className="space-y-5">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-4">
                  <div className={`size-10 rounded-2xl ${section.bg} flex items-center justify-center ${section.color} border ${section.border}`}>
                    <span className="material-symbols-outlined text-2xl filled">{section.icon}</span>
                  </div>
                  <h2 className="font-headline text-lg font-black text-slate-800 dark:text-white uppercase">{section.type}</h2>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{completedCount}/{items.length} COMPLETO</span>
              </div>
              
              <div className="space-y-3">
                {items.length === 0 ? (
                  <div className="p-10 text-center bg-white dark:bg-surface-dark rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800 text-slate-300 text-xs font-black uppercase tracking-widest italic">Nenhum hábito definido</div>
                ) : (
                  items.map(item => (
                    <div 
                      key={item.id} 
                      onClick={() => toggleRoutine(item.id)}
                      className={`flex items-center justify-between px-6 py-5 rounded-[2rem] border-2 transition-all cursor-pointer active:scale-95 ${item.completed ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-white dark:bg-surface-dark border-primary/5 shadow-card hover:border-primary/20'}`}
                    >
                      <div className="flex items-center gap-5 flex-1">
                        <div className={`size-7 rounded-2xl border-2 flex items-center justify-center transition-all ${item.completed ? 'bg-emerald-500 border-emerald-500 text-white shadow-soft' : 'border-slate-200'}`}>
                          {item.completed && <span className="material-symbols-outlined text-[16px] font-black">check</span>}
                        </div>
                        <div>
                          <p className={`text-sm font-extrabold ${item.completed ? 'line-through text-slate-300' : 'text-slate-800 dark:text-slate-200'}`}>
                            {item.title}
                          </p>
                          <span className={`text-[9px] font-black uppercase tracking-tighter ${item.completed ? 'text-slate-200' : 'text-primary opacity-60'}`}>
                            {item.category}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                         <span className="text-emerald-500 font-black text-xs">+{item.points}</span>
                         <span className="text-red-400 font-bold text-[9px] opacity-40">-{item.penalty}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          );
        })}
      </main>

      <div className="fixed bottom-28 right-6">
        <button 
          onClick={() => navigate('/add-routine')}
          className="size-16 rounded-[2rem] bg-primary text-white shadow-floating flex items-center justify-center active:scale-90 transition-all border-4 border-white dark:border-surface-dark"
        >
          <span className="material-symbols-outlined text-4xl font-black">add</span>
        </button>
      </div>
    </div>
  );
};

export default RoutinePage;
