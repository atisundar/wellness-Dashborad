import React, { useState } from 'react';
import { 
  Check, 
  Flame, 
  Plus, 
  Sparkles, 
  Brain, 
  Activity, 
  Moon, 
  Apple, 
  Clock, 
  Trash2,
  CheckCheck,
  RotateCcw
} from 'lucide-react';
import { Habit, HabitCategory, HabitTime } from '../types';

interface HabitTrackerProps {
  habits: Habit[];
  onToggleHabit: (id: string) => void;
  onAddHabit: (habit: Habit) => void;
  onDeleteHabit: (id: string) => void;
  onResetToday: () => void;
  onCompleteAll: () => void;
}

export const HabitTracker: React.FC<HabitTrackerProps> = ({
  habits,
  onToggleHabit,
  onAddHabit,
  onDeleteHabit,
  onResetToday,
  onCompleteAll,
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | HabitCategory>('all');
  const [filterTime, setFilterTime] = useState<'all' | HabitTime>('all');
  const [isAddingHabit, setIsAddingHabit] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState<HabitCategory>('mind');
  const [newHabitTime, setNewHabitTime] = useState<HabitTime>('morning');
  const [newHabitDays, setNewHabitDays] = useState(7);

  const completedCount = habits.filter((h) => h.completed).length;
  const totalCount = habits.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredHabits = habits.filter((h) => {
    const matchesCategory = filterCategory === 'all' || h.category === filterCategory;
    const matchesTime = filterTime === 'all' || h.timeOfDay === filterTime;
    return matchesCategory && matchesTime;
  });

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    const newHabit: Habit = {
      id: `habit-${Date.now()}`,
      name: newHabitName.trim(),
      category: newHabitCategory,
      timeOfDay: newHabitTime,
      completed: false,
      streak: 0,
      targetDaysPerWeek: newHabitDays,
    };

    onAddHabit(newHabit);
    setNewHabitName('');
    setIsAddingHabit(false);
  };

  const categoryMeta: Record<HabitCategory, { label: string; icon: React.ReactNode; color: string }> = {
    mind: { label: 'Mind', icon: <Brain className="w-3.5 h-3.5" />, color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50' },
    body: { label: 'Body', icon: <Activity className="w-3.5 h-3.5" />, color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50' },
    rest: { label: 'Rest', icon: <Moon className="w-3.5 h-3.5" />, color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50' },
    nutrition: { label: 'Nutrition', icon: <Apple className="w-3.5 h-3.5" />, color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50' },
  };

  return (
    <div className="bg-white dark:bg-stone-800/90 rounded-2xl p-6 border border-stone-200 dark:border-stone-700/80 shadow-xs transition-all">
      {/* Top Header & Completion Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-100 dark:border-stone-700/60">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              Daily Habits & Mindful Rituals
            </h2>
            <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
              · {completedCount} of {totalCount} completed
            </span>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Small daily actions compound into lasting physical and mental clarity.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={onCompleteAll}
            title="Complete all habits for today"
            className="px-2.5 py-1.5 text-xs font-medium text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/50 hover:bg-teal-100 dark:hover:bg-teal-900/60 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Complete All</span>
          </button>
          <button
            onClick={onResetToday}
            title="Reset habit checklist"
            className="p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsAddingHabit(true)}
            className="px-3 py-1.5 text-xs font-medium text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Habit</span>
          </button>
        </div>
      </div>

      {/* Completion Percentage Bar */}
      <div className="my-5 p-4 rounded-xl bg-stone-50 dark:bg-stone-900/50 border border-stone-200/60 dark:border-stone-700/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Today's Habit Alignment
          </span>
          <span className="text-xs font-bold text-teal-700 dark:text-teal-300 tabular-nums">
            {completionPercentage}% complete
          </span>
        </div>
        <div className="w-full h-3 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-teal-500 via-emerald-400 to-teal-400 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[11px] text-stone-500 dark:text-stone-400 mt-2">
          <span>
            {completionPercentage === 100 
              ? '✨ Extraordinary job! You completed all scheduled habits today.' 
              : `${totalCount - completedCount} habit${totalCount - completedCount === 1 ? '' : 's'} remaining today`}
          </span>
          <span className="font-mono tabular-nums">{completedCount}/{totalCount} Done</span>
        </div>
      </div>

      {/* Filter Segmented Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-900/60 rounded-xl">
          {(['all', 'mind', 'body', 'rest', 'nutrition'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors capitalize ${
                filterCategory === cat
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              {cat === 'all' ? 'All Rituals' : cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-900/60 rounded-xl">
          {(['all', 'morning', 'afternoon', 'evening'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterTime(t)}
              className={`px-2 py-1 text-xs font-medium rounded-lg transition-colors capitalize ${
                filterTime === t
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              {t === 'all' ? 'Any Time' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Habit List */}
      <div className="space-y-2.5">
        {filteredHabits.length === 0 ? (
          <div className="text-center py-10 px-4 text-stone-400 dark:text-stone-500 border border-dashed border-stone-200 dark:border-stone-700 rounded-xl">
            <p className="text-xs font-medium">No habits match this filter.</p>
            <button
              onClick={() => { setFilterCategory('all'); setFilterTime('all'); }}
              className="mt-2 text-xs text-teal-600 dark:text-teal-400 hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          filteredHabits.map((habit) => {
            const meta = categoryMeta[habit.category] || categoryMeta.mind;

            return (
              <div
                key={habit.id}
                onClick={() => onToggleHabit(habit.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                  habit.completed
                    ? 'bg-stone-50/70 dark:bg-stone-900/40 border-stone-200/80 dark:border-stone-800/80'
                    : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 hover:border-teal-300 dark:hover:border-teal-700 shadow-xs'
                }`}
              >
                {/* Left checkmark + Name */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all shrink-0 ${
                      habit.completed
                        ? 'bg-teal-600 text-white dark:bg-teal-500'
                        : 'border border-stone-300 dark:border-stone-600 group-hover:border-teal-500'
                    }`}
                  >
                    {habit.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  <div className="min-w-0">
                    <p
                      className={`text-xs sm:text-sm font-medium transition-colors truncate ${
                        habit.completed
                          ? 'line-through text-stone-400 dark:text-stone-500'
                          : 'text-stone-800 dark:text-stone-100'
                      }`}
                    >
                      {habit.name}
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-stone-400 dark:text-stone-500 mt-0.5">
                      <span className="capitalize">{habit.timeOfDay}</span>
                      <span>·</span>
                      <span className="capitalize">{habit.category}</span>
                      <span>·</span>
                      <span>{habit.targetDaysPerWeek}d / week target</span>
                    </div>
                  </div>
                </div>

                {/* Right Streak & Category indicator */}
                <div className="flex items-center gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-200/50 dark:border-amber-900/40">
                    <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span className="tabular-nums">{habit.streak}d streak</span>
                  </div>

                  <span className={`p-1.5 rounded-lg text-xs hidden sm:flex items-center ${meta.color}`}>
                    {meta.icon}
                  </span>

                  <button
                    onClick={() => onDeleteHabit(habit.id)}
                    title="Delete habit"
                    className="opacity-0 group-hover:opacity-100 p-1 text-stone-400 hover:text-rose-500 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Habit Modal / Drawer */}
      {isAddingHabit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
          <div className="bg-white dark:bg-stone-800 rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200 dark:border-stone-700 animate-in fade-in duration-150">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 mb-1">
              Add New Wellness Habit
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
              Design a clear, achievable ritual that supports your daily well-being.
            </p>

            <form onSubmit={handleCreateHabit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Habit Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. 15-Minute Sunlight Walk"
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  autoFocus
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Category
                  </label>
                  <select
                    value={newHabitCategory}
                    onChange={(e) => setNewHabitCategory(e.target.value as HabitCategory)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-teal-500 capitalize"
                  >
                    <option value="mind">Mind (Meditation, Reading)</option>
                    <option value="body">Body (Movement, Stretch)</option>
                    <option value="rest">Rest (Sleep, Screen break)</option>
                    <option value="nutrition">Nutrition (Hydration, Fuel)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Time of Day
                  </label>
                  <select
                    value={newHabitTime}
                    onChange={(e) => setNewHabitTime(e.target.value as HabitTime)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-teal-500 capitalize"
                  >
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="evening">Evening</option>
                    <option value="anytime">Anytime</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Target Frequency ({newHabitDays} days/week)
                </label>
                <input
                  type="range"
                  min="1"
                  max="7"
                  value={newHabitDays}
                  onChange={(e) => setNewHabitDays(parseInt(e.target.value, 10))}
                  className="w-full accent-teal-600 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100 dark:border-stone-700">
                <button
                  type="button"
                  onClick={() => setIsAddingHabit(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newHabitName.trim()}
                  className="px-4 py-2 text-xs font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors disabled:opacity-50"
                >
                  Save Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
