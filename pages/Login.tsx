
import React, { useState } from 'react';
import { useAppContext } from '../App';

const LoginPage: React.FC = () => {
  const { login } = useAppContext();
  const [username, setUsername] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Ei! Qual é o seu nome?');
      return;
    }

    const usersList = JSON.parse(localStorage.getItem('rule_of_3_users_index') || '[]');
    
    if (isRegistering) {
      if (usersList.includes(username.toLowerCase())) {
        setError('Esse usuário já está na jornada!');
        return;
      }
      usersList.push(username.toLowerCase());
      localStorage.setItem('rule_of_3_users_index', JSON.stringify(usersList));
    } else {
      if (!usersList.includes(username.toLowerCase())) {
        setError('Usuário não encontrado. Vamos criar um?');
        return;
      }
    }

    login(username.toLowerCase());
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-10 page-transition bg-background-light dark:bg-background-dark overflow-hidden relative">
      
      {/* Imagem de Fundo do Rio de Janeiro Esmaecida */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=2070&auto=format&fit=crop" 
          alt="Rio de Janeiro" 
          className="w-full h-full object-cover opacity-10 dark:opacity-5 grayscale-[20%]"
        />
        {/* Overlay para suavizar ainda mais e garantir contraste */}
        <div className="absolute inset-0 bg-gradient-to-b from-background-light/40 via-transparent to-background-light dark:from-background-dark/60 dark:to-background-dark"></div>
      </div>

      {/* Elementos Decorativos de Fundo */}
      <div className="absolute top-0 right-0 size-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 size-64 bg-accent-sand/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>

      <div className="w-full max-w-sm space-y-16 relative z-10">
        <header className="text-center space-y-6">
          <div className="inline-flex items-center justify-center size-24 rounded-[2.5rem] bg-primary text-white shadow-floating animate-bounce-subtle">
            <span className="material-symbols-outlined text-5xl filled">bolt</span>
          </div>
          <div className="space-y-2">
            <h1 className="text-5xl font-headline font-black text-slate-900 dark:text-white tracking-tighter leading-tight">
              Tô na Atividade
            </h1>
            <p className="text-primary font-black text-xs uppercase tracking-[0.4em]">Domine seu Dia</p>
          </div>
        </header>

        <form onSubmit={handleAuth} className="space-y-8">
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Quem é você?</label>
            <input
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(''); }}
              placeholder="Digite seu nome..."
              className="w-full bg-white/80 dark:bg-surface-dark/80 backdrop-blur-sm border-4 border-primary/5 rounded-[2rem] px-8 py-6 text-lg font-extrabold text-slate-800 dark:text-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all shadow-card placeholder:text-slate-300"
            />
            {error && <p className="text-xs font-black text-peace-rose ml-4 animate-pulse">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white font-black py-7 rounded-[2.5rem] shadow-floating active:scale-95 transition-all uppercase tracking-[0.3em] text-sm border-b-8 border-primary-dark"
          >
            {isRegistering ? 'Começar Jornada ⚡' : 'Entrar no Fluxo 🚀'}
          </button>
        </form>

        <footer className="text-center">
          <button
            onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
            className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] hover:text-primary transition-colors py-4 px-8 border-2 border-slate-100/50 dark:border-slate-800/50 rounded-2xl backdrop-blur-sm"
          >
            {isRegistering ? 'JÁ TENHO CONTA • LOGIN' : 'SOU NOVO • CADASTRAR'}
          </button>
        </footer>
      </div>
      
      <div className="absolute bottom-12 text-[10px] text-slate-300 dark:text-slate-700 font-black uppercase tracking-[0.5em]">
        Focus & Energy • Rio de Janeiro
      </div>
    </div>
  );
};

export default LoginPage;
