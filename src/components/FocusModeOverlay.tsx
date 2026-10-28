import React, { useState, useEffect } from 'react';
import { useLifeOS } from '../context/LifeOSContext';
import { sound } from '../utils/audioService';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
  CheckCircle,
  CloudRain,
  Waves,
  Wind,
  Maximize2,
} from 'lucide-react';

export const FocusModeOverlay: React.FC = () => {
  const { focusMode, setFocusMode, addStudyMinutes, tasks } = useLifeOS();
  const [secondsLeft, setSecondsLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [sessionType, setSessionType] = useState<'work' | 'break'>('work');
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [ambientSound, setAmbientSound] = useState<'rain' | 'waves' | 'whitenoise' | null>(null);

  // Default focus duration: 25m work, 5m break
  const workDuration = 25 * 60;
  const breakDuration = 5 * 60;

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      // Session finished
      if (sessionType === 'work') {
        sound.playChime(true);
        addStudyMinutes(25);
        setSessionType('break');
        setSecondsLeft(breakDuration);
      } else {
        sound.playChime(false);
        setSessionType('work');
        setSecondsLeft(workDuration);
      }
      setIsRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, secondsLeft, sessionType]);

  // Handle ambient sound toggle
  const toggleAmbient = (type: 'rain' | 'waves' | 'whitenoise') => {
    if (ambientSound === type) {
      sound.stopAmbient();
      setAmbientSound(null);
    } else {
      sound.startAmbient(type, 0.2);
      setAmbientSound(type);
    }
  };

  const handleClose = () => {
    sound.stopAmbient();
    setAmbientSound(null);
    setIsRunning(false);
    setFocusMode(false);
  };

  if (!focusMode) return null;

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const formatTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  const totalDuration = sessionType === 'work' ? workDuration : breakDuration;
  const progressPercent = ((totalDuration - secondsLeft) / totalDuration) * 100;

  const activeTask = tasks.find((t) => t.id === selectedTaskId);

  return (
    <div className="fixed inset-0 z-50 bg-[#060912] text-slate-100 flex flex-col justify-between p-6 sm:p-12 animate-fadeIn select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
            LifeOS • Distraction-Free Focus Space
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
              } else {
                document.exitFullscreen().catch(() => {});
              }
            }}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition"
            title="Toggle Browser Fullscreen"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
          <button
            onClick={handleClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-xs font-medium text-slate-300 hover:text-white border border-slate-700/50 transition"
          >
            <X className="w-4 h-4" /> Exit Focus Mode
          </button>
        </div>
      </div>

      {/* Main Focus Clock & Objective */}
      <div className="flex flex-col items-center justify-center max-w-xl mx-auto w-full text-center space-y-8 my-auto">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-800/40 text-indigo-300 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-teal-400" />
          {sessionType === 'work' ? 'Deep Work Interval (Active Recall)' : 'Restorative Break (Rest Eyes)'}
        </div>

        {/* Digital Giant Timer */}
        <div className="relative flex flex-col items-center justify-center">
          <div className="text-7xl sm:text-9xl font-mono font-bold tracking-tight text-white drop-shadow-2xl">
            {formatTime}
          </div>
          {/* Subtle Progress Bar */}
          <div className="w-64 sm:w-80 h-1.5 bg-slate-800 rounded-full mt-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-teal-400 transition-all duration-1000"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Selected Task Focus */}
        <div className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5 text-left">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Single Current Objective</span>
            {activeTask && (
              <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-900/40 text-indigo-300 border border-indigo-800/30">
                {activeTask.category}
              </span>
            )}
          </div>
          {tasks.length > 0 ? (
            <select
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-medium"
            >
              <option value="">Select a task to anchor your focus...</option>
              {tasks
                .filter((t) => !t.completed)
                .map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title} ({t.priority.toUpperCase()})
                  </option>
                ))}
            </select>
          ) : (
            <p className="text-sm text-slate-300">Deep Work & Study Session in progress</p>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              if (!isRunning) sound.playChime(false);
              setIsRunning(!isRunning);
            }}
            className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-teal-500 text-white font-semibold text-base shadow-xl shadow-indigo-500/20 hover:scale-105 active:scale-95 transition"
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5" /> Pause
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" /> Start Deep Focus
              </>
            )}
          </button>
          <button
            onClick={() => {
              setIsRunning(false);
              setSecondsLeft(sessionType === 'work' ? workDuration : breakDuration);
            }}
            className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
            title="Reset timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom Ambient Noise Soundboard */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800/60 max-w-4xl mx-auto w-full">
        <span className="text-xs text-slate-400 flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-teal-400" /> Ambient Focus Soundscapes:
        </span>
        <div className="flex items-center gap-2">
          {[
            { id: 'rain', label: 'Rain', icon: CloudRain },
            { id: 'waves', label: 'Ocean', icon: Waves },
            { id: 'whitenoise', label: 'White Noise', icon: Wind },
          ].map(({ id, label, icon: Icon }) => {
            const active = ambientSound === id;
            return (
              <button
                key={id}
                onClick={() => toggleAmbient(id as 'rain' | 'waves' | 'whitenoise')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                  active
                    ? 'border-teal-500 bg-teal-950/60 text-teal-200'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" /> {label}
              </button>
            );
          })}
          {ambientSound && (
            <button
              onClick={() => {
                sound.stopAmbient();
                setAmbientSound(null);
              }}
              className="p-1.5 text-rose-400 hover:bg-rose-950/40 rounded-lg transition"
              title="Stop sound"
            >
              <VolumeX className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
