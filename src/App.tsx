import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DailyMetrics } from './components/DailyMetrics';
import { HabitTracker } from './components/HabitTracker';
import { WorkoutLog } from './components/WorkoutLog';
import { WeeklyAnalytics } from './components/WeeklyAnalytics';
import { NotionGuide } from './components/NotionGuide';
import { MindfulBreathingModal } from './components/MindfulBreathingModal';
import { ProfileModal } from './components/ProfileModal';
import { 
  WellnessDashboardData, 
  Habit, 
  Workout, 
  WaterState, 
  SleepState, 
  MoodState, 
  StepsState, 
  UserProfile 
} from './types';
import { INITIAL_DASHBOARD_DATA } from './utils/initialData';
import { 
  Heart, 
  Wind, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Calendar, 
  Droplet, 
  Moon, 
  Footprints, 
  Activity 
} from 'lucide-react';

const STORAGE_KEY = 'aura_wellness_dashboard_v2';

export default function App() {
  const [data, setData] = useState<WellnessDashboardData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_DASHBOARD_DATA;
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'habits' | 'workouts' | 'analytics' | 'notion'>('overview');
  const [breathingOpen, setBreathingOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Sync dark mode class to document element
  useEffect(() => {
    if (data.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [data.darkMode]);

  // Persist state updates to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignore
    }
  }, [data]);

  // Theme Toggle
  const handleToggleTheme = () => {
    setData((prev) => ({
      ...prev,
      darkMode: !prev.darkMode,
    }));
  };

  // Profile Update
  const handleSaveProfile = (newProfile: UserProfile) => {
    setData((prev) => ({
      ...prev,
      profile: newProfile,
      water: {
        ...prev.water,
        goalMl: newProfile.waterGoalMl,
      },
      steps: {
        ...prev.steps,
        goal: newProfile.stepGoal,
      },
    }));
  };

  // Water Tracker
  const handleUpdateWater = (newWater: WaterState) => {
    setData((prev) => {
      // also sync to today's entry in weekly history
      const updatedHistory = prev.weeklyHistory.map((day) => 
        day.isToday ? { ...day, waterMl: newWater.currentMl } : day
      );
      return {
        ...prev,
        water: newWater,
        weeklyHistory: updatedHistory,
      };
    });
  };

  // Sleep Tracker
  const handleUpdateSleep = (newSleep: SleepState) => {
    setData((prev) => {
      const updatedHistory = prev.weeklyHistory.map((day) => 
        day.isToday ? { ...day, sleepHours: newSleep.hours, sleepQuality: newSleep.quality } : day
      );
      return {
        ...prev,
        sleep: newSleep,
        weeklyHistory: updatedHistory,
      };
    });
  };

  // Mood Tracker
  const handleUpdateMood = (newMood: MoodState) => {
    setData((prev) => {
      const updatedHistory = prev.weeklyHistory.map((day) => 
        day.isToday ? { ...day, mood: newMood.selectedMood, energy: newMood.energyLevel } : day
      );
      return {
        ...prev,
        mood: newMood,
        weeklyHistory: updatedHistory,
      };
    });
  };

  // Steps Tracker
  const handleUpdateSteps = (newSteps: StepsState) => {
    setData((prev) => {
      const updatedHistory = prev.weeklyHistory.map((day) => 
        day.isToday ? { ...day, steps: newSteps.current } : day
      );
      return {
        ...prev,
        steps: newSteps,
        weeklyHistory: updatedHistory,
      };
    });
  };

  // Habits Handlers
  const handleToggleHabit = (id: string) => {
    setData((prev) => {
      const updatedHabits = prev.habits.map((h) => {
        if (h.id === id) {
          const completed = !h.completed;
          const streak = completed ? h.streak + 1 : Math.max(0, h.streak - 1);
          return { ...h, completed, streak };
        }
        return h;
      });

      const completedCount = updatedHabits.filter((h) => h.completed).length;
      const updatedHistory = prev.weeklyHistory.map((day) => 
        day.isToday ? { ...day, habitsCompleted: completedCount, habitsTotal: updatedHabits.length } : day
      );

      return {
        ...prev,
        habits: updatedHabits,
        weeklyHistory: updatedHistory,
      };
    });
  };

  const handleAddHabit = (newHabit: Habit) => {
    setData((prev) => {
      const updatedHabits = [...prev.habits, newHabit];
      const completedCount = updatedHabits.filter((h) => h.completed).length;
      const updatedHistory = prev.weeklyHistory.map((day) => 
        day.isToday ? { ...day, habitsCompleted: completedCount, habitsTotal: updatedHabits.length } : day
      );
      return {
        ...prev,
        habits: updatedHabits,
        weeklyHistory: updatedHistory,
      };
    });
  };

  const handleDeleteHabit = (id: string) => {
    setData((prev) => {
      const updatedHabits = prev.habits.filter((h) => h.id !== id);
      const completedCount = updatedHabits.filter((h) => h.completed).length;
      const updatedHistory = prev.weeklyHistory.map((day) => 
        day.isToday ? { ...day, habitsCompleted: completedCount, habitsTotal: updatedHabits.length } : day
      );
      return {
        ...prev,
        habits: updatedHabits,
        weeklyHistory: updatedHistory,
      };
    });
  };

  const handleResetHabitsToday = () => {
    setData((prev) => {
      const updatedHabits = prev.habits.map((h) => ({ ...h, completed: false }));
      const updatedHistory = prev.weeklyHistory.map((day) => 
        day.isToday ? { ...day, habitsCompleted: 0 } : day
      );
      return {
        ...prev,
        habits: updatedHabits,
        weeklyHistory: updatedHistory,
      };
    });
  };

  const handleCompleteAllHabits = () => {
    setData((prev) => {
      const updatedHabits = prev.habits.map((h) => ({
        ...h,
        completed: true,
        streak: h.completed ? h.streak : h.streak + 1,
      }));
      const updatedHistory = prev.weeklyHistory.map((day) => 
        day.isToday ? { ...day, habitsCompleted: updatedHabits.length } : day
      );
      return {
        ...prev,
        habits: updatedHabits,
        weeklyHistory: updatedHistory,
      };
    });
  };

  // Workout Handlers
  const handleAddWorkout = (newWorkout: Workout) => {
    setData((prev) => {
      const updatedWorkouts = [newWorkout, ...prev.workouts];
      const updatedHistory = prev.weeklyHistory.map((day) => 
        day.isToday ? { 
          ...day, 
          workoutDone: true, 
          workoutType: newWorkout.type, 
          workoutMinutes: (day.workoutMinutes || 0) + newWorkout.durationMin 
        } : day
      );
      return {
        ...prev,
        workouts: updatedWorkouts,
        weeklyHistory: updatedHistory,
      };
    });
  };

  const handleDeleteWorkout = (id: string) => {
    setData((prev) => ({
      ...prev,
      workouts: prev.workouts.filter((w) => w.id !== id),
    }));
  };

  const handleResetAllData = () => {
    setData(INITIAL_DASHBOARD_DATA);
    localStorage.removeItem(STORAGE_KEY);
  };

  const totalHabitsCompletedToday = data.habits.filter((h) => h.completed).length;
  const totalHabitsCount = data.habits.length;
  const currentStreak = 8; // Days consecutive mindful tracking

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#121415] text-stone-800 dark:text-stone-100 transition-colors duration-200">
      {/* Universal Top Header */}
      <Header
        profile={data.profile}
        darkMode={data.darkMode}
        onToggleTheme={handleToggleTheme}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenBreathing={() => setBreathingOpen(true)}
        onOpenProfile={() => setProfileOpen(true)}
        totalHabitsCompletedToday={totalHabitsCompletedToday}
        totalHabitsCount={totalHabitsCount}
        currentStreak={currentStreak}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* VIEW 1: Overview (Today's Balance Hub) */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            {/* Section 1: Daily Quick Log Cards */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
                    Daily Metrics & Quick Log
                  </h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Log hydration, sleep hours, present mindset, and daily physical steps.
                  </p>
                </div>
              </div>

              <DailyMetrics
                water={data.water}
                onUpdateWater={handleUpdateWater}
                sleep={data.sleep}
                onUpdateSleep={handleUpdateSleep}
                mood={data.mood}
                onUpdateMood={handleUpdateMood}
                steps={data.steps}
                onUpdateSteps={handleUpdateSteps}
                waterGoalMl={data.profile.waterGoalMl}
                sleepGoalHours={data.profile.sleepGoalHours}
                stepGoal={data.profile.stepGoal}
              />
            </div>

            {/* Split Row: Habit Checklist + Quick Movement Log Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Habits Tracker (Left 7 Cols) */}
              <div className="lg:col-span-7">
                <HabitTracker
                  habits={data.habits}
                  onToggleHabit={handleToggleHabit}
                  onAddHabit={handleAddHabit}
                  onDeleteHabit={handleDeleteHabit}
                  onResetToday={handleResetHabitsToday}
                  onCompleteAll={handleCompleteAllHabits}
                />
              </div>

              {/* Movement & Quick Reflection (Right 5 Cols) */}
              <div className="lg:col-span-5 space-y-6">
                {/* Movement Streak Teaser Card */}
                <div className="bg-white dark:bg-stone-800/90 rounded-2xl p-6 border border-stone-200 dark:border-stone-700/80 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                        <Activity className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                          Movement & Activity
                        </h3>
                        <span className="text-[11px] text-stone-500">
                          {data.workouts.length} recorded this week
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('workouts')}
                      className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
                    >
                      <span>Log Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* 7-day mini strip */}
                  <div className="grid grid-cols-7 gap-1.5 my-3 text-center">
                    {data.weeklyHistory.map((day) => (
                      <div
                        key={day.dateStr}
                        className={`p-2 rounded-xl text-center border ${
                          day.workoutDone
                            ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-200'
                            : 'bg-stone-50 dark:bg-stone-900/40 border-stone-100 dark:border-stone-800 text-stone-400'
                        }`}
                      >
                        <span className="text-[10px] font-semibold block uppercase">{day.dayName}</span>
                        <div className="mt-1">
                          {day.workoutDone ? '✓' : '—'}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Most recent workout badge */}
                  {data.workouts[0] && (
                    <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-100 dark:border-stone-700/60 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-stone-800 dark:text-stone-200 block">
                          Latest: {data.workouts[0].type}
                        </span>
                        <span className="text-stone-500 text-[11px]">
                          {data.workouts[0].durationMin} mins · {data.workouts[0].calories} kcal
                        </span>
                      </div>
                      <span className="text-[11px] text-stone-400 font-mono">
                        {data.workouts[0].timestamp.split(',')[0]}
                      </span>
                    </div>
                  )}
                </div>

                {/* 1-Minute Reset Banner */}
                <div className="bg-gradient-to-br from-teal-500/10 via-emerald-500/5 to-stone-100 dark:from-teal-950/40 dark:via-stone-900 dark:to-stone-800 rounded-2xl p-6 border border-teal-500/20 shadow-xs flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-teal-700 dark:text-teal-300 uppercase tracking-wide flex items-center gap-1.5">
                      <Wind className="w-3.5 h-3.5" />
                      Mindful Box Breathing
                    </span>
                    <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                      Need a 60-second mental reset?
                    </h4>
                    <p className="text-xs text-stone-600 dark:text-stone-400 max-w-xs">
                      Soften your shoulders and regulate your heart rate with gentle pacing.
                    </p>
                  </div>
                  <button
                    onClick={() => setBreathingOpen(true)}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shrink-0 shadow-xs transition-colors"
                  >
                    Begin Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Weekly Analytics Preview Teaser */}
            <div className="pt-4 border-t border-stone-200 dark:border-stone-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                    Weekly Sleep & Recovery Trends
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Consistency across sleep hours, vital energy, and hydration volumes.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
                >
                  <span>Full Analytics</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <WeeklyAnalytics weeklyHistory={data.weeklyHistory} />
            </div>
          </div>
        )}

        {/* VIEW 2: Habits & Routine Tracker */}
        {activeTab === 'habits' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <HabitTracker
              habits={data.habits}
              onToggleHabit={handleToggleHabit}
              onAddHabit={handleAddHabit}
              onDeleteHabit={handleDeleteHabit}
              onResetToday={handleResetHabitsToday}
              onCompleteAll={handleCompleteAllHabits}
            />
          </div>
        )}

        {/* VIEW 3: Workouts & Movement */}
        {activeTab === 'workouts' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <WorkoutLog
              workouts={data.workouts}
              weeklyHistory={data.weeklyHistory}
              onAddWorkout={handleAddWorkout}
              onDeleteWorkout={handleDeleteWorkout}
            />
          </div>
        )}

        {/* VIEW 4: Weekly Analytics */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <WeeklyAnalytics weeklyHistory={data.weeklyHistory} />
          </div>
        )}

        {/* VIEW 5: Notion Setup Guide */}
        {activeTab === 'notion' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <NotionGuide />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-stone-200 dark:border-stone-800 mt-16 py-6 text-center text-xs text-stone-500 dark:text-stone-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Aura Personal Wellness & Daily Balance Dashboard</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('notion')}
              className="hover:text-stone-800 dark:hover:text-stone-200 underline transition-colors"
            >
              Notion Guide & Database Schemas
            </button>
            <span>·</span>
            <button
              onClick={() => setBreathingOpen(true)}
              className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
              Mindful Breathing
            </button>
            <span>·</span>
            <button
              onClick={() => setProfileOpen(true)}
              className="hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
            >
              Goal Settings
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <MindfulBreathingModal
        isOpen={breathingOpen}
        onClose={() => setBreathingOpen(false)}
      />

      <ProfileModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        profile={data.profile}
        onSaveProfile={handleSaveProfile}
        onResetAllData={handleResetAllData}
      />
    </div>
  );
}
