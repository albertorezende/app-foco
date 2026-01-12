
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../App';
import { TaskCategory } from '../types';

const AddTaskPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state, addTask, updateTask } = useAppContext();
  
  const editingTask = id ? state.tasks.find(t => t.id === id) : null;

  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [duration, setDuration] = useState('30');
  const [category, setCategory] = useState<TaskCategory>(TaskCategory.TRABALHO);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setCategory(editingTask.category);
      if (editingTask.startTime) setStartTime(editingTask.startTime);
      if (editingTask.duration) setDuration(editingTask.duration.replace('m', ''));
    }
  }, [editingTask]);

  const currentSlot = editingTask ? state.tasks.findIndex(t => t.id === id) + 1 : state.tasks.length + 1;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingTask) {
      updateTask(editingTask.id, {
        title,
        category,
        startTime,
        duration: `${duration}m`
      });
    } else {
      if (state.tasks.length >= 3) return;
      addTask({
        title,
        category,
        startTime,
        duration: `${duration}m`
      });
    }
    navigate('/');
  };

  if (!editingTask && state.tasks.length >= 3) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center justify-center p-6 text-center">
        <span className="material-symbols-outlined text-6xl text-peace-rose mb-4 filled">warning</span>
        <h2 className="text-xl font-black mb-2">SLOTS ESGOTADOS</h2>
        <p className="text-sm text-gray-500 mb-8">Você já definiu suas 3 prioridades para hoje. Conclua as pendentes antes de adicionar novas.</p>
        <button onClick={() => navigate(-1)} className="w-full max-w-xs bg-primary text-white font-black py-4 rounded-2xl shadow-floating">VOLTAR</button>
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen animate-in slide-in-from-bottom duration-300">
      <header className="sticky top-0 z-30 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-6 pt-6 pb-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="size-10 flex items-center justify-start text-slate-400">
          <span className="material-symbols-outlined !text-3xl">chevron_left</span>
        </button>
        <h1 className="text-lg font-black tracking-tight uppercase">
          {editingTask ? `Editar Slot ${currentSlot}` : `Definir Slot ${currentSlot}`}
        </h1>
        <div className="size-10"></div>
      </header>

      <main className="px-6 pt-4 pb-32 max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          <section>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-3">O QUE É PRIORIDADE AGORA?</label>
            <input 
              autoFocus
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-white dark:bg-surface-dark border-2 border-gray-100 dark:border-gray-800 rounded-2xl px-5 py-5 text-lg font-bold focus:ring-primary focus:border-primary transition-all text-slate-900 dark:text-white"
              placeholder="Ex: Finalizar proposta comercial" 
              required
            />
          </section>

          <div className="grid grid-cols-2 gap-4">
            <section>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-3">TEMPO ESTIMADO</label>
              <div className="relative">
                <input 
                  type="number"
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                  className="w-full bg-white dark:bg-surface-dark border-2 border-gray-100 dark:border-gray-800 rounded-2xl px-5 py-4 font-bold text-slate-900 dark:text-white" 
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-black text-gray-400">MIN</span>
              </div>
            </section>
            <section>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-3">INÍCIO PREVISTO</label>
              <input 
                type="time" 
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full bg-white dark:bg-surface-dark border-2 border-gray-100 dark:border-gray-800 rounded-2xl px-5 py-4 font-bold text-slate-900 dark:text-white" 
              />
            </section>
          </div>

          <section>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-3">ÁREA DE VIDA</label>
            <div className="grid grid-cols-1 gap-2">
              {Object.values(TaskCategory).map((cat) => (
                <button 
                  key={cat} 
                  type="button" 
                  onClick={() => setCategory(cat)}
                  className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${category === cat ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 dark:border-gray-800 text-gray-400 bg-white dark:bg-surface-dark'}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined">
                      {cat === TaskCategory.TRABALHO ? 'work' : 
                       cat === TaskCategory.SAUDE ? 'fitness_center' : 
                       cat === TaskCategory.ESPIRITUAL ? 'auto_awesome' : 
                       cat === TaskCategory.CASA ? 'home' : 'menu_book'}
                    </span>
                    <span className="text-sm font-black uppercase tracking-widest">{cat}</span>
                  </div>
                  {category === cat && <span className="material-symbols-outlined filled">check_circle</span>}
                </button>
              ))}
            </div>
          </section>

          <div className="pt-6">
            <button 
              type="submit"
              className="w-full bg-primary text-white font-black py-5 rounded-3xl shadow-floating active:scale-[0.97] transition-all uppercase tracking-[0.2em] text-sm"
            >
              {editingTask ? `SALVAR ALTERAÇÕES` : `ATIVAR SLOT ${currentSlot}`}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AddTaskPage;
