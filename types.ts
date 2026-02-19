
export type Language = 'pt' | 'en';

export enum DietPhase {
  LOW_CARB = 'Low Carb',
  KETOGENIC = 'Ketogenic',
  CARNIVORE = 'Carnivore'
}

export enum SubPhase {
  START = 'Start',
  ADAPTATION = 'Adaptation',
  TRANSITION = 'Transition',
  RESULTS = 'Results'
}

export interface Task {
  id: string;
  titleKey: string;
  completed: boolean;
}

export interface Notification {
  id: string;
  title: Record<Language, string>;
  message: Record<Language, string>;
  date: string;
  read: boolean;
}

export interface UserProgress {
  currentPhase: DietPhase;
  currentSubPhase: SubPhase;
  tasks: Task[];
  carbsConsumed: number;
  language: Language;
  profileImage?: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  // Goals
  weightGoal: number;
  currentWeight: number;
  waterGoal: number;
  // Weight tracking
  weightHistory: { date: string; weight: number }[];
  // New
  notifications: Notification[];
  phaseCompletedAlertShown: boolean;
}

export interface FoodItem {
  name: Record<Language, string>;
  carbs: number; // per 100g
  calories: number; // per 100g
  protein: number; // per 100g
  fat: number; // per 100g
  category: 'protein' | 'vegetable' | 'fruit' | 'grain' | 'dairy' | 'fat';
  servingWeights?: {
    cup?: number; // weight in grams
    unit?: number; // weight in grams
  };
}

// Added DietConfigs type to fix import error in App.tsx
export type DietConfigs = {
  [key in DietPhase]: {
    limit: number;
    color: string;
  };
};
