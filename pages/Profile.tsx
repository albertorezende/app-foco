
import React, { useMemo } from 'react';
import { useAppContext } from '../App';

const ProfilePage: React.FC = () => {
  const { state } = useAppContext();

  if (!state) return null;

  const todayBalance = useMemo(() => {
    const donePoints = [
      ...(state.routines || []).filter(r => r.completed).map(r => Number(r.points || 0)),
      ...(state.tasks || []).filter(t => t.completed).map(t => Number(t.points || 0))
    ].reduce((a, b) => a + b, 0);

    const pendingPoints = [
      ...(state.routines || []).filter(r => !r.completed).map(r => Number(r.penalty || 0)),
      ...(state.tasks || []).filter(t => !t.completed).map(() => 15)
    ].reduce((a, b) => a + b, 0);

    return donePoints - pendingPoints;
  }, [state.routines, state.tasks]);

  const totalAccumulatedBalance = useMemo(() => {
    const historyBalance = (state.history || []).reduce((acc, log) => acc + (Number(log.points) || 0), 0);
    return historyBalance + todayBalance;
  }, [state.history, todayBalance]);

  const formatScore = (val: number) => {
    return (val || 0).toFixed(1).replace('.', ',');
  };

  const isNegative = totalAccumulatedBalance < 0;

  const badges = [
    { icon: 'bolt', label: 'Proativo', color: 'bg-amber-500 text-white shadow-amber-500/20' },
    { icon: 'local_fire_department', label: 'Imbatível', color: 'bg-rose-500 text-white shadow-rose-500/20' },
    { icon: 'auto_awesome', label: 'Mestre IA', color: 'bg-primary text-white shadow-primary/20' },
  ];

  const shopItems = [
    { 
      id: 1, 
      title: 'Momento Relax', 
      price: 50.00, 
      img: 'https://images.unsplash.com/photo-1518314916301-73c7a90b493f?auto=format&fit=crop&q=80&w=800', 
      icon: 'spa',
      description: 'Invista seu foco em descanso merecido.'
    },
    { 
      id: 2, 
      title: 'Noite de Cinema', 
      price: 40.00, 
      img: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800',
      icon: 'movie',
      description: 'Uma recompensa digna de quem focou no top 3.'
    },
    { 
      id: 3, 
      title: 'Jantar Premium', 
      price: 80.00, 
      img: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800',
      icon: 'restaurant',
      description: 'Comemore a semana batendo todas as metas.'
    },
  ];

  return (
    <div className="pb-32 page-transition bg-background-light dark:bg-background-dark min-h-screen">
      {/* Header Vibrante */}
      <header className="px-6 pt-16 text-center mb-12">
        <div className="inline-block relative mb-6">
          <div className="size-32 rounded-[3rem] border-8 border-white dark:border-slate-800 shadow-floating overflow-hidden bg-gradient-to-br from-primary to-primary-dark rotate-3 transition-transform hover:rotate-0 duration-500">
             <img 
               src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${state.userName}&backgroundColor=14B8A6,0D9488&backgroundType=gradientLinear`} 
               alt="Profile" 
               className="w-full h-full object-cover -rotate-3 scale-110"
             />
          </div>
          <button className="absolute -top-2 -right-2 bg-white dark:bg-surface-dark text-primary size-10 rounded-2xl border-4 border-primary/10 flex items-center justify-center shadow-lg active:scale-90 transition-all">
            <span className="material-symbols-outlined text-xl">photo_camera</span>
          </button>
          <div className="absolute -bottom-2 -left-2 bg-emerald-500 text-white size-10 rounded-2xl border-4 border-white dark:border-slate-800 flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-xl filled">verified</span>
          </div>
        </div>
        <h2 className="text-3xl font-headline font-black text-slate-900 dark:text-white mb-1">{state.userName}</h2>
        <div className="inline-block bg-primary/10 px-4 py-1 rounded-full">
           <p className="text-[11px] font-black text-primary uppercase tracking-[0.2em]">High Achiever ⚡</p>
        </div>
      </header>

      <main className="px-6 space-y-12 max-w-md mx-auto">
        {/* Card de Saldo Vibrante */}
        <div className={`${isNegative ? 'bg-white dark:bg-red-900/10 border-4 border-red-500 shadow-red-500/20' : 'bg-primary-dark'} rounded-[3rem] p-10 shadow-floating relative overflow-hidden text-center transition-colors duration-500`}>
          {!isNegative && (
            <>
              <div className="absolute top-0 right-0 size-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-2xl"></div>
              <div className="absolute bottom-0 left-0 size-40 bg-black/10 rounded-full -ml-20 -mb-20 blur-2xl"></div>
            </>
          )}
          
          <div className="relative z-10 flex flex-col items-center">
            <p className={`text-[11px] font-black uppercase tracking-[0.4em] mb-3 ${isNegative ? 'text-red-500' : 'text-teal-100'}`}>Energia Acumulada</p>
            <p className={`text-5xl font-black mb-4 ${isNegative ? 'text-red-500' : 'text-white'}`}>
              {formatScore(totalAccumulatedBalance)}
            </p>
            <div className={`flex items-center gap-3 px-5 py-2 rounded-2xl backdrop-blur-md ${isNegative ? 'bg-red-500/10 text-red-500' : 'bg-white/20 text-white'}`}>
              <span className={`material-symbols-outlined filled text-lg ${isNegative ? 'text-red-500' : 'text-amber-400'}`}>stars</span>
              <span className="text-[11px] font-black uppercase tracking-widest">Saldo de Troca</span>
            </div>
          </div>
        </div>

        {/* SHOP DE RECOMPENSAS */}
        <section className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-slate-900 dark:text-slate-100">SHOP DE MÉRITO</h3>
            <div className="size-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined filled">shopping_cart</span>
            </div>
          </div>
          
          <div className="space-y-8">
            {shopItems.map((item) => {
              const canAfford = totalAccumulatedBalance >= item.price;
              return (
                <div 
                  key={item.id} 
                  className="group relative h-56 rounded-[3rem] overflow-hidden shadow-card border-4 border-white dark:border-white/5 transition-all active:scale-95"
                >
                  <img src={item.img} alt={item.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                  
                  <div className="absolute inset-0 p-8 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div className="bg-white/20 backdrop-blur-xl p-3 rounded-2xl border border-white/30">
                        <span className="material-symbols-outlined text-white text-2xl">{item.icon}</span>
                      </div>
                      <div className="bg-emerald-500 px-5 py-2 rounded-2xl shadow-lg">
                        <span className="text-xs font-black text-white">R$ {item.price.toFixed(1).replace('.', ',')}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-end">
                      <div className="max-w-[70%]">
                        <h4 className="text-white font-headline font-black text-2xl leading-tight mb-2 tracking-tight">{item.title}</h4>
                        <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest leading-relaxed">{item.description}</p>
                      </div>
                      
                      <button 
                        disabled={!canAfford}
                        className={`size-14 rounded-2xl flex items-center justify-center transition-all ${
                          canAfford 
                          ? 'bg-white text-primary shadow-floating hover:scale-110' 
                          : 'bg-white/10 text-white/40 border border-white/20 cursor-not-allowed grayscale'
                        }`}
                      >
                        <span className="material-symbols-outlined filled">shopping_bag</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Badges de Conquista */}
        <section className="pb-10">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-8 px-2 text-center">Hall da Fama</h3>
          <div className="flex gap-8 overflow-x-auto pb-6 no-scrollbar snap-x">
            {badges.map((badge, i) => (
              <div key={i} className="flex flex-col items-center min-w-[110px] snap-center">
                <div className={`size-20 rounded-[2.5rem] ${badge.color} flex items-center justify-center mb-4 shadow-lg transition-all hover:scale-110 active:rotate-12`}>
                  <span className="material-symbols-outlined text-3xl filled">{badge.icon}</span>
                </div>
                <span className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest text-center">{badge.label}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProfilePage;
