
import React from 'react';
import { useAppContext } from '../App';

const SettingsPage: React.FC = () => {
  const { state, resetData, logout } = useAppContext();

  return (
    <div className="pb-32 page-transition">
      <header className="px-6 pt-10 pb-6 text-center">
        <h2 className="text-xl font-headline font-bold text-primary uppercase tracking-widest">Ajustes</h2>
        <p className="text-slate-400 text-xs mt-1">Olá, <span className="text-primary font-bold">{state?.userName}</span>. Personalize sua experiência.</p>
      </header>

      <main className="max-w-md mx-auto px-6 space-y-8">
        <section>
          <h3 className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-4 px-2">VISUAL E SISTEMA</h3>
          <div className="bg-white dark:bg-surface-dark border border-primary/5 rounded-[2rem] overflow-hidden divide-y divide-primary/5 shadow-soft">
            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-4">
                <div className="text-primary bg-primary/10 p-2.5 rounded-2xl">
                  <span className="material-symbols-outlined filled">notifications_active</span>
                </div>
                <div>
                  <p className="font-bold text-sm">Lembretes</p>
                  <p className="text-[10px] text-slate-400 font-medium">Avisos suaves de tarefas</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-4">
                <div className="text-soft-blue bg-soft-blue/10 p-2.5 rounded-2xl">
                  <span className="material-symbols-outlined filled">dark_mode</span>
                </div>
                <div>
                  <p className="font-bold text-sm">Modo Escuro</p>
                  <p className="text-[10px] text-slate-400 font-medium">Conforto para seus olhos</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-4 px-2">CONTA</h3>
          <div className="bg-white dark:bg-surface-dark border border-primary/5 rounded-[2rem] overflow-hidden divide-y divide-primary/5 shadow-soft">
            <button 
              onClick={logout}
              className="w-full flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
            >
              <div className="flex items-center gap-4 text-slate-600 dark:text-slate-300">
                <div className="bg-slate-100 dark:bg-slate-800 p-2.5 rounded-2xl">
                  <span className="material-symbols-outlined filled">logout</span>
                </div>
                <div>
                  <p className="font-bold text-sm">Sair da Conta</p>
                  <p className="text-[10px] opacity-60 font-medium uppercase tracking-wider">Alternar usuário</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-300">chevron_right</span>
            </button>

            <button 
              onClick={() => {
                if(confirm('Isso apagará todo seu progresso. Tem certeza?')) resetData();
              }}
              className="w-full flex items-center justify-between p-5 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors group"
            >
              <div className="flex items-center gap-4 text-red-400">
                <div className="bg-red-50 dark:bg-red-900/20 p-2.5 rounded-2xl group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined filled">delete_sweep</span>
                </div>
                <div>
                  <p className="font-bold text-sm">Limpar Meus Dados</p>
                  <p className="text-[10px] opacity-60 font-medium uppercase tracking-wider">Ação Irreversível</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-300">chevron_right</span>
            </button>
          </div>
        </section>

        <div className="bg-accent-sand/5 p-6 rounded-[2rem] border border-accent-sand/20">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-accent-sand mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">psychology_alt</span>
            Sobre a Regra de 3
          </h3>
          <p className="text-xs leading-relaxed text-slate-500 font-medium italic">
            "Não se trata de fazer mais, trata-se de fazer o que importa."
            <br/><br/>
            O Rule of 3 Planner ajuda você a focar no essencial através de 3 slots diários. Se você não terminar hoje, o sistema trará para amanhã, garantindo que nada importante se perca no ruído.
          </p>
        </div>

        <div className="text-center pt-4">
           <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.3em]">Rule of 3 - Peace v1.1.0</p>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
