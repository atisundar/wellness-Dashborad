import React, { useState } from 'react';
import { X, Check, User, Droplet, Moon, Footprints, Clock, RotateCcw } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  onResetAllData: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  onResetAllData,
}) => {
  const [name, setName] = useState(profile.name);
  const [waterGoalMl, setWaterGoalMl] = useState(profile.waterGoalMl);
  const [sleepGoalHours, setSleepGoalHours] = useState(profile.sleepGoalHours);
  const [stepGoal, setStepGoal] = useState(profile.stepGoal);
  const [bedtimeTarget, setBedtimeTarget] = useState(profile.bedtimeTarget);
  const [wakeTarget, setWakeTarget] = useState(profile.wakeTarget);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      ...profile,
      name: name.trim() || 'Mindful User',
      waterGoalMl: Number(waterGoalMl),
      sleepGoalHours: Number(sleepGoalHours),
      stepGoal: Number(stepGoal),
      bedtimeTarget,
      wakeTarget,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-stone-800 rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200 dark:border-stone-700 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold">
            <User className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
            Wellness Profile & Target Goals
          </h3>
        </div>
        <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
          Personalize your daily targets to suit your biological rhythm and lifestyle.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1 flex items-center gap-1">
                <Droplet className="w-3.5 h-3.5 text-teal-500" />
                Water Goal (ml)
              </label>
              <input
                type="number"
                step="100"
                value={waterGoalMl}
                onChange={(e) => setWaterGoalMl(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1 flex items-center gap-1">
                <Moon className="w-3.5 h-3.5 text-indigo-500" />
                Sleep Goal (hrs)
              </label>
              <input
                type="number"
                step="0.5"
                min="4"
                max="14"
                value={sleepGoalHours}
                onChange={(e) => setSleepGoalHours(parseFloat(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1 flex items-center gap-1">
                <Footprints className="w-3.5 h-3.5 text-emerald-500" />
                Daily Steps Target
              </label>
              <input
                type="number"
                step="500"
                value={stepGoal}
                onChange={(e) => setStepGoal(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                Target Bedtime
              </label>
              <input
                type="time"
                value={bedtimeTarget}
                onChange={(e) => setBedtimeTarget(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-stone-100 dark:border-stone-700 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                if (confirm('Reset dashboard to initial sample data?')) {
                  onResetAllData();
                  onClose();
                }
              }}
              className="text-[11px] text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Data</span>
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 text-xs text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
