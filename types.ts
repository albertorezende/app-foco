
export enum TaskCategory {
  TRABALHO = 'Trabalho',
  SAUDE = 'Saúde',
  ESPIRITUAL = 'Espiritualidade',
  CASA = 'Casa',
  ESTUDO = 'Estudo'
}

export enum Period {
  MORNING = 'Manhã',
  AFTERNOON = 'Tarde',
  EVENING = 'Noite'
}

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  startTime?: string;
  duration?: string;
  completed: boolean;
  isPriority: boolean;
  points: number;
  dateCreated: string; // ISO date string
}

export interface RoutineItem {
  id: string;
  title: string;
  period: Period;
  category: TaskCategory;
  completed: boolean;
  points: number;
  penalty: number;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  points: number; // Saldo líquido do dia
  totalEarned: number; // Total de pontos ganhos
  totalPenalty: number; // Total de penalidades aplicadas
  completedTaskIds: string[]; // IDs das tarefas concluídas
  completedRoutineIds: string[]; // IDs das rotinas concluídas
  categoryScores: { [key in TaskCategory]: number };
}

export interface AppState {
  tasks: Task[];
  routines: RoutineItem[];
  stats: {
    points: number;
    streak: number;
    lastOpenedDate: string; // YYYY-MM-DD
  };
  history: DailyLog[];
  userName: string;
}
