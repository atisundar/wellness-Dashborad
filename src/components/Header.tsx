import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  Moon, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Wind, 
  BookOpen, 
  RefreshCw,
  SlidersHorizontal,
  Flame,
  CheckCircle2,
  Calendar,
  Heart
} from 'lucide-react';
import { UserProfile } from '../types';
import { AFFIRMATIONS } from '../utils/initialData';
import { ambientSound } from '../utils/audioSynthesizer';

interface HeaderProps {
  profile: UserProfile;
  darkMode: boolean;
  onToggleTheme: () => void;
  activeTab: 'overview' | 'habits' | 'workouts' | 'analytics' | 'notion';
  setActiveTab: (tab: 'overview' | 'habits' | 'workouts' | 'analytics' | 'notion') => void;
  onOpenBreathing: () => void;
  onOpenProfile: () => void;
  totalHabitsCompletedToday: number;
  totalHabitsCount: number;
  currentStreak: number;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  darkMode,
  onToggleTheme,
  activeTab,
  setActiveTab,
  onOpenBreathing,
  onOpenProfile,
  totalHabitsCompletedToday,
  totalHabitsCount,
  currentStreak,
}) => {
  const [affirmationIndex, setAffirmationIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [soundPlaying, setSoundPlaying] = useState<string | null>(null);
  const [soundMenuOpen, setSoundMenuOpen] = useState(false);
  const [soundVolume, setSoundVolume] = useState(0.4);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleNextAffirmation = () => {
    setAffirmationIndex((prev) => (prev + 1) % AFFIRMATIONS.length);
  };

  const handleSoundToggle = (soundType: 'rain' | 'ocean' | 'zen' | 'wind') => {
    if (soundPlaying === soundType) {
      ambientSound.stop();
      setSoundPlaying(null);
    } else {
      ambientSound.play(soundType);
      setSoundPlaying(soundType);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setSoundVolume(newVol);
    ambientSound.setVolume(newVol);
  };

  // Determine greeting based on current local hour
  const hour = currentTime.getHours();
  let greeting = 'Good morning';
  if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
  else if (hour >= 17) greeting = 'Good evening';

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const currentAffirmation = AFFIRMATIONS[affirmationIndex];

  return (
    <header className="w-full bg-stone-50/80 dark:bg-stone-900/80 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800 transition-colors">
      {/* Top Bar: Clean 3-zone contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Zone 1: Single Brand wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-teal-600/10 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-lg border border-teal-600/20 shadow-xs">
            A
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-stone-900 dark:text-stone-100 whitespace-nowrap">
              Aura Wellness
            </span>
            <span className="text-xs text-stone-500 dark:text-stone-400 font-normal">
              Mind · Body · Balance
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links / Segmented Tabs */}
        <nav className="hidden md:flex items-center gap-1 p-1 bg-stone-200/50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700/60">
          {(
            [
              { id: 'overview', label: 'Today’s Balance' },
              { id: 'habits', label: 'Habits & Routine' },
              { id: 'workouts', label: 'Movement & Logs' },
              { id: 'analytics', label: 'Weekly Trends' },
              { id: 'notion', label: 'Notion Setup Guide' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Functional utilities */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Ambient Sound Menu */}
          <div className="relative">
            <button
              onClick={() => setSoundMenuOpen(!soundMenuOpen)}
              title="Ambient Soundscapes"
              className={`p-2 rounded-xl border text-xs font-medium transition-colors flex items-center gap-1.5 ${
                soundPlaying
                  ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-300 dark:border-teal-700 text-teal-700 dark:text-teal-300'
                  : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700/50'
              }`}
            >
              {soundPlaying ? <Volume2 className="w-4 h-4 text-teal-600 dark:text-teal-400 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">
                {soundPlaying ? soundPlaying.toUpperCase() : 'Ambient'}
              </span>
            </button>

            {soundMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-stone-800 rounded-xl shadow-lg border border-stone-200 dark:border-stone-700 p-3 z-50">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100 dark:border-stone-700">
                  <span className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                    Ambient Soundscapes
                  </span>
                  {soundPlaying && (
                    <button
                      onClick={() => {
                        ambientSound.stop();
                        setSoundPlaying(null);
                      }}
                      className="text-[11px] text-rose-600 dark:text-rose-400 hover:underline"
                    >
                      Turn Off
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-1.5 mb-3">
                  {[
                    { id: 'rain', name: 'Gentle Rain', icon: '🌧️' },
                    { id: 'ocean', name: 'Ocean Waves', icon: '🌊' },
                    { id: 'zen', name: 'Zen 432Hz', icon: '🧘' },
                    { id: 'wind', name: 'Forest Wind', icon: '🍃' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleSoundToggle(s.id as 'rain' | 'ocean' | 'zen' | 'wind')}
                      className={`px-2.5 py-2 rounded-lg text-left text-xs flex items-center gap-1.5 transition-colors ${
                        soundPlaying === s.id
                          ? 'bg-teal-100 dark:bg-teal-900/60 font-semibold text-teal-900 dark:text-teal-200'
                          : 'hover:bg-stone-100 dark:hover:bg-stone-700/60 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      <span>{s.icon}</span>
                      <span className="truncate">{s.name}</span>
                    </button>
                  ))}
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-stone-500 mb-1">
                    <span>Volume</span>
                    <span>{Math.round(soundVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={soundVolume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="w-full accent-teal-600 cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Quick 1-Min Mindful Breathing */}
          <button
            onClick={onOpenBreathing}
            title="1-Minute Mindful Box Breathing"
            className="p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:text-teal-600 dark:hover:text-teal-400 hover:border-teal-200 transition-colors flex items-center gap-1.5 text-xs font-medium"
          >
            <Wind className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span className="hidden sm:inline">Breathe</span>
          </button>

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={onToggleTheme}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700/50 transition-colors"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-600" />}
          </button>

          {/* Profile Avatar & Settings */}
          <button
            onClick={onOpenProfile}
            title="Personal Goals & Profile"
            className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:border-teal-400/60 transition-colors"
          >
            <div className="w-6 h-6 rounded-lg bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200 font-semibold text-xs flex items-center justify-center">
              {profile.name.charAt(0)}
            </div>
            <span className="text-xs font-medium text-stone-700 dark:text-stone-300 hidden sm:inline max-w-[80px] truncate">
              {profile.name}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="md:hidden flex overflow-x-auto px-4 py-2 gap-1 border-t border-stone-200 dark:border-stone-800">
        {(
          [
            { id: 'overview', label: 'Today' },
            { id: 'habits', label: 'Habits' },
            { id: 'workouts', label: 'Workouts' },
            { id: 'analytics', label: 'Analytics' },
            { id: 'notion', label: 'Notion' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Hero Greeting & Daily Affirmation Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          {/* Left Greeting & Context */}
          <div className="lg:col-span-7 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-medium text-stone-500 dark:text-stone-400">
              <Calendar className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>{formattedDate}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums font-mono">{formattedTime}</span>
              <span aria-hidden="true">·</span>
              <span className="text-teal-700 dark:text-teal-300 font-semibold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-500 inline" /> {currentStreak}-day streak
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
              {greeting}, {profile.name}
            </h1>

            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed max-w-xl">
              You've completed <span className="font-semibold text-teal-700 dark:text-teal-300">{totalHabitsCompletedToday} of {totalHabitsCount}</span> mindful rituals today. Take a deep breath and keep listening to your body's rhythm.
            </p>
          </div>

          {/* Right Daily Motivational Affirmation Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-teal-500/8 via-amber-500/5 to-emerald-500/10 dark:from-teal-950/40 dark:via-stone-900 dark:to-emerald-950/30 rounded-2xl p-4 border border-teal-500/15 dark:border-teal-800/40 shadow-xs relative group">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-800 dark:text-teal-300">
                <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Daily Affirmation</span>
                <span className="text-stone-400 font-normal">·</span>
                <span className="text-stone-500 dark:text-stone-400 font-normal">{currentAffirmation.category}</span>
              </div>
              <button
                onClick={handleNextAffirmation}
                title="Shuffle Affirmation"
                className="p-1 rounded-lg text-stone-500 hover:text-teal-700 dark:hover:text-teal-300 hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-sm font-medium italic text-stone-800 dark:text-stone-200 leading-snug">
              “{currentAffirmation.text}”
            </p>

            {currentAffirmation.author && (
              <p className="text-right text-[11px] text-stone-500 dark:text-stone-400 mt-1 font-normal">
                — {currentAffirmation.author}
              </p>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
