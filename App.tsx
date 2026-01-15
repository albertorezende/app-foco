
import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation, Link, Navigate } from 'react-router-dom';
import { AppState, Task, RoutineItem, TaskCategory, Period, DailyLog, DailyLogDetail } from './types';
import HomePage from './pages/Home';
import EvolutionPage from './pages/Evolution';
import RoutinePage from './pages/Routine';
import SettingsPage from './pages/Settings';
import ProfilePage from './pages/Profile';
import AddTaskPage from './pages/AddTask';
import AddRoutinePage from './pages/AddRoutine';
import AICoachPage from './pages/AICoach';
import LoginPage from './pages/Login';

// --- Constants ---
const CLOSURE_TIME = '23:10:00';

const DEFAULT_ROUTINES: RoutineItem[] = [
  { id: 'm1', title: 'Orar', period: Period.MORNING, category: TaskCategory.ESPIRITUAL, completed: false, points: 1, penalty: 3 },
  { id: 'm2', title: 'Meditar', period: Period.MORNING, category: TaskCategory.SAUDE, completed: false, points: 0.5, penalty: 3 },
  { id: 'm3', title: 'Escovar dentes', period: Period.MORNING, category: TaskCategory.SAUDE, completed: false, points: 0.5, penalty: 3 },
  { id: 'm4', title: 'Tomar banho', period: Period.MORNING, category: TaskCategory.SAUDE, completed: false, points: 0.5, penalty: 3 },
  { id: 'm5', title: 'Molhar plantas', period: Period.MORNING, category: TaskCategory.CASA, completed: false, points: 1, penalty: 3 },
  { id: 'm6', title: 'Limpar varanda', period: Period.MORNING, category: TaskCategory.CASA, completed: false, points: 1, penalty: 3 },
  { id: 'm7', title: 'Encher garrafa de água', period: Period.MORNING, category: TaskCategory.SAUDE, completed: false, points: 1, penalty: 3 },
  { id: 'm8', title: 'Exercício', period: Period.MORNING, category: TaskCategory.SAUDE, completed: false, points: 3, penalty: 3 },
  { id: 'm9', title: 'Leitura', period: Period.MORNING, category: TaskCategory.ESTUDO, completed: false, points: 2, penalty: 3 },
  { id: 'a1', title: 'Almoço', period: Period.AFTERNOON, category: TaskCategory.SAUDE, completed: false, points: 0.5, penalty: 3 },
  { id: 'a2', title: 'Estudo 30 min', period: Period.AFTERNOON, category: TaskCategory.ESTUDO, completed: false, points: 1, penalty: 3 },
  { id: 'n1', title: 'Jantar', period: Period.EVENING, category: TaskCategory.SAUDE, completed: false, points: 1, penalty: 3 },
  { id: 'n2', title: 'Exercício José', period: Period.EVENING, category: TaskCategory.CASA, completed: false, points: 2, penalty: 3 },
  { id: 'n3', title: 'Dormir até as 23:00', period: Period.EVENING, category: TaskCategory.SAUDE, completed: false, points: 2, penalty: 3 },
];

const getBrasiliaTime = () => new Date(new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
const getBrasiliaDateString = (date: Date) => date.toISOString().split('T')[0];

interface AppContextType {
  state: AppState | null;
  currentUser: string | null;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  login: (username: string) => void;
  logout: () => void;
  addTask: (task: any) => boolean;
  updateTask: (id: string, updates: Partial<Task>) => void;
  addRoutine: (routine: any) => void;
  toggleTask: (id: string) => void;
  toggleRoutine: (id: string) => void;
  resetData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<string | null>(() => {
    try { return localStorage.getItem('rule_of_3_active_user'); } catch { return null; }
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('rule_of_3_dark_mode');
    if (saved !== null) return JSON.parse(saved);
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  const [state, setState] = useState<AppState | null>(() => {
    try {
      const activeUser = localStorage.getItem('rule_of_3_active_user');
      if (activeUser) {
        const saved = localStorage.getItem(`rule_of_3_data_${activeUser}`);
        return saved ? JSON.parse(saved) : null;
      }
    } catch (e) { console.error("Persistence Init Error:", e); }
    return null;
  });

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  useEffect(() => {
    localStorage.setItem('rule_of_3_dark_mode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const createInitialState = useCallback((username: string): AppState => ({
    tasks: [],
    routines: DEFAULT_ROUTINES,
    stats: {
      points: 0,
      streak: 0,
      lastOpenedDate: getBrasiliaDateString(getBrasiliaTime())
    },
    history: [],
    userName: username
  }), []);

  useEffect(() => {
    if (currentUser) {
      const userKey = `rule_of_3_data_${currentUser}`;
      let data: AppState | null = null;
      try {
        const saved = localStorage.getItem(userKey);
        if (saved) data = JSON.parse(saved);
      } catch (e) { console.error("Load User Data Error:", e); }

      if (data) {
        setState(data);
      } else if (!state || state.userName !== currentUser) {
        setState(createInitialState(currentUser));
      }
      try { localStorage.setItem('rule_of_3_active_user', currentUser); } catch {}
    } else {
      setState(null);
      try { localStorage.removeItem('rule_of_3_active_user'); } catch {}
    }
  }, [currentUser, createInitialState]);

  useEffect(() => {
    if (currentUser && state) {
      try { localStorage.setItem(`rule_of_3_data_${currentUser}`, JSON.stringify(state)); } catch {}
    }
  }, [state, currentUser]);

  const login = (username: string) => setCurrentUser(username);
  const logout = () => setCurrentUser(null);

  const handleDayTransition = useCallback((lastCycleDate: string) => {
    setState(prev => {
      if (!prev) return null;
      const nowBrasilia = getBrasiliaTime();
      const todayStr = getBrasiliaDateString(nowBrasilia);

      const earnedFromRoutines = prev.routines.filter(r => r.completed).reduce((s, r) => s + (Number(r.points) || 0), 0);
      const earnedFromTasks = prev.tasks.filter(t => t.completed).reduce((s, t) => s + (Number(t.points) || 0), 0);
      const penaltyFromRoutines = prev.routines.filter(r => !r.completed).reduce((s, r) => s + (Number(r.penalty) || 0), 0);
      const penaltyFromTasks = prev.tasks.filter(t => !t.completed).length * 15;

      const dailyNetBalance = (earnedFromRoutines + earnedFromTasks) - (penaltyFromRoutines + penaltyFromTasks);

      const categoryScores = Object.values(TaskCategory).reduce((acc, cat) => {
        acc[cat] = prev.routines.filter(r => r.category === cat && r.completed).reduce((s, r) => s + (Number(r.points) || 0), 0) +
                   prev.tasks.filter(t => t.category === cat && t.completed).reduce((s, t) => s + (Number(t.points) || 0), 0);
        return acc;
      }, {} as any);

      // Captura detalhes específicos do dia para o histórico detalhado
      const details: DailyLogDetail[] = [
        ...prev.tasks.map(t => ({
          title: t.title,
          points: t.completed ? (t.points || 5) : -15,
          type: (t.completed ? 'gain' : 'penalty') as 'gain' | 'penalty'
        })),
        ...prev.routines.map(r => ({
          title: r.title,
          points: r.completed ? (r.points || 0) : -(r.penalty || 0),
          type: (r.completed ? 'gain' : 'penalty') as 'gain' | 'penalty'
        }))
      ];

      const newHistoryEntry: DailyLog = {
        date: lastCycleDate,
        points: dailyNetBalance,
        totalEarned: earnedFromRoutines + earnedFromTasks,
        totalPenalty: penaltyFromRoutines + penaltyFromTasks,
        completedTaskIds: prev.tasks.filter(t => t.completed).map(t => t.id),
        completedRoutineIds: prev.routines.filter(r => r.completed).map(r => r.id),
        categoryScores,
        details
      };

      const allTasksCompleted = prev.tasks.length === 3 && prev.tasks.every(t => t.completed);
      const rolledOverTasks = prev.tasks.filter(t => !t.completed).map(t => ({ ...t, dateCreated: todayStr, completed: false }));

      return {
        ...prev,
        tasks: rolledOverTasks,
        routines: DEFAULT_ROUTINES.map(r => ({ ...r, completed: false })),
        stats: {
          ...prev.stats,
          points: Math.max(0, prev.stats.points + dailyNetBalance),
          lastOpenedDate: todayStr,
          streak: allTasksCompleted ? prev.stats.streak + 1 : 0
        },
        history: [...prev.history, newHistoryEntry].slice(-365)
      };
    });
  }, []);

  useEffect(() => {
    if (!state) return;
    const checkTransition = () => {
      const now = getBrasiliaTime();
      const lastDate = state.stats.lastOpenedDate;
      const resetThreshold = new Date(`${lastDate}T${CLOSURE_TIME}`);
      if (now > resetThreshold) handleDayTransition(lastDate);
    };
    const interval = setInterval(checkTransition, 60000);
    checkTransition();
    return () => clearInterval(interval);
  }, [state?.stats.lastOpenedDate, handleDayTransition]);

  const addTask = useCallback((taskData: any) => {
    if (!state || state.tasks.length >= 3) return false;
    setState(prev => prev ? {
      ...prev,
      tasks: [...prev.tasks, { ...taskData, id: Date.now().toString(), completed: false, isPriority: true, points: 5, dateCreated: getBrasiliaDateString(getBrasiliaTime()) }]
    } : null);
    return true;
  }, [state]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setState(prev => prev ? { ...prev, tasks: prev.tasks.map(t => t.id === id ? { ...t, ...updates } : t) } : null);
  }, []);

  const addRoutine = useCallback((routineData: any) => {
    setState(prev => prev ? { ...prev, routines: [...prev.routines, { ...routineData, id: Date.now().toString(), completed: false }] } : null);
  }, []);

  const toggleTask = useCallback((id: string) => {
    setState(prev => {
      if (!prev) return null;
      const task = prev.tasks.find(t => t.id === id);
      if (!task) return prev;
      return {
        ...prev,
        tasks: prev.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t),
        stats: { ...prev.stats, points: Math.max(0, prev.stats.points + (!task.completed ? (Number(task.points) || 5) : -(Number(task.points) || 5))) }
      };
    });
  }, []);

  const toggleRoutine = useCallback((id: string) => {
    setState(prev => {
      if (!prev) return null;
      const routine = prev.routines.find(r => r.id === id);
      if (!routine) return prev;
      return {
        ...prev,
        routines: prev.routines.map(r => r.id === id ? { ...r, completed: !r.completed } : r),
        stats: { ...prev.stats, points: Math.max(0, prev.stats.points + (!routine.completed ? (Number(routine.points) || 1) : -(Number(routine.points) || 1))) }
      };
    });
  }, []);

  const resetData = () => { 
    if (currentUser) {
      try { localStorage.removeItem(`rule_of_3_data_${currentUser}`); } catch {}
    }
    window.location.reload(); 
  };

  return <AppContext.Provider value={{ state, currentUser, isDarkMode, toggleDarkMode, login, logout, addTask, updateTask, addRoutine, toggleTask, toggleRoutine, resetData }}>{children}</AppContext.Provider>;
};

const BottomNav = () => {
  const location = useLocation();
  const activePath = location.pathname;
  const navItems = [
    { path: '/', label: 'HOJE', icon: 'spa' },
    { path: '/evolution', label: 'EVOLUÇÃO', icon: 'auto_graph' },
    { path: '/routine', label: 'ROTINA', icon: 'self_improvement' },
    { path: '/profile', label: 'PERFIL', icon: 'person_outline' },
    { path: '/settings', label: 'AJUSTES', icon: 'settings_heart' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-surface-dark/90 backdrop-blur-2xl border-t border-primary/20 pb-8 pt-3 z-50">
      <div className="relative w-full max-w-md mx-auto grid grid-cols-5 items-end px-2">
        {navItems.map((item, idx) => (
          <Link key={idx} to={item.path} className={`flex flex-col items-center gap-1 transition-all duration-300 ${activePath === item.path ? 'text-primary scale-110' : 'text-slate-500 hover:text-primary/60'}`}>
            <span className={`material-symbols-outlined text-[24px] ${activePath === item.path ? 'filled' : ''}`}>{item.icon}</span>
            <span className="text-[9px] font-bold tracking-widest uppercase">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

const App = () => {
  return (
    <AppProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </AppProvider>
  );
};

const AppContent = () => {
  const { currentUser, state } = useAppContext();
  const location = useLocation();
  
  if (!currentUser) {
    return (
      <div className="min-h-screen max-w-md mx-auto relative bg-background-light dark:bg-background-dark">
        <Routes>
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </div>
    );
  }

  if (!state) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background-light dark:bg-background-dark text-primary font-bold gap-4 p-8 text-center">
        <span className="material-symbols-outlined text-4xl animate-spin">refresh</span>
        <p>Iniciando jornada...</p>
      </div>
    );
  }

  const hideNav = ['/add-task', '/edit-task', '/add-routine'].some(p => location.pathname.startsWith(p));

  return (
    <div className="min-h-screen max-w-md mx-auto relative bg-background-light dark:bg-background-dark transition-colors duration-500">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/evolution" element={<EvolutionPage />} />
        <Route path="/routine" element={<RoutinePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/add-task" element={<AddTaskPage />} />
        <Route path="/edit-task/:id" element={<AddTaskPage />} />
        <Route path="/add-routine" element={<AddRoutinePage />} />
        <Route path="/ai-coach" element={<AICoachPage />} />
        <Route path="/login" element={<Navigate to="/" />} />
      </Routes>
      {!hideNav && <BottomNav />}
    </div>
  );
};

export default App;
