import React, { useState } from 'react';
import { 
  Moon, 
  Smile, 
  Droplet, 
  CheckCircle2, 
  TrendingUp, 
  Flame, 
  Info,
  Calendar,
  Sparkles,
  Award
} from 'lucide-react';
import { DayMetric } from '../types';
import { MOOD_DEFINITIONS } from '../utils/initialData';

interface WeeklyAnalyticsProps {
  weeklyHistory: DayMetric[];
}

export const WeeklyAnalytics: React.FC<WeeklyAnalyticsProps> = ({ weeklyHistory }) => {
  const [activeChartTab, setActiveChartTab] = useState<'sleep' | 'mood' | 'hydration'>('sleep');
  const [hoveredDay, setHoveredDay] = useState<DayMetric | null>(null);

  // Aggregated Weekly Calculations
  const totalSleepHours = weeklyHistory.reduce((sum, d) => sum + d.sleepHours, 0);
  const avgSleepHours = (totalSleepHours / weeklyHistory.length).toFixed(1);

  const totalWater = weeklyHistory.reduce((sum, d) => sum + d.waterMl, 0);
  const avgWater = Math.round(totalWater / weeklyHistory.length);

  const totalSteps = weeklyHistory.reduce((sum, d) => sum + d.steps, 0);
  const avgSteps = Math.round(totalSteps / weeklyHistory.length);

  const totalHabitsPossible = weeklyHistory.reduce((sum, d) => sum + d.habitsTotal, 0);
  const totalHabitsDone = weeklyHistory.reduce((sum, d) => sum + d.habitsCompleted, 0);
  const habitConsistency = Math.round((totalHabitsDone / totalHabitsPossible) * 100);

  // Maximum scale values for charts
  const maxSleepHours = 10;
  const maxWaterMl = 3200;

  return (
    <div className="space-y-6">
      {/* 4 Quick Analytics Summary Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white dark:bg-stone-800/90 rounded-2xl p-4 border border-stone-200 dark:border-stone-700/80 shadow-xs">
          <div className="flex items-center gap-2 mb-2 text-indigo-600 dark:text-indigo-400">
            <Moon className="w-4 h-4" />
            <span className="text-xs font-semibold text-stone-600 dark:text-stone-300">Avg Sleep</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-stone-900 dark:text-stone-50 tabular-nums font-mono">
              {avgSleepHours}
            </span>
            <span className="text-xs text-stone-400">hrs / night</span>
          </div>
          <span className="text-[11px] text-teal-600 dark:text-teal-400 font-medium flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3 inline" /> 94% of 8.0h goal
          </span>
        </div>

        {/* Metric 2 */}
        <div className="bg-white dark:bg-stone-800/90 rounded-2xl p-4 border border-stone-200 dark:border-stone-700/80 shadow-xs">
          <div className="flex items-center gap-2 mb-2 text-teal-600 dark:text-teal-400">
            <Droplet className="w-4 h-4" />
            <span className="text-xs font-semibold text-stone-600 dark:text-stone-300">Daily Hydration</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-stone-900 dark:text-stone-50 tabular-nums font-mono">
              {avgWater.toLocaleString()}
            </span>
            <span className="text-xs text-stone-400">ml / day</span>
          </div>
          <span className="text-[11px] text-teal-600 dark:text-teal-400 font-medium flex items-center gap-1 mt-1">
            <CheckCircle2 className="w-3 h-3 inline" /> 93% target reached
          </span>
        </div>

        {/* Metric 3 */}
        <div className="bg-white dark:bg-stone-800/90 rounded-2xl p-4 border border-stone-200 dark:border-stone-700/80 shadow-xs">
          <div className="flex items-center gap-2 mb-2 text-emerald-600 dark:text-emerald-400">
            <Flame className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-semibold text-stone-600 dark:text-stone-300">Daily Steps</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-stone-900 dark:text-stone-50 tabular-nums font-mono">
              {avgSteps.toLocaleString()}
            </span>
            <span className="text-xs text-stone-400">avg steps</span>
          </div>
          <span className="text-[11px] text-stone-500 dark:text-stone-400 font-medium block mt-1">
            ~7.4 km daily movement
          </span>
        </div>

        {/* Metric 4 */}
        <div className="bg-white dark:bg-stone-800/90 rounded-2xl p-4 border border-stone-200 dark:border-stone-700/80 shadow-xs">
          <div className="flex items-center gap-2 mb-2 text-amber-600 dark:text-amber-400">
            <Award className="w-4 h-4" />
            <span className="text-xs font-semibold text-stone-600 dark:text-stone-300">Habit Adherence</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-stone-900 dark:text-stone-50 tabular-nums font-mono">
              {habitConsistency}%
            </span>
            <span className="text-xs text-stone-400">completion</span>
          </div>
          <span className="text-[11px] text-teal-600 dark:text-teal-400 font-medium flex items-center gap-1 mt-1">
            <Sparkles className="w-3 h-3 inline text-amber-500" /> Excellent weekly rhythm
          </span>
        </div>
      </div>

      {/* Main Interactive Chart Card */}
      <div className="bg-white dark:bg-stone-800/90 rounded-2xl p-6 border border-stone-200 dark:border-stone-700/80 shadow-xs transition-all">
        {/* Chart Header & Tab Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-100 dark:border-stone-700/60">
          <div>
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              7-Day Balance & Recovery Analytics
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Hover over any day column to inspect sleep duration, mood state, and hydration details.
            </p>
          </div>

          {/* Interactive Chart Tabs */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-900/60 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setActiveChartTab('sleep')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeChartTab === 'sleep'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              Sleep & Quality
            </button>
            <button
              onClick={() => setActiveChartTab('mood')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeChartTab === 'mood'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              Mood & Energy
            </button>
            <button
              onClick={() => setActiveChartTab('hydration')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeChartTab === 'hydration'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              Hydration & Habits
            </button>
          </div>
        </div>

        {/* Active Tooltip Bar */}
        <div className="h-10 flex items-center justify-between my-3 px-3 py-2 bg-stone-50 dark:bg-stone-900/50 rounded-xl text-xs">
          {hoveredDay ? (
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-bold text-stone-800 dark:text-stone-100">
                {hoveredDay.dayName} ({hoveredDay.dateStr})
              </span>
              <span>·</span>
              <span>Sleep: <strong className="text-indigo-600 dark:text-indigo-400">{hoveredDay.sleepHours} hrs</strong> (Q: {hoveredDay.sleepQuality}/5★)</span>
              <span>·</span>
              <span>Mood: <strong className="capitalize">{hoveredDay.mood}</strong></span>
              <span>·</span>
              <span>Water: <strong className="text-teal-600 dark:text-teal-400">{hoveredDay.waterMl} ml</strong></span>
              <span>·</span>
              <span>Habits: <strong>{hoveredDay.habitsCompleted}/{hoveredDay.habitsTotal}</strong></span>
            </div>
          ) : (
            <div className="text-stone-400 dark:text-stone-500 italic flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              <span>Hover or tap on any day bar to view detailed breakdown</span>
            </div>
          )}
        </div>

        {/* TAB 1: Sleep & Quality Chart */}
        {activeChartTab === 'sleep' && (
          <div className="space-y-4">
            <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 pt-8 pb-4 relative border-b border-stone-200 dark:border-stone-700">
              {/* Target 8h guideline line */}
              <div 
                className="absolute left-0 right-0 border-b border-dashed border-indigo-400/60 dark:border-indigo-500/50 z-0 flex items-center justify-between text-[10px] text-indigo-600 dark:text-indigo-400 px-2"
                style={{ bottom: `${(8.0 / maxSleepHours) * 100}%` }}
              >
                <span>8.0h Target</span>
                <span className="font-mono">Ideal Rest</span>
              </div>

              {weeklyHistory.map((day) => {
                const heightPercent = (day.sleepHours / maxSleepHours) * 100;
                const isHovered = hoveredDay?.dateStr === day.dateStr;

                return (
                  <div
                    key={day.dateStr}
                    onMouseEnter={() => setHoveredDay(day)}
                    onMouseLeave={() => setHoveredDay(null)}
                    onClick={() => setHoveredDay(day)}
                    className="flex-1 flex flex-col items-center h-full justify-end cursor-pointer group relative z-10"
                  >
                    {/* Sleep hours floating pill */}
                    <span className="text-[11px] font-mono tabular-nums text-stone-600 dark:text-stone-300 font-semibold mb-1 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">
                      {day.sleepHours}h
                    </span>

                    {/* Bar */}
                    <div className="w-full max-w-[42px] bg-stone-100 dark:bg-stone-700/60 rounded-t-xl overflow-hidden flex flex-col justify-end p-0.5 h-full">
                      <div
                        className={`w-full rounded-t-lg transition-all duration-300 ${
                          isHovered
                            ? 'bg-indigo-500 shadow-md'
                            : day.sleepHours >= 8
                            ? 'bg-indigo-400/80 dark:bg-indigo-500/80'
                            : 'bg-indigo-300 dark:bg-indigo-600/70'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>

                    {/* Sleep quality stars */}
                    <div className="text-[10px] text-amber-500 font-mono mt-1.5 flex items-center">
                      {'★'.repeat(day.sleepQuality)}
                    </div>

                    {/* Day label */}
                    <span className={`text-xs font-semibold mt-1 transition-colors ${
                      day.isToday ? 'text-teal-600 dark:text-teal-400' : 'text-stone-600 dark:text-stone-400'
                    }`}>
                      {day.dayName}
                      {day.isToday && <span className="block text-[9px] text-teal-600 font-normal">Today</span>}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span>Nightly rest patterns (Mon - Sun)</span>
              <span className="font-medium text-indigo-600 dark:text-indigo-400">Sleep Goal: 8.0 hrs nightly</span>
            </div>
          </div>
        )}

        {/* TAB 2: Mood & Energy Chart */}
        {activeChartTab === 'mood' && (
          <div className="space-y-4">
            <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 pt-8 pb-4 border-b border-stone-200 dark:border-stone-700">
              {weeklyHistory.map((day) => {
                const energyPercent = (day.energy / 5) * 100;
                const moodMeta = MOOD_DEFINITIONS[day.mood] || MOOD_DEFINITIONS.serene;
                const isHovered = hoveredDay?.dateStr === day.dateStr;

                return (
                  <div
                    key={day.dateStr}
                    onMouseEnter={() => setHoveredDay(day)}
                    onMouseLeave={() => setHoveredDay(null)}
                    onClick={() => setHoveredDay(day)}
                    className="flex-1 flex flex-col items-center h-full justify-end cursor-pointer group"
                  >
                    {/* Mood emoji indicator */}
                    <span className="text-xl mb-1.5 transform group-hover:scale-125 transition-transform">
                      {moodMeta.emoji}
                    </span>

                    {/* Energy Bar */}
                    <div className="w-full max-w-[42px] bg-stone-100 dark:bg-stone-700/60 rounded-t-xl overflow-hidden flex flex-col justify-end p-0.5 h-full">
                      <div
                        className={`w-full rounded-t-lg transition-all duration-300 ${
                          isHovered
                            ? 'bg-amber-500 shadow-md'
                            : 'bg-amber-400 dark:bg-amber-500/80'
                        }`}
                        style={{ height: `${energyPercent}%` }}
                      />
                    </div>

                    <span className="text-[11px] font-mono tabular-nums text-stone-600 dark:text-stone-300 mt-1">
                      Lvl {day.energy}
                    </span>

                    <span className={`text-xs font-semibold mt-1 transition-colors ${
                      day.isToday ? 'text-teal-600 dark:text-teal-400' : 'text-stone-600 dark:text-stone-400'
                    }`}>
                      {day.dayName}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span>Energy levels rated from 1 (Resting) to 5 (Vibrant)</span>
              <span className="text-amber-600 dark:text-amber-400 font-medium">Predominant Mood: Serene & Joyful</span>
            </div>
          </div>
        )}

        {/* TAB 3: Hydration & Habits Chart */}
        {activeChartTab === 'hydration' && (
          <div className="space-y-4">
            <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 pt-8 pb-4 relative border-b border-stone-200 dark:border-stone-700">
              {/* 2500ml target line */}
              <div 
                className="absolute left-0 right-0 border-b border-dashed border-teal-500/60 z-0 flex items-center justify-between text-[10px] text-teal-600 dark:text-teal-400 px-2"
                style={{ bottom: `${(2500 / maxWaterMl) * 100}%` }}
              >
                <span>2,500ml Hydration Target</span>
                <span className="font-mono">Daily Target</span>
              </div>

              {weeklyHistory.map((day) => {
                const heightPercent = (day.waterMl / maxWaterMl) * 100;
                const habitPercent = Math.round((day.habitsCompleted / day.habitsTotal) * 100);
                const isHovered = hoveredDay?.dateStr === day.dateStr;

                return (
                  <div
                    key={day.dateStr}
                    onMouseEnter={() => setHoveredDay(day)}
                    onMouseLeave={() => setHoveredDay(null)}
                    onClick={() => setHoveredDay(day)}
                    className="flex-1 flex flex-col items-center h-full justify-end cursor-pointer group relative z-10"
                  >
                    <span className="text-[10px] font-mono tabular-nums text-teal-700 dark:text-teal-300 font-semibold mb-1">
                      {day.waterMl}ml
                    </span>

                    {/* Bar */}
                    <div className="w-full max-w-[42px] bg-stone-100 dark:bg-stone-700/60 rounded-t-xl overflow-hidden flex flex-col justify-end p-0.5 h-full">
                      <div
                        className={`w-full rounded-t-lg transition-all duration-300 ${
                          isHovered
                            ? 'bg-teal-500 shadow-md'
                            : 'bg-teal-400 dark:bg-teal-500/80'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>

                    <span className="text-[10px] font-mono text-stone-500 mt-1">
                      {habitPercent}% habits
                    </span>

                    <span className={`text-xs font-semibold mt-1 transition-colors ${
                      day.isToday ? 'text-teal-600 dark:text-teal-400' : 'text-stone-600 dark:text-stone-400'
                    }`}>
                      {day.dayName}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span>Daily water intake bars compared to 2,500ml goal</span>
              <span className="text-teal-600 dark:text-teal-400 font-medium">Avg: {avgWater} ml / day</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
