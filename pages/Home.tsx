
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';

const HomePage: React.FC = () => {
  const { state, toggleTask } = useAppContext();
  const navigate = useNavigate();
  const [showVictory, setShowVictory] = useState(false);

  if (!state) return null;

  const priorities = (state.tasks || []).filter(t => t.isPriority);
  const completedPriorities = priorities.filter(t => t.completed).length;
  
  const routineItems = state.routines || [];
  const completedRoutinePoints = routineItems.filter(r => r.completed).reduce((sum, r) => sum + (Number(r.points) || 0), 0);
  const totalRoutinePoints = routineItems.reduce((sum, r) => sum + (Number(r.points) || 0), 0);
  
  const totalPossiblePoints = (3 * 5) + totalRoutinePoints;
  const currentPoints = (completedPriorities * 5) + completedRoutinePoints;
  const progressPercent = Math.round((currentPoints / (totalPossiblePoints || 1)) * 100);

  useEffect(() => {
    if (completedPriorities === 3 && !showVictory) {
      setShowVictory(true);
      setTimeout(() => setShowVictory(false), 3000);
    }
  }, [completedPriorities, showVictory]);

  const handleEditTask = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigate(`/edit-task/${id}`);
  };

  return (
    <div className="pb-32 page-transition">
      {/* Header Vibrante */}
      <div className="px-6 pt-10 pb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-headline font-extrabold text-slate-900 dark:text-white">Ei, {state.userName}!</h1>
            <p className="text-primary font-bold text-xs uppercase tracking-widest mt-1">Sua jornada de hoje começou.</p>
          </div>
          <div className="bg-accent-sand text-white px-4 py-2 rounded-2xl flex items-center gap-2 shadow-floating animate-bounce-subtle">
            <span className="material-symbols-outlined text-sm filled">stars</span>
            <span className="text-sm font-black">{(state.stats.points || 0).toFixed(0)}</span>
          </div>
        </div>
      </div>

      {/* Progress Card Vibrante */}
      <div className="px-6 mb-8">
        <div className="bg-primary rounded-[2.5rem] p-7 shadow-floating relative overflow-hidden group">
          <div className="absolute top-0 right-0 size-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="relative size-20">
                <svg className="size-full" viewBox="0 0 36 36">
                  <path className="stroke-white/20" strokeWidth="4" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="stroke-white transition-all duration-1000" strokeWidth="4" strokeDasharray={`${progressPercent}, 100`} strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-black text-white">{progressPercent}%</span>
                </div>
              </div>
              <div>
                <p className="text-white font-black text-lg">Energia Total</p>
                <p className="text-white/70 text-xs font-bold uppercase tracking-wider">Você está indo bem!</p>
              </div>
            </div>
            
            <Link to="/ai-coach" className="size-14 rounded-2xl bg-white text-primary flex items-center justify-center hover:bg-slate-50 transition-all active:scale-95 shadow-card">
              <span className="material-symbols-outlined filled text-3xl">auto_awesome</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Rule of 3 Section */}
      <div className="px-6 mb-10">
        <div className="flex justify-between items-center mb-5 px-2">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Suas 3 Prioridades</h2>
          <span className="text-[11px] font-black text-primary bg-primary/10 px-3 py-1 rounded-full">{completedPriorities}/3</span>
        </div>
        
        <div className="space-y-4">
          {priorities.map(task => (
            <div 
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`group p-6 rounded-[2rem] border-2 transition-all duration-300 cursor-pointer flex items-center gap-5 ${task.completed ? 'bg-slate-50 border-slate-100 dark:bg-slate-800/30 opacity-50 grayscale' : 'bg-surface-light dark:bg-surface-dark border-primary/5 shadow-soft hover:border-primary/20'}`}
            >
              <div className={`size-8 rounded-2xl border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-primary border-primary text-white scale-110 shadow-soft' : 'border-slate-200'}`}>
                {task.completed && <span className="material-symbols-outlined text-lg font-bold">check</span>}
              </div>
              <div className="flex-1">
                <div className="flex flex-col">
                  <p className={`text-base font-extrabold ${task.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-100'}`}>{task.title}</p>
                  <span className={`text-[10px] font-black uppercase tracking-widest mt-1 ${task.completed ? 'text-slate-300' : 'text-primary'}`}>
                    {task.category}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end">
                  <span className="text-xs font-black text-emerald-500">+5</span>
                  <span className="text-[9px] font-bold text-red-400 opacity-60">-15</span>
                </div>
                {!task.completed && (
                  <button 
                    onClick={(e) => handleEditTask(e, task.id)}
                    className="size-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-primary transition-all active:scale-90"
                  >
                    <span className="material-symbols-outlined text-[20px]">edit</span>
                  </button>
                )}
              </div>
            </div>
          ))}

          {priorities.length < 3 && (
            <Link to="/add-task" className="flex items-center justify-center p-8 rounded-[2rem] border-2 border-dashed border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-all text-primary/40 hover:text-primary group">
              <span className="material-symbols-outlined text-4xl group-hover:scale-125 transition-transform duration-500">add_circle</span>
              <span className="ml-3 text-sm font-black uppercase tracking-[0.2em]">Ativar Novo Slot</span>
            </Link>
          )}
        </div>
      </div>

      {/* Quick Routine Access */}
      <div className="px-6">
         <div className="flex justify-between items-center mb-4 px-2">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Rotina em Foco</h2>
          <Link to="/routine" className="text-[10px] font-black text-primary hover:underline underline-offset-4">GERENCIAR TUDO</Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
           {routineItems.filter(r => !r.completed).slice(0, 4).map(r => (
             <div key={r.id} className="p-5 bg-white dark:bg-surface-dark border border-primary/5 rounded-[1.8rem] flex flex-col gap-2 shadow-card active:scale-95 transition-all">
                <div className="flex items-center justify-between w-full">
                  <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-lg filled">bolt</span>
                  </div>
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{r.category}</span>
                </div>
                <p className="text-sm font-extrabold text-slate-800 truncate dark:text-slate-100">{r.title}</p>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
