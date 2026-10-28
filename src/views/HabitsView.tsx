import React, { useState } from 'react';
import { useLifeOS } from '../context/LifeOSContext';
import { HabitItem } from '../types';
import {
  Flame,
  Plus,
  Check,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Heart,
  Calendar,
  X,
  Trash2,
} from 'lucide-react';

export const HabitsView: React.FC = () => {
  const { habits, toggleHabitToday, addHabit, updateHabit, deleteHabit } = useLifeOS();
  const [modalOpen, setModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<HabitItem['category']>('health');
  const [newFreq, setNewFreq] = useState<HabitItem['frequency']>('daily');

  const today = new Date().toISOString().split('T')[0];

  // Past 7 days dates array
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addHabit({
      title: newTitle.trim(),
      category: newCategory,
      frequency: newFreq,
    });
    setNewTitle('');
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0e1526] border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-amber-950 text-amber-400 border border-amber-800/40">
              <Flame className="w-4 h-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Consistent Habit Tracker</h1>
          </div>
          <p className="text-xs text-slate-400">
            Build sustainable identity-based habits. Never miss twice—without guilt or punitive resets.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition"
        >
          <Plus className="w-4 h-4" /> Create New Habit
        </button>
      </div>

      {/* Non-Shaming Philosophy Banner */}
      <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/40 flex items-start gap-3 text-xs text-amber-200/90 leading-relaxed">
        <Heart className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p>
          <strong className="text-white">LifeOS Anti-Shaming Rule:</strong> Missing one day is normal life; missing two days is the start of a new habit. If life gets hectic, pause a habit rather than feeling defeat. Consistency is about returning, not perfection.
        </p>
      </div>

      {/* Habits List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {habits.map((habit) => {
          const isDoneToday = Boolean(habit.history[today]);
          return (
            <div
              key={habit.id}
              className={`p-5 rounded-2xl border transition-all ${
                habit.isPaused
                  ? 'bg-slate-950/30 border-slate-900 opacity-60'
                  : 'bg-[#0e1526] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleHabitToday(habit.id)}
                    className={`mt-0.5 w-7 h-7 rounded-xl flex items-center justify-center transition shrink-0 ${
                      isDoneToday
                        ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                        : 'border border-slate-600 hover:border-amber-400 text-transparent'
                    }`}
                    title={isDoneToday ? 'Mark incomplete today' : 'Mark done today'}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </button>

                  <div>
                    <h3 className={`text-sm font-bold ${isDoneToday ? 'text-amber-300' : 'text-white'}`}>
                      {habit.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                      <span className="capitalize px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                        {habit.category}
                      </span>
                      <span>• {habit.frequency}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-950/60 border border-amber-800/40 text-amber-300 text-xs font-bold font-mono">
                    <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                    <span>{habit.streak}d streak</span>
                  </div>
                </div>
              </div>

              {/* 7-Day Mini Heatmap */}
              <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                <span className="text-[10px] text-slate-500">Past 7 Days:</span>
                <div className="flex items-center gap-1.5">
                  {last7Days.map((dateStr) => {
                    const done = Boolean(habit.history[dateStr]);
                    const isCurrent = dateStr === today;
                    return (
                      <div
                        key={dateStr}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-mono transition ${
                          done
                            ? 'bg-amber-400 text-slate-950 font-bold'
                            : 'bg-slate-900 text-slate-500 border border-slate-800'
                        } ${isCurrent ? 'ring-1 ring-amber-400' : ''}`}
                        title={`${dateStr}: ${done ? 'Completed' : 'Missed'}`}
                      >
                        {done ? '✓' : '•'}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Habit Pause/Delete Controls */}
              <div className="flex items-center justify-end gap-3 pt-3 text-[11px]">
                <button
                  onClick={() => updateHabit(habit.id, { isPaused: !habit.isPaused })}
                  className="text-slate-400 hover:text-white"
                >
                  {habit.isPaused ? 'Resume Habit' : 'Pause Habit'}
                </button>
                <button
                  onClick={() => deleteHabit(habit.id)}
                  className="text-slate-500 hover:text-rose-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Habit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#0e1526] rounded-2xl border border-slate-700 p-6 text-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="text-sm font-bold text-white">Create Daily Habit</h4>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateHabit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Habit Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Read 20 pages, 500ml Water, Evening Walk"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as HabitItem['category'])}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="health">Health & Hydration</option>
                    <option value="productivity">Study & Productivity</option>
                    <option value="mind">Mindfulness</option>
                    <option value="wellness">Wellness</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Frequency</label>
                  <select
                    value={newFreq}
                    onChange={(e) => setNewFreq(e.target.value as HabitItem['frequency'])}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="daily">Daily (7 days)</option>
                    <option value="5-days">5 days a week</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button onClick={() => setModalOpen(false)} className="px-3 py-1.5 text-xs text-slate-400 hover:text-white">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md"
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
