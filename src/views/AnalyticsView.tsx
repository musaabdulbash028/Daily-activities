import React from 'react';
import { useLifeOS } from '../context/LifeOSContext';
import {
  BarChart3,
  TrendingUp,
  Sparkles,
  GraduationCap,
  Dumbbell,
  Moon,
  Flame,
  Award,
  Calendar,
  CheckCircle2,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const {
    subjects,
    habits,
    studyMinutesToday,
    meditationMinutesToday,
    workoutLogs,
    sleepLogs,
  } = useLifeOS();

  // Weekly study hours breakdown by subject
  const subjectStudyData = subjects.map((sub, idx) => {
    const hours = (sub.progress / 20) + (idx === 0 ? 3.5 : idx === 1 ? 2.5 : 1.8);
    return { name: sub.name, color: sub.color, hours: Math.round(hours * 10) / 10 };
  });

  const maxHours = Math.max(...subjectStudyData.map((s) => s.hours), 5);

  // Weekly habit completion mock rates for 7 days
  const weeklyHabitRates = [
    { day: 'Mon', rate: 85 },
    { day: 'Tue', rate: 100 },
    { day: 'Wed', rate: 75 },
    { day: 'Thu', rate: 90 },
    { day: 'Fri', rate: 80 },
    { day: 'Sat', rate: 70 },
    { day: 'Sun', rate: 85 },
  ];

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0e1526] border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-purple-950 text-purple-400 border border-purple-800/40">
              <BarChart3 className="w-4 h-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Progress & Weekly Analytics</h1>
          </div>
          <p className="text-xs text-slate-400">
            A comprehensive, guilt-free overview of your consistency, study stamina, and physical restoration.
          </p>
        </div>
      </div>

      {/* Constructive Weekly Insight Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/70 via-purple-950/40 to-[#0e1526] border border-indigo-800/40 flex items-start gap-4 text-xs text-slate-300">
        <Sparkles className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-white text-sm block">Weekly Optimization Insight</strong>
          <p className="leading-relaxed">
            Your highest focus was logged on mornings following a completed wind-down routine and 8+ hours of sleep opportunity. You completed <strong>{workoutLogs.length} safe movement sessions</strong> and sustained study momentum without burnout.
          </p>
        </div>
      </div>

      {/* Top Level Metric Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0e1526] border border-slate-800">
          <div className="flex items-center gap-2 text-purple-400 mb-2">
            <GraduationCap className="w-4 h-4" />
            <span className="text-xs font-semibold">Study Logged</span>
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">{studyMinutesToday} <span className="text-xs font-normal text-slate-400">mins today</span></p>
          <span className="text-[11px] text-teal-400 mt-1 block">~12.5 hrs this week</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#0e1526] border border-slate-800">
          <div className="flex items-center gap-2 text-teal-400 mb-2">
            <Dumbbell className="w-4 h-4" />
            <span className="text-xs font-semibold">Movement</span>
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">{workoutLogs.length} <span className="text-xs font-normal text-slate-400">sessions</span></p>
          <span className="text-[11px] text-teal-400 mt-1 block">Consistent mobility & strength</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#0e1526] border border-slate-800">
          <div className="flex items-center gap-2 text-blue-400 mb-2">
            <Moon className="w-4 h-4" />
            <span className="text-xs font-semibold">Sleep Consistency</span>
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">8.1 <span className="text-xs font-normal text-slate-400">hrs avg</span></p>
          <span className="text-[11px] text-blue-400 mt-1 block">Target window protected</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#0e1526] border border-slate-800">
          <div className="flex items-center gap-2 text-amber-400 mb-2">
            <Flame className="w-4 h-4" />
            <span className="text-xs font-semibold">Habits Completed</span>
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">84%</p>
          <span className="text-[11px] text-amber-400 mt-1 block">Never miss twice principle</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Study Hours by Subject Bar Chart */}
        <div className="p-6 rounded-3xl bg-[#0e1526] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Study Hours by Subject (This Week)</h3>
            <span className="text-xs text-slate-400">Total: 12.5 hrs</span>
          </div>

          <div className="space-y-3 pt-2">
            {subjectStudyData.map((s, idx) => {
              const widthPct = (s.hours / maxHours) * 100;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-white">{s.name}</span>
                    <span className="font-mono text-slate-300">{s.hours} hrs</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${widthPct}%`, backgroundColor: s.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 7-Day Habit Completion Consistency Trend */}
        <div className="p-6 rounded-3xl bg-[#0e1526] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Daily Habit Completion Rate</h3>
            <span className="text-xs text-amber-400 font-mono">Avg: 83%</span>
          </div>

          {/* SVG / Flex Bar Chart */}
          <div className="flex items-end justify-between gap-3 h-44 pt-4 px-2">
            {weeklyHabitRates.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-[10px] font-mono text-slate-400">{item.rate}%</span>
                <div className="w-full bg-slate-800 rounded-t-lg overflow-hidden flex flex-col justify-end" style={{ height: '110px' }}>
                  <div
                    className="w-full bg-gradient-to-t from-amber-500 to-teal-400 rounded-t-lg transition-all duration-700"
                    style={{ height: `${(item.rate / 100) * 110}px` }}
                  />
                </div>
                <span className="text-[11px] font-medium text-slate-400">{item.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
