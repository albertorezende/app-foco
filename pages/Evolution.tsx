
import React, { useState, useMemo } from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Cell
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';
import { TaskCategory } from '../types';

interface ChartDataItem {
  name: string;
  value: number;
  fill?: string;
}

const EvolutionPage: React.FC = () => {
  const { state } = useAppContext();
  const navigate = useNavigate();
  const [activePeriod, setActivePeriod] = useState('Semanal');

  if (!state) return null;

  const periods = ['Diário', 'Semanal', 'Mensal', 'Total'];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(val);
  };

  const categoryMap: Record<string, string> = {
    [TaskCategory.SAUDE]: 'SAÚDE',
    [TaskCategory.ESPIRITUAL]: 'ESPIRITUAL',
    [TaskCategory.TRABALHO]: 'TRABALHO',
    [TaskCategory.CASA]: 'LAR',
    [TaskCategory.ESTUDO]: 'INTELECTUAL'
  };

  const todayStats = useMemo(() => {
    const donePoints = [
      ...state.routines.filter(r => r.completed).map(r => r.points),
      ...state.tasks.filter(t => t.completed).map(t => t.points)
    ].reduce((a, b) => a + b, 0);

    const pendingPoints = [
      ...state.routines.filter(r => !r.completed).map(r => r.penalty),
      ...state.tasks.filter(t => !t.completed).map(() => 15)
    ].reduce((a, b) => a + b, 0);

    return { done: donePoints, pending: pendingPoints, balance: donePoints - pendingPoints };
  }, [state.routines, state.tasks]);

  const totalAccumulatedBalance = useMemo(() => {
    const historyBalance = state.history.reduce((acc, log) => acc + log.points, 0);
    return historyBalance + todayStats.balance;
  }, [state.history, todayStats.balance]);

  const chartData: ChartDataItem[] = useMemo(() => {
    if (activePeriod === 'Diário') {
      return [
        { name: 'REALIZADO', value: todayStats.done, fill: '#14B8A6' },
        { name: 'PENDENTE', value: -todayStats.pending, fill: '#F43F5E' }
      ];
    }

    if (activePeriod === 'Semanal') {
      const days = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'];
      return days.map((day, idx) => {
        const isToday = idx === (new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
        if (isToday) return { name: day, value: todayStats.balance };
        const hist = state.history[state.history.length - (7 - idx)];
        return { name: day, value: hist ? hist.points : (Math.random() * 40 - 20) };
      });
    }

    if (activePeriod === 'Mensal') {
      const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
      return months.map(m => ({
        name: m,
        value: Math.random() * 200 - 80 
      }));
    }

    if (activePeriod === 'Total') {
      return state.history.concat([{ 
        date: 'Hoje', 
        points: todayStats.balance,
        totalEarned: todayStats.done,
        totalPenalty: todayStats.pending,
        completedTaskIds: [],
        completedRoutineIds: [],
        categoryScores: {} as any 
      }]).map((h, i) => ({
        name: `D${i+1}`,
        value: h.points
      }));
    }

    return [];
  }, [activePeriod, todayStats, state.history]);

  const radarData = useMemo(() => {
    const order = [TaskCategory.SAUDE, TaskCategory.ESPIRITUAL, TaskCategory.TRABALHO, TaskCategory.CASA, TaskCategory.ESTUDO];
    return order.map(cat => {
      const done = [...state.routines.filter(r => r.category === cat && r.completed), ...state.tasks.filter(t => t.category === cat && t.completed)].length;
      const total = [...state.routines.filter(r => r.category === cat), ...state.tasks.filter(t => t.category === cat)].length;
      return {
        subject: categoryMap[cat],
        value: total > 0 ? (done / total) * 100 : 20,
        fullMark: 100,
      };
    });
  }, [state.routines, state.tasks]);

  const currentPeriodBalance: number = activePeriod === 'Diário' 
    ? todayStats.balance 
    : chartData.reduce((acc: number, curr) => acc + (curr.value || 0), 0);

  return (
    <div className="pb-32 page-transition bg-background-light dark:bg-background-dark min-h-screen">
      <header className="px-6 pt-10 pb-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="size-10 flex items-center justify-start text-slate-400">
          <span className="material-symbols-outlined !text-2xl">chevron_left</span>
        </button>
        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-700 dark:text-slate-200">Minha Evolução</h2>
        <button className="size-10 flex items-center justify-end text-slate-400">
          <span className="material-symbols-outlined !text-2xl">share</span>
        </button>
      </header>

      <div className="px-6 mb-8 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <div className="bg-slate-200/50 dark:bg-white/5 p-1 rounded-2xl flex flex-1 shadow-inner">
            {periods.map(period => (
              <button 
                key={period}
                onClick={() => setActivePeriod(period)}
                className={`flex-1 py-2 text-[8px] font-black uppercase rounded-xl transition-all tracking-widest ${
                  activePeriod === period 
                  ? 'bg-white dark:bg-surface-dark text-primary shadow-sm' 
                  : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="px-6 space-y-6">
        <section className="bg-white dark:bg-surface-dark rounded-[2.5rem] p-8 border border-primary/5 shadow-soft">
          <h3 className="text-center font-headline font-bold text-sm mb-6 tracking-widest uppercase text-slate-400">Equilíbrio por Áreas</h3>
          <div className="h-56 w-full flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#f1f5f9" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: '#94a3b8', fontSize: 8, fontWeight: 800 }} 
                />
                <Radar
                  name="Evolução"
                  dataKey="value"
                  stroke="#14B8A6"
                  fill="#14B8A6"
                  fillOpacity={0.2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-white dark:bg-surface-dark rounded-[2.5rem] p-8 border border-primary/5 shadow-soft relative overflow-hidden">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="font-headline font-bold text-md text-slate-800 dark:text-white mb-1">
                Desempenho {activePeriod}
              </h3>
              <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.15em]">
                {activePeriod === 'Diário' ? 'Ganhos vs. Pendências' : 'Balanço de Evolução'}
              </p>
            </div>
            <div className="text-right">
              <p className={`font-black text-lg ${currentPeriodBalance >= 0 ? 'text-primary' : 'text-peace-rose'}`}>
                {formatCurrency(currentPeriodBalance)}
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 5, left: -30, bottom: 5 }} stackOffset="sign">
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 800 }} 
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: 'rgba(20, 184, 166, 0.05)' }}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', fontSize: '10px', fontWeight: 'bold' }}
                  formatter={(value: number) => [formatCurrency(value), 'Balanço']}
                />
                <ReferenceLine y={0} stroke="#e2e8f0" strokeWidth={1} />
                <Bar dataKey="value" radius={activePeriod === 'Diário' ? [12, 12, 12, 12] : [6, 6, 6, 6]} barSize={activePeriod === 'Diário' ? 40 : 12}>
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.fill || (entry.value >= 0 ? '#14B8A6' : '#F43F5E')} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-surface-dark p-6 rounded-[2rem] border border-primary/5 shadow-soft">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-peace-rose text-sm filled">local_fire_department</span>
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Streak</span>
            </div>
            <p className="text-2xl font-black text-slate-800 dark:text-white">{state.stats.streak} Dias</p>
          </div>
          
          <div className="bg-white dark:bg-surface-dark p-6 rounded-[2rem] border border-primary/5 shadow-soft">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary text-sm filled">stars</span>
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Acumulado</span>
            </div>
            <p className={`text-xl font-black ${totalAccumulatedBalance >= 0 ? 'text-primary' : 'text-peace-rose'}`}>
              {formatCurrency(totalAccumulatedBalance)}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EvolutionPage;
