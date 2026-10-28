import React, { useState } from 'react';
import { useLifeOS } from '../context/LifeOSContext';
import { ActiveTab } from '../components/Navigation';
import {
  Sparkles,
  Clock,
  GraduationCap,
  Dumbbell,
  Moon,
  Flame,
  CheckCircle2,
  Calendar,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Brain,
  Smile,
  Zap,
} from 'lucide-react';

interface DashboardViewProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ setActiveTab }) => {
  const {
    profile,
    schedule,
    toggleCompleteBlock,
    conflicts,
    assignments,
    habits,
    studyMinutesToday,
    meditationMinutesToday,
    workoutLogs,
    moodLogs,
    sleepLogs,
    logMoodEnergy,
    setFocusMode,
    setOnboardingOpen,
  } = useLifeOS();

  const [quickMood, setQuickMood] = useState<'focused' | 'joyful' | 'calm' | 'stressed' | null>(null);

  // Determine next upcoming activity
  const now = new Date();
  const currentHours = String(now.getHours()).padStart(2, '0');
  const currentMinutes = String(now.getMinutes()).padStart(2, '0');
  const currentTimeStr = `${currentHours}:${currentMinutes}`;

  const upcomingBlock =
    schedule.find((b) => !b.completed && b.endTime >= currentTimeStr) || schedule.find((b) => !b.completed);

  // Metric counts
  const completedHabitsToday = habits.filter((h) => {
    const today = new Date().toISOString().split('T')[0];
    return Boolean(h.history[today]);
  }).length;

  const totalHabits = habits.length;
  const habitCompletionRate = totalHabits > 0 ? Math.round((completedHabitsToday / totalHabits) * 100) : 0;

  const completedBlocksCount = schedule.filter((b) => b.completed).length;
  const totalBlocksCount = schedule.length;

  const urgentAssignments = assignments
    .filter((a) => !a.completed)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 3);

  // Motivational quote based on time of day
  const getGreeting = () => {
    const hour = now.getHours();
    if (hour < 12) return { text: 'Good morning', icon: '☀️' };
    if (hour < 18) return { text: 'Good afternoon', icon: '🌤️' };
    return { text: 'Good evening', icon: '🌙' };
  };

  const greeting = getGreeting();

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#111936] via-[#0d1428] to-[#090d1a] border border-indigo-900/40 p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/70 border border-indigo-800/40 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>LifeOS • Build a Better You, One Day at a Time.</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {greeting.text}, {profile.name}! {greeting.icon}
            </h1>
            <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
              Today is structured to support your peak cognitive hours, protect 8 hours of restorative sleep, and give you momentum through safe, balanced daily habits.
            </p>
          </div>

          {/* Quick Action Shortcuts */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setFocusMode(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-xs shadow-lg shadow-indigo-600/25 transition active:scale-95"
            >
              <Zap className="w-4 h-4 fill-current" /> Start Deep Focus
            </button>
            <button
              onClick={() => setActiveTab('planner')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60 text-xs font-semibold transition"
            >
              <Calendar className="w-4 h-4 text-teal-400" /> Smart Planner
            </button>
            <button
              onClick={() => setActiveTab('coach')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-950/50 hover:bg-indigo-900/50 text-indigo-200 border border-indigo-800/50 text-xs font-semibold transition"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" /> Ask Coach
            </button>
          </div>
        </div>

        {/* Schedule Conflict Warning (if any) */}
        {conflicts.length > 0 && (
          <div className="mt-5 p-3.5 bg-rose-950/40 border border-rose-800/50 rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <p className="text-xs text-rose-200 font-medium">
                LifeOS detected <span className="font-bold">{conflicts.length} overlapping schedule block</span>. Let's resolve it to keep your day calm and realistic.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('planner')}
              className="text-xs font-semibold text-rose-300 hover:text-white underline underline-offset-2 shrink-0"
            >
              Resolve in Planner →
            </button>
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Study Time */}
        <div
          onClick={() => setActiveTab('study')}
          className="group cursor-pointer p-4 sm:p-5 rounded-2xl bg-[#0e1526] border border-slate-800/80 hover:border-purple-500/40 transition-all duration-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-purple-400 group-hover:scale-105 transition">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-purple-400 bg-purple-950/40 px-2 py-0.5 rounded-md">
              Today
            </span>
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">{studyMinutesToday} <span className="text-xs font-normal text-slate-400">mins</span></p>
          <p className="text-xs text-slate-400 mt-1">Deep Study & Recall</p>
          <div className="w-full bg-slate-800 h-1 rounded-full mt-3 overflow-hidden">
            <div className="bg-purple-500 h-full rounded-full" style={{ width: `${Math.min(100, (studyMinutesToday / 150) * 100)}%` }} />
          </div>
        </div>

        {/* Workout Activity */}
        <div
          onClick={() => setActiveTab('workout')}
          className="group cursor-pointer p-4 sm:p-5 rounded-2xl bg-[#0e1526] border border-slate-800/80 hover:border-teal-500/40 transition-all duration-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-teal-950/60 border border-teal-800/40 flex items-center justify-center text-teal-400 group-hover:scale-105 transition">
              <Dumbbell className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-teal-400 bg-teal-950/40 px-2 py-0.5 rounded-md">
              Level: {profile.fitnessLevel}
            </span>
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">{workoutLogs.length} <span className="text-xs font-normal text-slate-400">sessions</span></p>
          <p className="text-xs text-slate-400 mt-1">Completed this week</p>
          <div className="w-full bg-slate-800 h-1 rounded-full mt-3 overflow-hidden">
            <div className="bg-teal-400 h-full rounded-full" style={{ width: `${Math.min(100, (workoutLogs.length / 4) * 100)}%` }} />
          </div>
        </div>

        {/* Meditation Minutes */}
        <div
          onClick={() => setActiveTab('meditation')}
          className="group cursor-pointer p-4 sm:p-5 rounded-2xl bg-[#0e1526] border border-slate-800/80 hover:border-indigo-500/40 transition-all duration-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-950/60 border border-indigo-800/40 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-indigo-400 bg-indigo-950/40 px-2 py-0.5 rounded-md">
              Mindfulness
            </span>
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">{meditationMinutesToday} <span className="text-xs font-normal text-slate-400">mins</span></p>
          <p className="text-xs text-slate-400 mt-1">Mental Calm & Breathwork</p>
          <div className="w-full bg-slate-800 h-1 rounded-full mt-3 overflow-hidden">
            <div className="bg-indigo-400 h-full rounded-full" style={{ width: `${Math.min(100, (meditationMinutesToday / 20) * 100)}%` }} />
          </div>
        </div>

        {/* Habits Consistency */}
        <div
          onClick={() => setActiveTab('habits')}
          className="group cursor-pointer p-4 sm:p-5 rounded-2xl bg-[#0e1526] border border-slate-800/80 hover:border-amber-500/40 transition-all duration-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-amber-950/60 border border-amber-800/40 flex items-center justify-center text-amber-400 group-hover:scale-105 transition">
              <Flame className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded-md">
              {completedHabitsToday}/{totalHabits} Done
            </span>
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">{habitCompletionRate}%</p>
          <p className="text-xs text-slate-400 mt-1">Habit Consistency</p>
          <div className="w-full bg-slate-800 h-1 rounded-full mt-3 overflow-hidden">
            <div className="bg-amber-400 h-full rounded-full" style={{ width: `${habitCompletionRate}%` }} />
          </div>
        </div>
      </div>

      {/* Main Grid: Next Activity & Today's Schedule + Deadlines & Sleep */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Next Activity & Today's Flow */}
        <div className="lg:col-span-2 space-y-6">
          {/* Next Upcoming Activity Card */}
          {upcomingBlock && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-[#0e1526] to-[#0e1526] border border-indigo-700/40 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold tracking-wider text-teal-400 uppercase flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Next Scheduled Activity
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-900/50 text-indigo-300 font-mono">
                  {upcomingBlock.startTime} - {upcomingBlock.endTime}
                </span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white">{upcomingBlock.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{upcomingBlock.notes || 'Prepared for steady focus'}</p>
                </div>
                <button
                  onClick={() => toggleCompleteBlock(upcomingBlock.id)}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    upcomingBlock.completed
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" /> {upcomingBlock.completed ? 'Completed' : 'Mark Done'}
                </button>
              </div>
            </div>
          )}

          {/* Today's Schedule Overview */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#0e1526] border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-white">Today's Schedule Flow</h2>
                <p className="text-xs text-slate-400">{completedBlocksCount} of {totalBlocksCount} blocks completed</p>
              </div>
              <button
                onClick={() => setActiveTab('planner')}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                Open Full Timeline <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {schedule.slice(0, 6).map((block) => (
                <div
                  key={block.id}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition ${
                    block.completed
                      ? 'bg-slate-900/30 border-slate-800/50 opacity-60'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleCompleteBlock(block.id)}
                      className={`w-5 h-5 rounded-md flex items-center justify-center transition ${
                        block.completed ? 'bg-teal-500 text-white' : 'border border-slate-600 hover:border-teal-400'
                      }`}
                    >
                      {block.completed && <CheckCircle2 className="w-4 h-4" />}
                    </button>
                    <div>
                      <p className={`text-xs font-semibold ${block.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                        {block.title}
                      </p>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {block.startTime} - {block.endTime}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-md font-medium uppercase ${
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
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Deadlines, Sleep Status, Quick Mood */}
        <div className="space-y-6">
          {/* Quick Mood & Energy Check-in */}
          <div className="p-5 rounded-2xl bg-[#0e1526] border border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
              <Smile className="w-4 h-4 text-teal-400" /> How are you feeling right now?
            </h3>
            <p className="text-xs text-slate-400 mb-3">Checking in calibrates your daily energy curve.</p>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'focused', label: 'Focused', emoji: '🎯', energy: 8 },
                { id: 'joyful', label: 'Energized', emoji: '⚡', energy: 9 },
                { id: 'calm', label: 'Calm', emoji: '🌿', energy: 7 },
                { id: 'stressed', label: 'Overwhelmed', emoji: '😮‍💨', energy: 4 },
              ].map(({ id, label, emoji, energy }) => (
                <button
                  key={id}
                  onClick={() => {
                    setQuickMood(id as 'focused' | 'joyful' | 'calm' | 'stressed');
                    logMoodEnergy(id as 'focused' | 'joyful' | 'calm' | 'stressed', energy, ['Quick check-in']);
                  }}
                  className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                    quickMood === id
                      ? 'border-teal-400 bg-teal-950/50 text-white'
                      : 'border-slate-800 bg-slate-900/50 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="text-lg">{emoji}</span>
                  <span className="text-[10px] font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sleep & Rest Opportunity */}
          <div className="p-5 rounded-2xl bg-[#0e1526] border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Moon className="w-4 h-4 text-blue-400" /> Planned Sleep Target
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-md bg-blue-950 text-blue-300 font-semibold">
                8.0 Hours
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Bedtime: <span className="font-mono text-slate-200">{profile.bedTime}</span> • Wake: <span className="font-mono text-slate-200">{profile.wakeTime}</span>
            </p>
            <div className="p-3 bg-blue-950/20 border border-blue-900/40 rounded-xl text-xs text-blue-200/90 leading-relaxed">
              🌙 Digital sunset starts at <strong className="text-white">22:15</strong>. Protecting 8 hours of sleep solidifies hippocampal memory pathways formed during today's study.
            </div>
            <button
              onClick={() => setActiveTab('sleep')}
              className="w-full mt-3 py-2 text-xs font-semibold text-center text-blue-400 hover:text-blue-300 transition"
            >
              Sleep & Wind-Down Protocol →
            </button>
          </div>

          {/* Upcoming Assignments / Deadlines */}
          <div className="p-5 rounded-2xl bg-[#0e1526] border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-purple-400" /> Upcoming Deadlines
              </h3>
              <button
                onClick={() => setActiveTab('study')}
                className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
              >
                View All
              </button>
            </div>

            <div className="space-y-2">
              {urgentAssignments.map((a) => (
                <div key={a.id} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-white">{a.title}</p>
                    <p className="text-[10px] text-slate-400">{a.subject} • Due {a.dueDate}</p>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                    a.priority === 'high' ? 'bg-rose-950 text-rose-300 border border-rose-800/40' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {a.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
