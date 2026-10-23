import React, { useState } from 'react';
import { 
  Dumbbell, 
  Flame, 
  Clock, 
  Plus, 
  Trash2, 
  Calendar, 
  Activity, 
  Sparkles, 
  CheckCircle2, 
  Timer,
  Zap,
  HeartPulse
} from 'lucide-react';
import { Workout, DayMetric } from '../types';

interface WorkoutLogProps {
  workouts: Workout[];
  weeklyHistory: DayMetric[];
  onAddWorkout: (workout: Workout) => void;
  onDeleteWorkout: (id: string) => void;
}

export const WorkoutLog: React.FC<WorkoutLogProps> = ({
  workouts,
  weeklyHistory,
  onAddWorkout,
  onDeleteWorkout,
}) => {
  const [workoutType, setWorkoutType] = useState('Vinyasa Flow & Stretch');
  const [durationMin, setDurationMin] = useState(30);
  const [intensity, setIntensity] = useState<'low' | 'moderate' | 'high' | 'peak'>('moderate');
  const [notes, setNotes] = useState('');
  const [showLogForm, setShowLogForm] = useState(false);

  // Intensity multipliers for calories estimate
  const intensityMultipliers = {
    low: 4.5,
    moderate: 7.0,
    high: 10.0,
    peak: 12.5,
  };

  const calculatedCalories = Math.round(durationMin * intensityMultipliers[intensity]);

  const workoutPresets = [
    'Vinyasa Flow & Stretch',
    'Outdoor Run',
    'Strength & Conditioning',
    'Pilates Mat',
    'HIIT Cardio',
    'Mindful Trail Walk',
    'Cycling',
    'Swimming',
  ];

  const handleSubmitWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    const newWorkout: Workout = {
      id: `workout-${Date.now()}`,
      type: workoutType,
      durationMin: Number(durationMin),
      intensity,
      calories: calculatedCalories,
      timestamp: 'Today, ' + new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      notes: notes.trim() || undefined,
    };

    onAddWorkout(newWorkout);
    setNotes('');
    setShowLogForm(false);
  };

  // Weekly Stats calculation
  const totalWeeklyMinutes = weeklyHistory.reduce((acc, d) => acc + (d.workoutMinutes || 0), 0);
  const totalWeeklyWorkouts = weeklyHistory.filter(d => d.workoutDone).length;
  const activeStreak = weeklyHistory.filter(d => d.workoutDone).length;

  const intensityMeta = {
    low: { label: 'Gentle', color: 'text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/50' },
    moderate: { label: 'Moderate', color: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50' },
    high: { label: 'High', color: 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50' },
    peak: { label: 'Peak', color: 'text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50' },
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Weekly Streak Strip */}
      <div className="bg-white dark:bg-stone-800/90 rounded-2xl p-6 border border-stone-200 dark:border-stone-700/80 shadow-xs transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-100 dark:border-stone-700/60">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                Movement & Workout Log
              </h2>
              <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                · {totalWeeklyMinutes} mins active this week
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Consistent, joyful movement strengthens the heart and eases mental load.
            </p>
          </div>

          <button
            onClick={() => setShowLogForm(!showLogForm)}
            className="px-3.5 py-1.5 text-xs font-medium text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 rounded-xl transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{showLogForm ? 'Close Logger' : 'Log Workout'}</span>
          </button>
        </div>

        {/* Visual Weekly Streak Tracker (7-day calendar strip) */}
        <div className="my-5">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              Weekly Movement Streak: <span className="text-teal-700 dark:text-teal-300">{activeStreak} of 7 Days Active</span>
            </span>
            <span className="text-stone-500 dark:text-stone-400">
              {totalWeeklyWorkouts} sessions logged
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {weeklyHistory.map((day) => (
              <div
                key={day.dateStr}
                className={`p-2.5 rounded-xl border text-center transition-all flex flex-col justify-between items-center ${
                  day.isToday
                    ? 'ring-2 ring-teal-500 dark:ring-teal-400 border-teal-300'
                    : ''
                } ${
                  day.workoutDone
                    ? 'bg-teal-50/60 dark:bg-teal-950/30 border-teal-200 dark:border-teal-800'
                    : 'bg-stone-50 dark:bg-stone-900/50 border-stone-200/70 dark:border-stone-800 text-stone-400'
                }`}
              >
                <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 uppercase">
                  {day.dayName}
                </span>

                <div className="my-2">
                  {day.workoutDone ? (
                    <div className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center mx-auto shadow-xs">
                      <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center mx-auto text-[10px] text-stone-500 font-medium">
                      Rest
                    </div>
                  )}
                </div>

                <div className="text-[10px] text-stone-600 dark:text-stone-300 truncate max-w-full">
                  {day.workoutDone ? (
                    <span className="font-medium tabular-nums">{day.workoutMinutes}m</span>
                  ) : (
                    <span className="text-stone-400 dark:text-stone-500">—</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Workout Logger Drawer / Form */}
        {showLogForm && (
          <div className="mt-5 p-5 bg-stone-50 dark:bg-stone-900/60 rounded-xl border border-stone-200 dark:border-stone-700">
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-3 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-teal-600" />
              Log New Workout Session
            </h3>

            <form onSubmit={handleSubmitWorkout} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Workout Type */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Activity Type
                  </label>
                  <select
                    value={workoutType}
                    onChange={(e) => setWorkoutType(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100"
                  >
                    {workoutPresets.map((wp) => (
                      <option key={wp} value={wp}>{wp}</option>
                    ))}
                  </select>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Duration ({durationMin} minutes)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="10"
                      max="120"
                      step="5"
                      value={durationMin}
                      onChange={(e) => setDurationMin(parseInt(e.target.value, 10))}
                      className="w-full accent-teal-600 cursor-pointer"
                    />
                    <span className="text-xs font-mono tabular-nums text-stone-700 dark:text-stone-300 w-12 text-right">
                      {durationMin}m
                    </span>
                  </div>
                </div>
              </div>

              {/* Intensity Selector */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                  Intensity Level
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['low', 'moderate', 'high', 'peak'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setIntensity(lvl)}
                      className={`py-2 px-2 rounded-xl text-xs font-medium border text-center transition-all capitalize ${
                        intensity === lvl
                          ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                          : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Calories calculated badge & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Notes / How did you feel?
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Great morning energy, paced smoothly"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100"
                  />
                </div>

                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40 flex items-center justify-between text-xs">
                  <span className="text-amber-800 dark:text-amber-300 font-medium">Estimated Burn:</span>
                  <span className="font-bold font-mono text-amber-900 dark:text-amber-100 tabular-nums">
                    ~{calculatedCalories} kcal
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogForm(false)}
                  className="px-3 py-1.5 text-xs text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs"
                >
                  Save Workout Entry
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Recent Workouts Log Table */}
      <div className="bg-white dark:bg-stone-800/90 rounded-2xl p-6 border border-stone-200 dark:border-stone-700/80 shadow-xs">
        <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-4 flex items-center justify-between">
          <span>Recent Activity History</span>
          <span className="text-xs font-normal text-stone-400">{workouts.length} recorded</span>
        </h3>

        <div className="space-y-2.5">
          {workouts.map((w) => {
            const intBadge = intensityMeta[w.intensity] || intensityMeta.moderate;

            return (
              <div
                key={w.id}
                className="p-3.5 rounded-xl border border-stone-100 dark:border-stone-700/60 bg-stone-50/50 dark:bg-stone-900/30 flex items-center justify-between gap-3 group hover:border-stone-300 dark:hover:border-stone-600 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                    <Dumbbell className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-semibold text-stone-800 dark:text-stone-100 truncate">
                        {w.type}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${intBadge.color}`}>
                        {intBadge.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                      <span className="tabular-nums flex items-center gap-1">
                        <Clock className="w-3 h-3 text-stone-400" />
                        {w.durationMin} mins
                      </span>
                      <span>·</span>
                      <span className="tabular-nums flex items-center gap-1">
                        <Flame className="w-3 h-3 text-amber-500" />
                        {w.calories} kcal
                      </span>
                      <span>·</span>
                      <span>{w.timestamp}</span>
                    </div>

                    {w.notes && (
                      <p className="text-[11px] italic text-stone-500 dark:text-stone-400 mt-1 truncate">
                        "{w.notes}"
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => onDeleteWorkout(w.id)}
                  title="Delete workout entry"
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-stone-400 hover:text-rose-500 transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
