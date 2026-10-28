import React, { useState, useEffect } from 'react';
import { useLifeOS } from '../context/LifeOSContext';
import { WorkoutRoutine } from '../types';
import { sound } from '../utils/audioService';
import {
  Dumbbell,
  ShieldCheck,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Flame,
  CheckCircle2,
  Heart,
  AlertTriangle,
  ChevronRight,
  Filter,
  Check,
  Activity,
} from 'lucide-react';

export const WorkoutPlannerView: React.FC = () => {
  const { workouts, workoutLogs, logCompletedWorkout, profile } = useLifeOS();

  const [selectedRoutine, setSelectedRoutine] = useState<WorkoutRoutine>(workouts[0]);
  const [levelFilter, setLevelFilter] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All');
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Strength' | 'Mobility' | 'Cardio'>('All');

  // Interactive Workout Timer & Rest Timer
  const [activeTimerSeconds, setActiveTimerSeconds] = useState<number>(45);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [timerMode, setTimerMode] = useState<'work' | 'rest'>('work');
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState<number>(0);

  // Log completion modal / prompt
  const [showLogModal, setShowLogModal] = useState<boolean>(false);
  const [loggedFeeling, setLoggedFeeling] = useState<'great' | 'good' | 'tired' | 'challenging'>('great');
  const [loggedNotes, setLoggedNotes] = useState<string>('');

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (timerRunning && activeTimerSeconds > 0) {
      interval = setInterval(() => {
        setActiveTimerSeconds((prev) => {
          if (prev <= 4 && prev > 1) {
            sound.playBeep(false);
          } else if (prev === 1) {
            sound.playBeep(true);
          }
          return prev - 1;
        });
      }, 1000);
    } else if (activeTimerSeconds === 0) {
      if (timerMode === 'work') {
        setTimerMode('rest');
        setActiveTimerSeconds(30); // 30 second rest
      } else {
        setTimerMode('work');
        setActiveTimerSeconds(45); // Next 45s work set
        if (selectedExerciseIndex < selectedRoutine.exercises.length - 1) {
          setSelectedExerciseIndex((idx) => idx + 1);
        }
      }
      setTimerRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, activeTimerSeconds, timerMode, selectedExerciseIndex, selectedRoutine]);

  const filteredWorkouts = workouts.filter((w) => {
    const matchLevel = levelFilter === 'All' ? true : w.level === levelFilter;
    const matchCategory = categoryFilter === 'All' ? true : w.category === categoryFilter;
    return matchLevel && matchCategory;
  });

  const handleFinishRoutine = () => {
    logCompletedWorkout({
      date: new Date().toISOString().split('T')[0],
      routineTitle: selectedRoutine.title,
      durationMinutes: selectedRoutine.durationMinutes,
      feeling: loggedFeeling,
      notes: loggedNotes || 'Great mobility and muscle engagement.',
    });
    setShowLogModal(false);
    setTimerRunning(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0e1526] border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-teal-950 text-teal-400 border border-teal-800/40">
              <Dumbbell className="w-4 h-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Smart Workout Planner</h1>
          </div>
          <p className="text-xs text-slate-400">
            Safe, evidence-based physical movement. Emphasizes joint health, functional strength, posture, and stamina over extremes.
          </p>
        </div>

        {/* Safety First Badge */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-teal-950/50 border border-teal-800/40 text-teal-300 text-xs font-medium">
          <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
          <span>Injury prevention & form cues on every set</span>
        </div>
      </div>

      {/* Safety & Health Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-3 text-xs text-slate-400">
        <Heart className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
        <p>
          <strong className="text-slate-300">Safety First:</strong> If you feel sharp pain, dizziness, or unusual discomfort, stop immediately. Rest days are when your body rebuilds and strengthens—never sacrifice sleep or recovery for an extra workout.
        </p>
      </div>

      {/* Filters & Routine Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs text-slate-400 font-medium">Level:</span>
          {(['All', 'Beginner', 'Intermediate'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevelFilter(lvl)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
                levelFilter === lvl
                  ? 'border-teal-500 bg-teal-950/60 text-teal-200'
                  : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:text-slate-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs text-slate-400 font-medium">Category:</span>
          {(['All', 'Strength', 'Mobility', 'Cardio'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
                categoryFilter === cat
                  ? 'border-teal-500 bg-teal-950/60 text-teal-200'
                  : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Routine Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredWorkouts.map((routine) => {
          const isSelected = selectedRoutine.id === routine.id;
          return (
            <div
              key={routine.id}
              onClick={() => {
                setSelectedRoutine(routine);
                setSelectedExerciseIndex(0);
                setActiveTimerSeconds(45);
                setTimerRunning(false);
              }}
              className={`cursor-pointer p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'bg-gradient-to-br from-teal-950/40 via-[#0e1526] to-[#0e1526] border-teal-500/60 shadow-lg'
                  : 'bg-[#0e1526] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-teal-950 text-teal-300 border border-teal-800/40 font-semibold uppercase">
                    {routine.category}
                  </span>
                  <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {routine.durationMinutes}m
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white leading-snug">{routine.title}</h3>
                <p className="text-xs text-slate-400 mt-1">Level: {routine.level} • {routine.equipment}</p>
              </div>

              <div className="text-[11px] text-teal-400 font-semibold flex items-center gap-1 pt-2 border-t border-slate-800/60">
                {isSelected ? 'Currently Selected Routine' : 'Select Routine →'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Routine Detail & Interactive Timer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Warm-up, Exercises with form cues, Cooldown */}
        <div className="lg:col-span-2 space-y-5">
          {/* Warm-Up Section */}
          <div className="p-5 rounded-2xl bg-[#0e1526] border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-2">
              <Activity className="w-4 h-4" /> 1. Dynamic Warm-Up (Essential for joint lubrication)
            </h4>
            <div className="space-y-1.5 text-xs text-slate-300 pt-1">
              {selectedRoutine.warmUp.map((w, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                  <span>{w}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Exercises List with safety cues */}
          <div className="p-6 rounded-3xl bg-[#0e1526] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white">2. Exercise Flow & Form Cues</h4>
              <span className="text-xs text-slate-400">{selectedRoutine.exercises.length} Exercises</span>
            </div>

            <div className="space-y-3">
              {selectedRoutine.exercises.map((ex, idx) => {
                const isActive = selectedExerciseIndex === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedExerciseIndex(idx);
                      setActiveTimerSeconds(45);
                    }}
                    className={`cursor-pointer p-4 rounded-xl border transition ${
                      isActive
                        ? 'border-teal-500 bg-teal-950/30'
                        : 'border-slate-800/80 bg-slate-900/50 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-teal-950 text-teal-400 border border-teal-800/40 text-[11px] font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <h5 className="text-xs font-bold text-white">{ex.name}</h5>
                      </div>
                      <span className="text-[11px] font-mono text-teal-300 font-semibold">
                        {ex.sets} • {ex.repsOrDuration}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed pl-7">{ex.instruction}</p>

                    <div className="mt-2 pl-7 flex flex-wrap items-center gap-3 text-[11px]">
                      <span className="text-rose-300 flex items-center gap-1 font-medium">
                        <AlertTriangle className="w-3 h-3 text-rose-400" /> {ex.safetyCue}
                      </span>
                      <span className="text-slate-400">• Target: {ex.targetMuscle}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cool Down Section */}
          <div className="p-5 rounded-2xl bg-[#0e1526] border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> 3. Cool-Down & Parasympathetic Reset
            </h4>
            <div className="space-y-1.5 text-xs text-slate-300 pt-1">
              {selectedRoutine.coolDown.map((c, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Workout & Rest Interval Timer */}
        <div className="space-y-5">
          <div className="p-6 rounded-3xl bg-[#0e1526] border border-slate-800 text-center space-y-5 sticky top-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950/60 border border-teal-800/40 text-teal-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              {timerMode === 'work' ? 'Active Exercise Set' : 'Rest Interval'}
            </div>

            <div>
              <p className="text-xs text-slate-400">Current Movement:</p>
              <h4 className="text-sm font-bold text-white mt-0.5">
                {selectedRoutine.exercises[selectedExerciseIndex]?.name || 'Routine Set'}
              </h4>
            </div>

            <div className="text-6xl font-mono font-bold text-white">
              00:{String(activeTimerSeconds).padStart(2, '0')}
            </div>

            {/* Timer Controls */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setTimerRunning(!timerRunning)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 transition active:scale-95"
              >
                {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                {timerRunning ? 'Pause Set' : 'Start Set Timer'}
              </button>

              <button
                onClick={() => {
                  setTimerRunning(false);
                  setActiveTimerSeconds(timerMode === 'work' ? 45 : 30);
                }}
                className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
                title="Reset timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setShowLogModal(true)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-md"
            >
              Log Routine as Complete
            </button>
          </div>

          {/* Past Workout Consistency Log */}
          <div className="p-5 rounded-2xl bg-[#0e1526] border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Weekly Consistency Log</h4>
            <div className="space-y-2">
              {workoutLogs.map((log) => (
                <div key={log.id} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">{log.routineTitle}</p>
                    <span className="text-[10px] text-slate-400">{log.date} • {log.durationMinutes} mins</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-teal-950 text-teal-300 capitalize">
                    {log.feeling}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#0e1526] rounded-2xl border border-slate-700 p-6 text-slate-100 space-y-4">
            <h4 className="text-base font-bold text-white">Log Completed Workout</h4>
            <p className="text-xs text-slate-400">Awesome job honoring your body with safe, intentional movement!</p>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">How did you feel?</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'great', label: 'Energized' },
                  { id: 'good', label: 'Good' },
                  { id: 'tired', label: 'Tired' },
                  { id: 'challenging', label: 'Challenging' },
                ].map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => setLoggedFeeling(id as typeof loggedFeeling)}
                    className={`py-2 rounded-xl text-xs font-medium border transition ${
                      loggedFeeling === id
                        ? 'border-teal-400 bg-teal-950/60 text-teal-200'
                        : 'border-slate-800 bg-slate-900 text-slate-400'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Notes / Reflection (optional)</label>
              <input
                type="text"
                placeholder="e.g. Great posture, focused on deep breathing"
                value={loggedNotes}
                onChange={(e) => setLoggedNotes(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button onClick={() => setShowLogModal(false)} className="px-3 py-1.5 text-xs text-slate-400 hover:text-white">
                Cancel
              </button>
              <button
                onClick={handleFinishRoutine}
                className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs"
              >
                Save Workout Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
