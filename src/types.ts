/**
 * Core types for Aura Wellness Dashboard
 */

export interface UserProfile {
  name: string;
  avatarSeed: string;
  waterGoalMl: number;
  sleepGoalHours: number;
  stepGoal: number;
  bedtimeTarget: string;
  wakeTarget: string;
}

export interface WaterState {
  currentMl: number;
  goalMl: number;
  history: {
    id: string;
    time: string;
    amount: number;
  }[];
}

export interface SleepState {
  hours: number;
  quality: 1 | 2 | 3 | 4 | 5; // 1: Restless, 2: Fair, 3: Good, 4: Deep, 5: Rejuvenating
  bedtime: string;
  wakeTime: string;
  notes: string;
}

export type MoodType = 'serene' | 'happy' | 'calm' | 'energetic' | 'reflective' | 'anxious' | 'tired';

export interface MoodState {
  selectedMood: MoodType;
  energyLevel: number; // 1 to 5
  tags: string[];
  gratitudeNote: string;
  updatedAt: string;
}

export interface StepsState {
  current: number;
  goal: number;
}

export type HabitCategory = 'mind' | 'body' | 'rest' | 'nutrition';
export type HabitTime = 'morning' | 'afternoon' | 'evening' | 'anytime';

export interface Habit {
  id: string;
  name: string;
  category: HabitCategory;
  timeOfDay: HabitTime;
  completed: boolean;
  streak: number;
  targetDaysPerWeek: number;
}

export interface Workout {
  id: string;
  type: string;
  durationMin: number;
  intensity: 'low' | 'moderate' | 'high' | 'peak';
  calories: number;
  timestamp: string;
  notes?: string;
}

export interface DayMetric {
  dayName: string; // Mon, Tue, etc.
  dateStr: string; // 2026-10-23
  isToday: boolean;
  sleepHours: number;
  sleepQuality: number; // 1-5
  waterMl: number;
  waterGoalMl: number;
  steps: number;
  stepGoal: number;
  mood: MoodType;
  energy: number;
  habitsCompleted: number;
  habitsTotal: number;
  workoutDone: boolean;
  workoutType?: string;
  workoutMinutes?: number;
}

export interface WellnessDashboardData {
  profile: UserProfile;
  water: WaterState;
  sleep: SleepState;
  mood: MoodState;
  steps: StepsState;
  habits: Habit[];
  workouts: Workout[];
  weeklyHistory: DayMetric[];
  darkMode: boolean;
}
