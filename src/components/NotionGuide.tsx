import React, { useState } from 'react';
import { 
  BookOpen, 
  Copy, 
  Check, 
  Database, 
  Layout, 
  Calendar, 
  Columns, 
  Sparkles, 
  Heart, 
  Droplet, 
  Dumbbell, 
  FileText,
  ExternalLink
} from 'lucide-react';

export const NotionGuide: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'architecture' | 'databases' | 'views' | 'markdown'>('architecture');

  const markdownContent = `# Personal Wellness & Self-Care Dashboard — Notion Blueprint

## 1. Master Page Structure & Aesthetic Layout
- **Cover Image**: Minimalist eucalyptus leaves or warm linen morning sun (Hex: #E6EDE8)
- **Icon**: 🌿 or ☕
- **Top Quote Callout**: "Peace begins when expectation ends. Honor your daily balance."
- **Three-Column Hub Layout**:
  - **Left Column**: Quick Check-In Widget + Daily Habit Checklist (Filtered for "Today")
  - **Center Column**: Weekly Wellness Calendar + Sleep & Energy Trends Rollup
  - **Right Column**: Meal & Hydration Planner + Self-Care Resource Gallery

---

## 2. Database Schema 1: Daily Check-In & Wellness Journal
**Database Name**: \`[DB] Daily Reflections\`
| Property Name | Property Type | Options / Configuration / Formula |
|---|---|---|
| Date | Date (Title or Date Prop) | Format: Full Date (Default: Today) |
| Mood | Select | 🌿 Serene, ☀️ Joyful, ⚡ Vibrant, 🌊 Calm, 🌙 Reflective, 🌧️ Sensitive, 💤 Resting |
| Sleep Hours | Number | Decimal (e.g. 7.5 hrs) |
| Sleep Quality | Select | 1★ Restless, 2★ Fair, 3★ Good, 4★ Deep, 5★ Rejuvenating |
| Vital Energy | Select / Number | 1 (Low) to 5 (Radiant) |
| Water Intake (ml) | Number | e.g. 2500 ml |
| Gratitude Note | Rich Text | "One small blessing from today..." |
| Habit Relation | Relation | Linked to \`[DB] Habits Log\` |
| Completion Score | Formula | \`round((prop("Water Intake (ml)") / 2500 * 0.5 + prop("Sleep Hours") / 8 * 0.5) * 100) + "%"\` |

---

## 3. Database Schema 2: Habit Tracker (With Monthly Rollups)
**Database Name**: \`[DB] Habit Tracker\`
| Property Name | Property Type | Options / Configuration |
|---|---|---|
| Habit Name | Title | e.g. Morning Mindfulness (10m), Daily Movement, Screen Curfew |
| Category | Select | 🧠 Mind, 🏃 Body, 🌙 Rest, 🥗 Nutrition |
| Target Cadence | Select | Daily (7/wk), Weekdays (5/wk), 3x/Week |
| Linked Days | Relation | Two-way relation to \`[DB] Daily Reflections\` |
| Streak Counter | Rollup / Formula | Counts consecutive checked days |
| Monthly Completion | Formula | \`format(round((length(replaceAll(prop("Linked Days"), "[^,]", "")) + 1) / 30 * 100)) + "% Month"\` |

---

## 4. Database Schema 3: Weekly Meal Planner & Hydration
**Database Name**: \`[DB] Nourishment & Hydration\`
| Property Name | Property Type | Options / Notes |
|---|---|---|
| Day of Week | Select | Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday |
| Breakfast | Text / Multi-select | Oatmeal, Chia pudding, Avocado toast |
| Lunch | Text | Quinoa bowl, Mediterranean salad |
| Dinner | Text | Roasted salmon & greens, Lentil soup |
| Prep Notes | Text | Batch cook brown rice on Sunday |
| Hydration Goal | Checkbox / Number | Target 2,500 ml achieved |

---

## 5. Database Schema 4: Wellness Resource Library & Templates
**Database Name**: \`[DB] Wellness Resources\`
| Item | Category | Recommended Content / Link |
|---|---|---|
| 15-Min Vinyasa Morning | Workout Routine | Embedded YouTube / Flow sequence guide |
| Box Breathing 4-4-4-4 | Meditation | Guide to parasympathetic nervous system reset |
| Evening Wind-Down Journal | Journaling Template | "What drained me? What restored me? What can I let go?" |
| Healthy Snack Combinations | Nutrition | High-protein & gut-friendly snack ideas |

---

## 6. Recommended Notion Views & Embedded Widgets
1. **Board View (by Mood / Energy)**: Visually categorizes days into color cards.
2. **Calendar View (Monthly)**: Shows sleep hours, mood emoji, and workout completion right on the calendar day.
3. **Gallery View (Card Size: Medium)**: For Guided Meditations and Workout cards with soothing cover photos.
4. **Embedded Widgets (Indify.co or Apption.co)**:
   - Minimalist Clock Widget (Hex: #2D5A50)
   - Weather forecast with humidity/outdoor comfort index
   - Spotify lofi / nature sounds playlist embed.
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-white dark:bg-stone-800/90 rounded-2xl p-6 border border-stone-200 dark:border-stone-700/80 shadow-xs transition-all space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-100 dark:border-stone-700/60">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              Notion Wellness & Self-Care Hub Setup Guide
            </h2>
            <span className="text-xs text-teal-700 dark:text-teal-300 font-semibold bg-teal-50 dark:bg-teal-950/50 px-2 py-0.5 rounded-md">
              Complete Schema
            </span>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Database architecture, property types, relations, formulas, and view recommendations for your Notion workspace.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied to Clipboard!' : 'Copy Notion Markdown'}</span>
        </button>
      </div>

      {/* Navigation tabs for the guide */}
      <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-900/60 rounded-xl">
        {(
          [
            { id: 'architecture', label: '1. Layout Architecture', icon: <Layout className="w-3.5 h-3.5" /> },
            { id: 'databases', label: '2. Database Schemas', icon: <Database className="w-3.5 h-3.5" /> },
            { id: 'views', label: '3. Views & Widgets', icon: <Columns className="w-3.5 h-3.5" /> },
            { id: 'markdown', label: '4. Full Markdown Code', icon: <FileText className="w-3.5 h-3.5" /> },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === tab.id
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab 1: Architecture */}
      {activeTab === 'architecture' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-700">
              <h4 className="text-xs font-bold text-teal-700 dark:text-teal-300 uppercase tracking-wide mb-2 flex items-center gap-1">
                <span>Left Column</span>
              </h4>
              <h5 className="text-sm font-semibold text-stone-800 dark:text-stone-200 mb-1">
                Daily Focus & Check-In
              </h5>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed mb-3">
                Quick habit checklist filtered to "Today", mood dropdown, and hydration bottle stepper.
              </p>
              <div className="text-[11px] text-stone-600 dark:text-stone-300 bg-white dark:bg-stone-800 p-2 rounded-lg border border-stone-200/60 dark:border-stone-700">
                · Linked View: Daily Habits (Due Today)<br />
                · Quick Callout: Today's Affirmation<br />
                · Button: "New Check-In"
              </div>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-700">
              <h4 className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wide mb-2 flex items-center gap-1">
                <span>Center Column</span>
              </h4>
              <h5 className="text-sm font-semibold text-stone-800 dark:text-stone-200 mb-1">
                Weekly Rhythm & Calendar
              </h5>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed mb-3">
                Calendar view displaying sleep hours, logged workouts, and monthly habit completion rollups.
              </p>
              <div className="text-[11px] text-stone-600 dark:text-stone-300 bg-white dark:bg-stone-800 p-2 rounded-lg border border-stone-200/60 dark:border-stone-700">
                · Calendar: Daily Reflections<br />
                · Properties shown: Mood, Sleep, Workout<br />
                · Monthly Rollup: 88% Consistency
              </div>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-700">
              <h4 className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wide mb-2 flex items-center gap-1">
                <span>Right Column</span>
              </h4>
              <h5 className="text-sm font-semibold text-stone-800 dark:text-stone-200 mb-1">
                Nourishment & Resources
              </h5>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed mb-3">
                Meal planner board, grocery checklist, guided meditation gallery, and evening journal templates.
              </p>
              <div className="text-[11px] text-stone-600 dark:text-stone-300 bg-white dark:bg-stone-800 p-2 rounded-lg border border-stone-200/60 dark:border-stone-700">
                · Board View: Weekly Meal Planner<br />
                · Gallery: Guided Meditations<br />
                · Journal Prompts & Templates
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Databases */}
      {activeTab === 'databases' && (
        <div className="space-y-4">
          <div className="border border-stone-200 dark:border-stone-700 rounded-xl overflow-hidden">
            <div className="bg-stone-50 dark:bg-stone-900 px-4 py-2.5 border-b border-stone-200 dark:border-stone-700 font-semibold text-xs text-stone-800 dark:text-stone-200">
              Database 1: [DB] Daily Reflections & Metrics
            </div>
            <div className="p-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 dark:border-stone-700 text-stone-400 font-medium">
                    <th className="pb-2">Property Name</th>
                    <th className="pb-2">Property Type</th>
                    <th className="pb-2">Details / Format</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-700/60 text-stone-700 dark:text-stone-300">
                  <tr>
                    <td className="py-2 font-mono font-semibold">Date</td>
                    <td className="py-2">Date (Title)</td>
                    <td className="py-2">Full date with day name</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono font-semibold">Mood</td>
                    <td className="py-2">Select</td>
                    <td className="py-2">🌿 Serene, ☀️ Joyful, ⚡ Vibrant, 🌊 Calm, 🌙 Reflective, 🌧️ Sensitive</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono font-semibold">Sleep Hours</td>
                    <td className="py-2">Number</td>
                    <td className="py-2">Decimal (e.g., 7.5 hrs)</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono font-semibold">Sleep Quality</td>
                    <td className="py-2">Select</td>
                    <td className="py-2">1★ Restless, 2★ Fair, 3★ Good, 4★ Deep, 5★ Rejuvenating</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono font-semibold">Vital Energy</td>
                    <td className="py-2">Select / Number</td>
                    <td className="py-2">1 (Low) to 5 (Radiant)</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono font-semibold">Water Intake</td>
                    <td className="py-2">Number</td>
                    <td className="py-2">Target: 2,500 ml</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono font-semibold">Gratitude Note</td>
                    <td className="py-2">Text</td>
                    <td className="py-2">One specific positive highlight of the day</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono font-semibold">Habit Relation</td>
                    <td className="py-2">Relation</td>
                    <td className="py-2">Link to [DB] Habit Tracker</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="border border-stone-200 dark:border-stone-700 rounded-xl overflow-hidden">
            <div className="bg-stone-50 dark:bg-stone-900 px-4 py-2.5 border-b border-stone-200 dark:border-stone-700 font-semibold text-xs text-stone-800 dark:text-stone-200">
              Database 2: [DB] Habit Tracker with Rollup
            </div>
            <div className="p-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 dark:border-stone-700 text-stone-400 font-medium">
                    <th className="pb-2">Property Name</th>
                    <th className="pb-2">Property Type</th>
                    <th className="pb-2">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-700/60 text-stone-700 dark:text-stone-300">
                  <tr>
                    <td className="py-2 font-mono font-semibold">Habit Name</td>
                    <td className="py-2">Title</td>
                    <td className="py-2">Morning Meditation, Workout, Reading, Digital Curfew</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono font-semibold">Category</td>
                    <td className="py-2">Select</td>
                    <td className="py-2">Mind, Body, Rest, Nutrition</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono font-semibold">Cadence</td>
                    <td className="py-2">Select</td>
                    <td className="py-2">Daily (7/wk), 5x/week, 3x/week</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono font-semibold">Linked Days</td>
                    <td className="py-2">Relation</td>
                    <td className="py-2">Relates back to [DB] Daily Reflections</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono font-semibold">Monthly Rollup</td>
                    <td className="py-2">Rollup / Formula</td>
                    <td className="py-2">Calculates monthly completion percentage automatically</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Views & Widgets */}
      {activeTab === 'views' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-700">
            <h4 className="text-xs font-bold text-teal-700 dark:text-teal-300 uppercase tracking-wide mb-2 flex items-center gap-1">
              <Columns className="w-3.5 h-3.5" /> Recommended Notion Views
            </h4>
            <ul className="text-xs space-y-2 text-stone-600 dark:text-stone-300">
              <li>
                <strong>1. Board View (Grouped by Mood):</strong> Group columns by Serene, Joyful, Calm, Sensitive to visually map out emotional well-being across the month.
              </li>
              <li>
                <strong>2. Monthly Calendar View:</strong> Display sleep hours, sleep quality stars, and workout emoji directly on each calendar card for glanceable trends.
              </li>
              <li>
                <strong>3. Gallery View for Wellness Resources:</strong> Card preview set to Page Cover with soothing minimal imagery for Yoga, Breathwork, and Healthy Meals.
              </li>
              <li>
                <strong>4. Table View with Filter "Date is Today":</strong> Zero-friction daily entry directly on your Notion dashboard home screen.
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-700">
            <h4 className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wide mb-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Aesthetic Widgets & Embeds
            </h4>
            <ul className="text-xs space-y-2 text-stone-600 dark:text-stone-300">
              <li>
                <strong>Minimalist Clock Widget:</strong> Analog or digital flip clock in neutral sage/linen tones via Apption or Indify.
              </li>
              <li>
                <strong>Spotify / Apple Music Embed:</strong> Ambient Lofi, Sound Baths, or Nature Rain playlist right beside the habit tracker.
              </li>
              <li>
                <strong>Quotes Carousel:</strong> Rotating affirmations in a soft beige callout box with a gentle lightbulb or leaf icon.
              </li>
              <li>
                <strong>Progress Bar Formula:</strong> Use Unicode blocks (<code>▓▓▓▓░░░░░░ 40%</code>) inside Notion database properties for instant visual feedback.
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Tab 4: Raw Markdown Copy */}
      {activeTab === 'markdown' && (
        <div>
          <pre className="p-4 bg-stone-900 text-stone-200 rounded-xl text-xs font-mono overflow-x-auto max-h-96 leading-relaxed">
            {markdownContent}
          </pre>
        </div>
      )}
    </div>
  );
};
