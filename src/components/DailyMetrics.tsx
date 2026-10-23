import React, { useState } from 'react';
import { 
  Droplet, 
  Moon, 
  Smile, 
  Footprints, 
  Plus, 
  Minus, 
  RotateCcw, 
  Sparkles, 
  Bed, 
  Sun,
  Flame,
  Check,
  ChevronRight,
  TrendingUp,
  Clock
} from 'lucide-react';
import { WaterState, SleepState, MoodState, StepsState, MoodType } from '../types';
import { MOOD_DEFINITIONS } from '../utils/initialData';

interface DailyMetricsProps {
  water: WaterState;
  onUpdateWater: (newWater: WaterState) => void;
  sleep: SleepState;
  onUpdateSleep: (newSleep: SleepState) => void;
  mood: MoodState;
  onUpdateMood: (newMood: MoodState) => void;
  steps: StepsState;
  onUpdateSteps: (newSteps: StepsState) => void;
  waterGoalMl: number;
  sleepGoalHours: number;
  stepGoal: number;
}

export const DailyMetrics: React.FC<DailyMetricsProps> = ({
  water,
  onUpdateWater,
  sleep,
  onUpdateSleep,
  mood,
  onUpdateMood,
  steps,
  onUpdateSteps,
  waterGoalMl,
  sleepGoalHours,
  stepGoal,
}) => {
  const [customStepInput, setCustomStepInput] = useState('');
  const [showStepModal, setShowStepModal] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);

  // --- Water Handlers ---
  const handleAddWater = (amount: number) => {
    const nextCurrent = Math.max(0, water.currentMl + amount);
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newHistory = amount > 0 
      ? [{ id: Date.now().toString(), time: timeStr, amount }, ...water.history.slice(0, 9)]
      : water.history;

    onUpdateWater({
      ...water,
      currentMl: nextCurrent,
      history: newHistory,
    });
  };

  const handleResetWater = () => {
    onUpdateWater({
      ...water,
      currentMl: 0,
      history: [],
    });
  };

  const waterPercent = Math.min(100, Math.round((water.currentMl / waterGoalMl) * 100));
  const waterRemaining = Math.max(0, waterGoalMl - water.currentMl);
  const glassesDrunk = Math.floor(water.currentMl / 250);
  const totalGlasses = Math.ceil(waterGoalMl / 250);

  // --- Sleep Handlers ---
  const handleAdjustSleepHours = (delta: number) => {
    const nextHours = Math.max(0, Math.min(16, Math.round((sleep.hours + delta) * 10) / 10));
    onUpdateSleep({
      ...sleep,
      hours: nextHours,
    });
  };

  const handleSetSleepQuality = (q: 1 | 2 | 3 | 4 | 5) => {
    onUpdateSleep({
      ...sleep,
      quality: q,
    });
  };

  const sleepPercent = Math.min(100, Math.round((sleep.hours / sleepGoalHours) * 100));

  const sleepQualityDescriptors: Record<number, { label: string; desc: string }> = {
    1: { label: 'Restless', desc: 'Frequent waking, tired in morning' },
    2: { label: 'Fair', desc: 'Light sleep, some fatigue' },
    3: { label: 'Good', desc: 'Normal restorative rest' },
    4: { label: 'Deep', desc: 'Peaceful and uninterrupted' },
    5: { label: 'Rejuvenating', desc: 'Woke fully energized & radiant' },
  };

  // --- Mood Handlers ---
  const handleSelectMood = (moodKey: MoodType) => {
    onUpdateMood({
      ...mood,
      selectedMood: moodKey,
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  };

  const handleSetEnergy = (val: number) => {
    onUpdateMood({
      ...mood,
      energyLevel: val,
    });
  };

  const handleToggleTag = (tag: string) => {
    const exists = mood.tags.includes(tag);
    const updatedTags = exists 
      ? mood.tags.filter(t => t !== tag) 
      : [...mood.tags, tag];
    onUpdateMood({
      ...mood,
      tags: updatedTags,
    });
  };

  const handleGratitudeChange = (note: string) => {
    onUpdateMood({
      ...mood,
      gratitudeNote: note,
    });
  };

  const availableTags = ['Grateful', 'Centered', 'Clear Mind', 'Calm', 'Productive', 'Creative', 'Reflective', 'Tired', 'Sensitive'];

  // --- Steps Handlers ---
  const handleAddSteps = (amount: number) => {
    onUpdateSteps({
      ...steps,
      current: Math.max(0, steps.current + amount),
    });
  };

  const handleCustomStepSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(customStepInput, 10);
    if (!isNaN(val) && val > 0) {
      handleAddSteps(val);
      setCustomStepInput('');
      setShowStepModal(false);
    }
  };

  const stepPercent = Math.min(100, Math.round((steps.current / stepGoal) * 100));
  const distanceKm = (steps.current * 0.00076).toFixed(1);
  const caloriesBurned = Math.round(steps.current * 0.04);
  const activeWalkMinutes = Math.round(steps.current / 115);

  const currentMoodMeta = MOOD_DEFINITIONS[mood.selectedMood] || MOOD_DEFINITIONS.serene;

  return (
    <div className="space-y-6">
      {/* 4 Quick Log Cards in Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* CARD 1: Water Intake Tracker */}
        <div className="bg-white dark:bg-stone-800/90 rounded-2xl p-5 border border-stone-200 dark:border-stone-700/80 shadow-xs flex flex-col justify-between transition-all hover:border-teal-300 dark:hover:border-teal-700">
          <div>
            {/* Card Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                  <Droplet className="w-4 h-4 fill-teal-500/20" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                    Hydration Log
                  </h3>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400">
                    Goal: {waterGoalMl} ml ({totalGlasses} cups)
                  </span>
                </div>
              </div>
              <button
                onClick={handleResetWater}
                title="Reset today's water"
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 p-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Metric Display & Fill Visual */}
            <div className="my-3">
              <div className="flex items-baseline justify-between mb-1.5">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50 tabular-nums">
                    {water.currentMl.toLocaleString()}
                  </span>
                  <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
                    / {waterGoalMl.toLocaleString()} ml
                  </span>
                </div>
                <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 tabular-nums">
                  {waterPercent}%
                </span>
              </div>

              {/* Smooth Liquid Fill Bar */}
              <div className="w-full h-3 bg-stone-100 dark:bg-stone-700 rounded-full overflow-hidden p-0.5 relative">
                <div 
                  className="h-full bg-gradient-to-r from-teal-400 to-teal-500 dark:from-teal-500 dark:to-teal-400 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${waterPercent}%` }}
                />
              </div>

              {/* Status Note */}
              <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 mt-2">
                <span>{glassesDrunk} of {totalGlasses} glasses</span>
                <span>{waterRemaining > 0 ? `${waterRemaining} ml to go` : 'Goal reached! 🎉'}</span>
              </div>
            </div>
          </div>

          {/* Quick Increment / Decrement Action Buttons */}
          <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-700/60">
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => handleAddWater(250)}
                className="py-1.5 px-2 bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/50 dark:hover:bg-teal-900/60 text-teal-800 dark:text-teal-200 text-xs font-medium rounded-lg transition-colors text-center"
              >
                +250ml
              </button>
              <button
                onClick={() => handleAddWater(500)}
                className="py-1.5 px-2 bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/50 dark:hover:bg-teal-900/60 text-teal-800 dark:text-teal-200 text-xs font-medium rounded-lg transition-colors text-center"
              >
                +500ml
              </button>
              <button
                onClick={() => handleAddWater(-250)}
                disabled={water.currentMl <= 0}
                className="py-1.5 px-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-700 dark:hover:bg-stone-600 text-stone-600 dark:text-stone-300 text-xs font-medium rounded-lg transition-colors text-center disabled:opacity-40"
              >
                -250ml
              </button>
            </div>
          </div>
        </div>

        {/* CARD 2: Sleep Tracker */}
        <div className="bg-white dark:bg-stone-800/90 rounded-2xl p-5 border border-stone-200 dark:border-stone-700/80 shadow-xs flex flex-col justify-between transition-all hover:border-indigo-300 dark:hover:border-indigo-700">
          <div>
            {/* Card Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Moon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                    Sleep & Recovery
                  </h3>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400">
                    Target: {sleepGoalHours.toFixed(1)} hrs nightly
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md">
                {sleepQualityDescriptors[sleep.quality]?.label || 'Good'}
              </span>
            </div>

            {/* Stepper Display */}
            <div className="my-3">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50 tabular-nums">
                    {sleep.hours.toFixed(1)}
                  </span>
                  <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
                    hours slept
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleAdjustSleepHours(-0.5)}
                    className="w-6 h-6 rounded-md bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 dark:hover:bg-stone-600 text-stone-700 dark:text-stone-300 flex items-center justify-center text-xs"
                    title="Decrease 30m"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleAdjustSleepHours(0.5)}
                    className="w-6 h-6 rounded-md bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 dark:hover:bg-stone-600 text-stone-700 dark:text-stone-300 flex items-center justify-center text-xs"
                    title="Increase 30m"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Progress to target */}
              <div className="w-full h-3 bg-stone-100 dark:bg-stone-700 rounded-full overflow-hidden p-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-400 to-indigo-500 dark:from-indigo-500 dark:to-indigo-400 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${sleepPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 mt-2">
                <span>{sleep.bedtime} → {sleep.wakeTime}</span>
                <span className="tabular-nums">{sleepPercent}% of goal</span>
              </div>
            </div>
          </div>

          {/* Sleep Quality Rating 1-5 */}
          <div className="space-y-1.5 pt-2 border-t border-stone-100 dark:border-stone-700/60">
            <span className="text-[11px] text-stone-500 dark:text-stone-400 block font-medium">
              Sleep Quality Rating
            </span>
            <div className="grid grid-cols-5 gap-1">
              {([1, 2, 3, 4, 5] as const).map((q) => (
                <button
                  key={q}
                  onClick={() => handleSetSleepQuality(q)}
                  className={`py-1 rounded-md text-xs font-medium transition-all ${
                    sleep.quality === q
                      ? 'bg-indigo-600 text-white shadow-xs font-bold'
                      : 'bg-stone-100 dark:bg-stone-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-stone-700 dark:text-stone-300'
                  }`}
                  title={sleepQualityDescriptors[q].desc}
                >
                  {q}★
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CARD 3: Mood & Mindset Selector */}
        <div className="bg-white dark:bg-stone-800/90 rounded-2xl p-5 border border-stone-200 dark:border-stone-700/80 shadow-xs flex flex-col justify-between transition-all hover:border-amber-300 dark:hover:border-amber-700">
          <div>
            {/* Card Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Smile className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                    Mind & Mood
                  </h3>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400">
                    Logged at {mood.updatedAt}
                  </span>
                </div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-md font-medium border ${currentMoodMeta.bgClass}`}>
                {currentMoodMeta.emoji} {currentMoodMeta.label}
              </span>
            </div>

            {/* Clickable Mood Emojis */}
            <div className="my-2">
              <div className="flex items-center justify-between gap-1 p-1 bg-stone-50 dark:bg-stone-900/60 rounded-xl border border-stone-100 dark:border-stone-700/60">
                {(
                  [
                    { id: 'serene', emoji: '🌿', title: 'Serene' },
                    { id: 'happy', emoji: '☀️', title: 'Joyful' },
                    { id: 'calm', emoji: '🌊', title: 'Calm' },
                    { id: 'energetic', emoji: '⚡', title: 'Vibrant' },
                    { id: 'reflective', emoji: '🌙', title: 'Reflective' },
                    { id: 'anxious', emoji: '🌧️', title: 'Sensitive' },
                    { id: 'tired', emoji: '💤', title: 'Resting' },
                  ] as const
                ).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleSelectMood(m.id)}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-sm sm:text-base flex items-center justify-center transition-all ${
                      mood.selectedMood === m.id
                        ? 'bg-white dark:bg-stone-700 shadow-xs scale-110'
                        : 'opacity-70 hover:opacity-100 hover:bg-stone-200/50 dark:hover:bg-stone-800'
                    }`}
                    title={m.title}
                  >
                    {m.emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Energy Level Selector */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 mb-1">
                <span>Vital Energy</span>
                <span className="font-semibold text-stone-800 dark:text-stone-200">Level {mood.energyLevel}/5</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => handleSetEnergy(lvl)}
                    className={`h-2 rounded-full transition-all ${
                      lvl <= mood.energyLevel
                        ? 'bg-amber-500 dark:bg-amber-400'
                        : 'bg-stone-200 dark:bg-stone-700'
                    }`}
                    title={`Energy level ${lvl}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Quick Reflection Note Preview */}
          <div className="pt-2 border-t border-stone-100 dark:border-stone-700/60">
            <button
              onClick={() => setEditingNotes(!editingNotes)}
              className="w-full text-left text-[11px] text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 flex items-center justify-between"
            >
              <span className="truncate italic">
                {mood.gratitudeNote ? `“${mood.gratitudeNote.slice(0, 32)}...”` : 'Write gratitude note...'}
              </span>
              <span className="text-teal-600 dark:text-teal-400 text-[10px] shrink-0 font-medium ml-1">
                {editingNotes ? 'Close' : 'Edit'}
              </span>
            </button>
            {editingNotes && (
              <div className="mt-2 space-y-2">
                <textarea
                  value={mood.gratitudeNote}
                  onChange={(e) => handleGratitudeChange(e.target.value)}
                  placeholder="What is one small thing you are genuinely thankful for right now?"
                  rows={2}
                  className="w-full p-2 text-xs bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-800 dark:text-stone-200 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
                <div className="flex flex-wrap gap-1">
                  {availableTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleToggleTag(tag)}
                      className={`text-[10px] px-1.5 py-0.5 rounded transition-colors ${
                        mood.tags.includes(tag)
                          ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 font-medium'
                          : 'bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CARD 4: Daily Step Counter */}
        <div className="bg-white dark:bg-stone-800/90 rounded-2xl p-5 border border-stone-200 dark:border-stone-700/80 shadow-xs flex flex-col justify-between transition-all hover:border-emerald-300 dark:hover:border-emerald-700">
          <div>
            {/* Card Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Footprints className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                    Step Counter
                  </h3>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400">
                    Goal: {stepGoal.toLocaleString()} steps
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowStepModal(!showStepModal)}
                title="Add custom steps"
                className="text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 p-1 rounded-lg"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Stepper Display */}
            <div className="my-3">
              <div className="flex items-baseline justify-between mb-1.5">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50 tabular-nums">
                    {steps.current.toLocaleString()}
                  </span>
                  <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
                    steps
                  </span>
                </div>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {stepPercent}%
                </span>
              </div>

              {/* Step Progress Bar */}
              <div className="w-full h-3 bg-stone-100 dark:bg-stone-700 rounded-full overflow-hidden p-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 dark:from-emerald-500 dark:to-teal-400 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${stepPercent}%` }}
                />
              </div>

              {/* Estimates strip */}
              <div className="grid grid-cols-3 gap-1 text-[11px] text-stone-500 dark:text-stone-400 mt-2 text-center pt-1 border-t border-stone-100 dark:border-stone-700/60">
                <div>
                  <span className="block font-semibold text-stone-700 dark:text-stone-200 tabular-nums">{distanceKm} km</span>
                  <span className="text-[10px]">Distance</span>
                </div>
                <div>
                  <span className="block font-semibold text-stone-700 dark:text-stone-200 tabular-nums">{caloriesBurned}</span>
                  <span className="text-[10px]">Active kcal</span>
                </div>
                <div>
                  <span className="block font-semibold text-stone-700 dark:text-stone-200 tabular-nums">{activeWalkMinutes} m</span>
                  <span className="text-[10px]">Walk time</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Step Boost Buttons */}
          <div className="pt-2 border-t border-stone-100 dark:border-stone-700/60">
            {showStepModal ? (
              <form onSubmit={handleCustomStepSubmit} className="flex gap-1.5">
                <input
                  type="number"
                  placeholder="e.g. 1500"
                  value={customStepInput}
                  onChange={(e) => setCustomStepInput(e.target.value)}
                  className="w-full px-2 py-1 text-xs bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium"
                >
                  Add
                </button>
              </form>
            ) : (
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => handleAddSteps(500)}
                  className="py-1 px-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-xs font-medium rounded-lg transition-colors text-center"
                >
                  +500
                </button>
                <button
                  onClick={() => handleAddSteps(1000)}
                  className="py-1 px-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-xs font-medium rounded-lg transition-colors text-center"
                >
                  +1k
                </button>
                <button
                  onClick={() => handleAddSteps(2500)}
                  className="py-1 px-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-xs font-medium rounded-lg transition-colors text-center"
                >
                  +2.5k
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
