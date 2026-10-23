import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, Wind, Heart, Sparkles } from 'lucide-react';

interface MindfulBreathingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type BreathPhase = 'inhale' | 'hold-in' | 'exhale' | 'hold-out';

export const MindfulBreathingModal: React.FC<MindfulBreathingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isActive, setIsActive] = useState(true);
  const [phase, setPhase] = useState<BreathPhase>('inhale');
  const [countdown, setCountdown] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  useEffect(() => {
    if (!isOpen || !isActive) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev > 1) {
          return prev - 1;
        } else {
          // Switch phase
          switch (phase) {
            case 'inhale':
              setPhase('hold-in');
              return 4;
            case 'hold-in':
              setPhase('exhale');
              return 4;
            case 'exhale':
              setPhase('hold-out');
              return 4;
            case 'hold-out':
              setPhase('inhale');
              setCyclesCompleted((c) => c + 1);
              return 4;
          }
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isActive, phase]);

  if (!isOpen) return null;

  const phaseInstructions = {
    inhale: { title: 'Breathe In Deeply', desc: 'Fill your lungs with fresh calm air through your nose', scale: 'scale-125' },
    'hold-in': { title: 'Hold & Settle', desc: 'Softly retain the air, feeling stillness within your chest', scale: 'scale-125' },
    exhale: { title: 'Release & Exhale', desc: 'Gently let all tension flow out through your mouth', scale: 'scale-90' },
    'hold-out': { title: 'Rest in Stillness', desc: 'Relax your shoulders before the next nourishing breath', scale: 'scale-90' },
  };

  const currentInfo = phaseInstructions[phase];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 dark:border-stone-700 relative text-center flex flex-col items-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <Wind className="w-4 h-4" />
          <span>Mindful Box Breathing · 4-4-4-4</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 mb-6">
          1-Minute Nervous System Reset
        </h2>

        {/* Breathing Animation Orb */}
        <div className="relative w-56 h-56 flex items-center justify-center my-4">
          {/* Subtle Outer Glow */}
          <div
            className={`absolute inset-0 rounded-full bg-teal-400/15 dark:bg-teal-500/20 blur-xl transition-all duration-1000 ease-in-out ${currentInfo.scale}`}
          />

          {/* Intermediate Ring */}
          <div
            className={`absolute w-48 h-48 rounded-full border-2 border-teal-500/30 dark:border-teal-400/30 transition-all duration-1000 ease-in-out ${currentInfo.scale}`}
          />

          {/* Central Animated Orb */}
          <div
            className={`w-36 h-36 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-400 dark:from-teal-600 dark:to-emerald-500 text-white flex flex-col items-center justify-center shadow-lg transition-transform duration-1000 ease-in-out ${currentInfo.scale}`}
          >
            <span className="text-3xl font-bold font-mono tabular-nums">
              {countdown}
            </span>
            <span className="text-xs font-medium uppercase tracking-wide opacity-90 mt-0.5">
              Seconds
            </span>
          </div>
        </div>

        {/* Text Instruction */}
        <div className="my-4">
          <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
            {currentInfo.title}
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-xs">
            {currentInfo.desc}
          </p>
        </div>

        {/* Cycles count */}
        <div className="flex items-center gap-1.5 text-xs text-stone-400 dark:text-stone-500 mb-6">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Cycles completed: <strong className="text-stone-700 dark:text-stone-300 tabular-nums">{cyclesCompleted}</strong></span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsActive(!isActive)}
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
          >
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isActive ? 'Pause' : 'Resume'}</span>
          </button>
          <button
            onClick={() => {
              setPhase('inhale');
              setCountdown(4);
              setCyclesCompleted(0);
            }}
            className="p-2.5 bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 dark:hover:bg-stone-600 text-stone-700 dark:text-stone-200 rounded-xl transition-colors"
            title="Restart Session"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-medium transition-colors"
          >
            Finish
          </button>
        </div>
      </div>
    </div>
  );
};
