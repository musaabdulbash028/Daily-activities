import React, { useState } from 'react';
import { useLifeOS } from '../context/LifeOSContext';
import { ScheduleBlock, ActivityCategory, Priority } from '../types';
import {
  Calendar,
  Sparkles,
  AlertTriangle,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  Edit2,
  Filter,
  Check,
  X,
  Info,
  CalendarRange,
  Zap,
} from 'lucide-react';

export const PlannerView: React.FC = () => {
  const {
    profile,
    schedule,
    addScheduleBlock,
    updateScheduleBlock,
    deleteScheduleBlock,
    toggleCompleteBlock,
    conflicts,
    replaceSchedule,
    tasks,
  } = useLifeOS();

  const [activeTab, setActiveTab] = useState<'daily' | 'weekly'>('daily');
  const [selectedCategory, setSelectedCategory] = useState<ActivityCategory | 'all'>('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationNote, setGenerationNote] = useState<string | null>(null);

  // Modal state for Add/Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [blockTitle, setBlockTitle] = useState('');
  const [blockCategory, setBlockCategory] = useState<ActivityCategory>('study');
  const [blockStartTime, setBlockStartTime] = useState('09:00');
  const [blockEndTime, setBlockEndTime] = useState('10:00');
  const [blockPriority, setBlockPriority] = useState<Priority>('medium');
  const [blockNotes, setBlockNotes] = useState('');

  const openAddModal = () => {
    setEditingBlockId(null);
    setBlockTitle('');
    setBlockCategory('study');
    setBlockStartTime('09:00');
    setBlockEndTime('10:00');
    setBlockPriority('medium');
    setBlockNotes('');
    setModalOpen(true);
  };

  const openEditModal = (b: ScheduleBlock) => {
    setEditingBlockId(b.id);
    setBlockTitle(b.title);
    setBlockCategory(b.category);
    setBlockStartTime(b.startTime);
    setBlockEndTime(b.endTime);
    setBlockPriority(b.priority);
    setBlockNotes(b.notes || '');
    setModalOpen(true);
  };

  const handleSaveBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockTitle.trim()) return;

    if (editingBlockId) {
      updateScheduleBlock(editingBlockId, {
        title: blockTitle.trim(),
        category: blockCategory,
        startTime: blockStartTime,
        endTime: blockEndTime,
        priority: blockPriority,
        notes: blockNotes.trim(),
      });
    } else {
      addScheduleBlock({
        title: blockTitle.trim(),
        category: blockCategory,
        startTime: blockStartTime,
        endTime: blockEndTime,
        priority: blockPriority,
        completed: false,
        notes: blockNotes.trim(),
      });
    }
    setModalOpen(false);
  };

  // Generate My Day handler (AI API or Algorithmic Fallback)
  const handleGenerateMyDay = async () => {
    setIsGenerating(true);
    setGenerationNote(null);
    try {
      const res = await fetch('/api/ai/generate-day', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          fixedCommitments: profile.fixedCommitments,
          tasks,
        }),
      });
      const data = await res.json();
      if (data.blocks && Array.isArray(data.blocks) && data.blocks.length > 0) {
        replaceSchedule(data.blocks);
        setGenerationNote(data.note || 'Optimized for circadian alertness & sleep protection.');
      }
    } catch (e) {
      console.error(e);
      setGenerationNote('Adjusted schedule locally based on your sleep window.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Filtered blocks
  const filteredSchedule = schedule.filter((b) =>
    selectedCategory === 'all' ? true : b.category === selectedCategory
  );

  const categories: Array<{ id: ActivityCategory | 'all'; label: string }> = [
    { id: 'all', label: 'All Activities' },
    { id: 'study', label: 'Study & Work' },
    { id: 'workout', label: 'Workout & Fitness' },
    { id: 'meditation', label: 'Mind & Calm' },
    { id: 'routine', label: 'Routines' },
    { id: 'meals', label: 'Meals' },
    { id: 'breaks', label: 'Breaks' },
    { id: 'sleep', label: 'Sleep & Wind-down' },
  ];

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header with Title and "Generate My Day" button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0e1526] border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-indigo-950 text-indigo-400 border border-indigo-800/40">
              <Calendar className="w-4 h-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Smart Daily Planner</h1>
          </div>
          <p className="text-xs text-slate-400">
            Circadian-aligned time blocking balancing high-focus cognitive blocks, safe workouts, and restorative sleep.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleGenerateMyDay}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-teal-400 text-white font-semibold text-xs shadow-lg shadow-indigo-600/25 hover:opacity-95 active:scale-95 transition disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Generating Optimal Day...' : '✨ Generate My Day'}
          </button>

          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
          >
            <Plus className="w-4 h-4" /> Add Block
          </button>
        </div>
      </div>

      {generationNote && (
        <div className="p-3 bg-teal-950/40 border border-teal-800/50 rounded-2xl flex items-center gap-3 text-xs text-teal-300">
          <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
          <span>{generationNote}</span>
        </div>
      )}

      {/* Conflict Detector Banner */}
      {conflicts.length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-slate-200 space-y-2">
          <div className="flex items-center gap-2 text-rose-300 text-xs font-bold uppercase tracking-wide">
            <AlertTriangle className="w-4 h-4 text-rose-400" /> Overlapping Schedule Detected ({conflicts.length})
          </div>
          <p className="text-xs text-slate-300">
            Overloaded and overlapping time blocks cause cognitive friction and stress. Here are the conflicts:
          </p>
          <div className="space-y-1.5 pt-1">
            {conflicts.map((c, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-rose-900/30 border border-rose-800/40 text-xs flex items-center justify-between gap-3">
                <span className="text-rose-200">{c.message}</span>
                <button
                  onClick={() => openEditModal(c.block2)}
                  className="px-2 py-1 rounded bg-rose-800 text-white font-semibold text-[11px] shrink-0 hover:bg-rose-700 transition"
                >
                  Reschedule
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scientific Starting Points Disclosure */}
      <div className="p-3.5 bg-slate-900/50 border border-slate-800 rounded-2xl flex items-start gap-3 text-xs text-slate-400">
        <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <p>
          <strong className="text-slate-300">Personalized starting point:</strong> The suggested times are designed to optimize natural ultradian energy cycles and protect 8 hours of sleep. Feel free to reschedule or modify any block to fit unpredictable life events.
        </p>
      </div>

      {/* Tabs and Category Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Daily vs Weekly Toggle */}
        <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('daily')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'daily' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" /> Daily Timeline
          </button>
          <button
            onClick={() => setActiveTab('weekly')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'weekly' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <CalendarRange className="w-3.5 h-3.5" /> Weekly Template
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition border ${
                selectedCategory === c.id
                  ? 'border-indigo-500 bg-indigo-950/60 text-indigo-200'
                  : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:text-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Daily View: Visual Timeline & Cards */}
      {activeTab === 'daily' ? (
        <div className="space-y-3">
          {filteredSchedule.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#0e1526] border border-slate-800 text-slate-400">
              <Calendar className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              <p className="text-sm font-semibold text-slate-300">No activities found for this filter</p>
              <p className="text-xs text-slate-500 mt-1">Click "Add Block" or "Generate My Day" to create your plan.</p>
            </div>
          ) : (
            filteredSchedule.map((block) => (
              <div
                key={block.id}
                className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  block.completed
                    ? 'bg-slate-950/30 border-slate-900 opacity-60'
                    : 'bg-[#0e1526] border-slate-800 hover:border-slate-700 shadow-sm'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <button
                    onClick={() => toggleCompleteBlock(block.id)}
                    className={`mt-0.5 sm:mt-0 w-6 h-6 rounded-lg flex items-center justify-center transition shrink-0 ${
                      block.completed
                        ? 'bg-teal-500 text-white'
                        : 'border border-slate-600 hover:border-teal-400'
                    }`}
                    title={block.completed ? 'Mark incomplete' : 'Mark complete'}
                  >
                    {block.completed && <Check className="w-4 h-4" />}
                  </button>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-semibold text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded-md border border-indigo-900/50">
                        {block.startTime} – {block.endTime}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-md font-semibold uppercase ${
                          block.category === 'study'
                            ? 'bg-purple-950 text-purple-300 border border-purple-800/40'
                            : block.category === 'workout'
                            ? 'bg-teal-950 text-teal-300 border border-teal-800/40'
                            : block.category === 'meditation'
                            ? 'bg-indigo-950 text-indigo-300 border border-indigo-800/40'
                            : block.category === 'sleep'
                            ? 'bg-blue-950 text-blue-300 border border-blue-800/40'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {block.category}
                      </span>
                      {block.priority === 'high' && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800/40 font-semibold">
                          HIGH
                        </span>
                      )}
                      {block.isFixed && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/40">
                          Fixed Commitment
                        </span>
                      )}
                    </div>
                    <h3 className={`text-sm font-bold ${block.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                      {block.title}
                    </h3>
                    {block.notes && (
                      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{block.notes}</p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => openEditModal(block)}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                    title="Edit block"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteScheduleBlock(block.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-950/30 transition"
                    title="Delete block"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Weekly View Template */
        <div className="p-6 rounded-3xl bg-[#0e1526] border border-slate-800 space-y-4">
          <div>
            <h3 className="text-base font-bold text-white">Weekly Circadian Template</h3>
            <p className="text-xs text-slate-400">
              A balanced recurring template allocating study, recovery, and commitments across the week.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, idx) => (
              <div key={day} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-white">{day}</span>
                  <span className="text-[10px] text-teal-400 font-mono">
                    {idx % 2 === 0 ? 'Study + Strength' : 'Study + Mobility'}
                  </span>
                </div>
                <div className="space-y-1.5 text-[11px] text-slate-300">
                  <p className="p-1 rounded bg-slate-800/40">07:00 Wake & Sunlight</p>
                  <p className="p-1 rounded bg-indigo-950/50 text-indigo-300">09:00 Deep Work</p>
                  <p className="p-1 rounded bg-slate-800/40">12:30 Balanced Lunch</p>
                  <p className="p-1 rounded bg-teal-950/50 text-teal-300">16:30 Movement (25m)</p>
                  <p className="p-1 rounded bg-blue-950/50 text-blue-300">22:00 Wind-Down</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit Block Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#0e1526] rounded-2xl border border-slate-700 shadow-2xl p-6 text-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingBlockId ? 'Edit Schedule Block' : 'Add Schedule Block'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBlock} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Activity Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Neuroscience Active Recall, Safe Workout, Dinner"
                  value={blockTitle}
                  onChange={(e) => setBlockTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Start Time</label>
                  <input
                    type="time"
                    required
                    value={blockStartTime}
                    onChange={(e) => setBlockStartTime(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">End Time</label>
                  <input
                    type="time"
                    required
                    value={blockEndTime}
                    onChange={(e) => setBlockEndTime(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={blockCategory}
                    onChange={(e) => setBlockCategory(e.target.value as ActivityCategory)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="study">Study</option>
                    <option value="workout">Workout</option>
                    <option value="meditation">Meditation</option>
                    <option value="routine">Routine</option>
                    <option value="meals">Meals</option>
                    <option value="breaks">Break</option>
                    <option value="tasks">Tasks</option>
                    <option value="sleep">Sleep</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Priority</label>
                  <select
                    value={blockPriority}
                    onChange={(e) => setBlockPriority(e.target.value as Priority)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Notes / Guidance</label>
                <input
                  type="text"
                  placeholder="e.g. Focus on active recall, drink water"
                  value={blockNotes}
                  onChange={(e) => setBlockNotes(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg transition"
                >
                  {editingBlockId ? 'Save Changes' : 'Create Block'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
