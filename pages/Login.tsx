
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
      
      {/* Imagem de Fundo do Rio de Janeiro - Visibilidade e Cores Intensificadas */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=2070&auto=format&fit=crop" 
          alt="Rio de Janeiro" 
          className="w-full h-full object-cover opacity-70 dark:opacity-50 saturate-[1.8] contrast-125 transition-opacity duration-1000"
        />
        {/* Overlay otimizado para dar foco ao centro mas manter cores vivas */}
        <div className="absolute inset-0 bg-gradient-to-b from-background-light/10 via-background-light/40 to-background-light dark:from-background-dark/20 dark:via-background-dark/50 dark:to-background-dark"></div>
      </div>

      {/* Elementos Decorativos de Fundo */}
      <div className="absolute top-0 right-0 size-80 bg-primary/30 rounded-full -mr-40 -mt-40 blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-0 left-0 size-80 bg-accent-sand/20 rounded-full -ml-40 -mb-40 blur-[100px]"></div>

      <div className="w-full max-w-sm space-y-16 relative z-10">
        <header className="text-center space-y-6">
          <div className="inline-flex items-center justify-center size-24 rounded-[2.5rem] bg-primary text-white shadow-floating animate-bounce-subtle border-4 border-white dark:border-slate-800">
            <span className="material-symbols-outlined text-5xl filled">bolt</span>
          </div>
          <div className="space-y-5">
            <h1 className="text-5xl font-headline font-black text-slate-900 dark:text-white tracking-tighter leading-tight drop-shadow-md">
              Tô na Atividade
            </h1>
            {/* Subtítulo com Destaque Aumentado: Cores mais sólidas, sombra mais forte e escala levemente maior */}
            <div className="inline-block px-8 py-3 bg-primary dark:bg-primary shadow-[0_15px_40px_-10px_rgba(20,184,166,0.8)] rounded-full border-2 border-white/80 dark:border-white/20 transform hover:scale-110 transition-transform duration-300">
              <p className="text-white font-black text-xs uppercase tracking-[0.7em] drop-shadow-sm ml-[0.7em]">Domine seu Dia</p>
            </div>
          </div>
        </header>

        <form onSubmit={handleAuth} className="space-y-8">
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-[0.2em] ml-2 drop-shadow-sm">Quem é você?</label>
            <input
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(''); }}
              placeholder="Digite seu nome..."
              className="w-full bg-white/95 dark:bg-surface-dark/95 backdrop-blur-lg border-4 border-primary/20 rounded-[2.5rem] px-8 py-6 text-lg font-extrabold text-slate-800 dark:text-white focus:ring-8 focus:ring-primary/15 focus:border-primary outline-none transition-all shadow-card placeholder:text-slate-300"
            />
            {error && <p className="text-xs font-black text-peace-rose ml-4 animate-pulse bg-white/70 dark:bg-black/40 px-3 py-1 rounded-full inline-block">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white font-black py-7 rounded-[2.5rem] shadow-floating active:scale-95 transition-all uppercase tracking-[0.3em] text-sm border-b-8 border-primary-dark group"
          >
            <span className="flex items-center justify-center gap-3">
              {isRegistering ? 'Começar Jornada' : 'Entrar no Fluxo'}
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">bolt</span>
            </span>
          </button>
        </form>

        <footer className="text-center">
          <button
            onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
            className="text-slate-900 dark:text-slate-100 text-xs font-black uppercase tracking-[0.2em] hover:text-primary transition-colors py-4 px-8 border-2 border-primary/10 rounded-2xl backdrop-blur-md bg-white/60 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 shadow-sm"
          >
            {isRegistering ? 'JÁ TENHO CONTA • LOGIN' : 'SOU NOVO • CADASTRAR'}
          </button>
        </footer>
      </div>
      
      {/* Rodapé flutuante removido conforme instrução visual 'REMOVA' no screenshot */}
    </div>
  );
};

export default LoginPage;
