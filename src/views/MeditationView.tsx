import React, { useState, useEffect } from 'react';
import { useLifeOS } from '../context/LifeOSContext';
import { sound } from '../utils/audioService';
import {
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Heart,
  Wind,
  Smile,
  Shield,
  Activity,
  CheckCircle2,
  BookOpen,
  CloudRain,
  Waves,
} from 'lucide-react';

export const MeditationView: React.FC = () => {
  const {
    meditationMinutesToday,
    addMeditationMinutes,
    logMoodEnergy,
    moodLogs,
    addJournalEntry,
  } = useLifeOS();

  const [activeTab, setActiveTab] = useState<'breathing' | 'timer' | 'grounding' | 'stretching' | 'journal'>('breathing');

  // Guided Breathing Animation State
  const [breathingPattern, setBreathingPattern] = useState<'box' | '478' | 'calm' | 'energy'>('box');
  const [breathingPhase, setBreathingPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Pause'>('Inhale');
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState<number>(4);
  const [isBreathingRunning, setIsBreathingRunning] = useState<boolean>(false);

  // Meditation Timer State
  const [timerDurationMins, setTimerDurationMins] = useState<number>(10);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(10 * 60);
  const [isMeditationTimerRunning, setIsMeditationTimerRunning] = useState<boolean>(false);

  // Ambient sound state
  const [ambientType, setAmbientType] = useState<'rain' | 'waves' | 'whitenoise' | null>(null);

  // Grounding 5-4-3-2-1 state
  const [groundingStep, setGroundingStep] = useState<number>(5);

  // Journaling state
  const [journalPrompt, setJournalPrompt] = useState<string>('What is one small moment of peace or gratitude you noticed today?');
  const [journalText, setJournalText] = useState<string>('');
  const [journalGratitude, setJournalGratitude] = useState<string>('');
  const [journalSaved, setJournalSaved] = useState<boolean>(false);

  // Breathing Engine Effect
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (isBreathingRunning) {
      timer = setInterval(() => {
        setPhaseSecondsLeft((prev) => {
          if (prev > 1) return prev - 1;

          // Transition to next phase
          if (breathingPattern === 'box') {
            // Box 4-4-4-4
            if (breathingPhase === 'Inhale') {
              setBreathingPhase('Hold');
              return 4;
            } else if (breathingPhase === 'Hold') {
              setBreathingPhase('Exhale');
              return 4;
            } else if (breathingPhase === 'Exhale') {
              setBreathingPhase('Pause');
              return 4;
            } else {
              setBreathingPhase('Inhale');
              return 4;
            }
          } else if (breathingPattern === '478') {
            // 4-7-8
            if (breathingPhase === 'Inhale') {
              setBreathingPhase('Hold');
              return 7;
            } else if (breathingPhase === 'Hold') {
              setBreathingPhase('Exhale');
              return 8;
            } else {
              setBreathingPhase('Inhale');
              return 4;
            }
          } else if (breathingPattern === 'energy') {
            // 4-2-4
            if (breathingPhase === 'Inhale') {
              setBreathingPhase('Hold');
              return 2;
            } else if (breathingPhase === 'Hold') {
              setBreathingPhase('Exhale');
              return 4;
            } else {
              setBreathingPhase('Inhale');
              return 4;
            }
          } else {
            // Calm 5-5
            if (breathingPhase === 'Inhale') {
              setBreathingPhase('Exhale');
              return 5;
            } else {
              setBreathingPhase('Inhale');
              return 5;
            }
          }
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isBreathingRunning, breathingPhase, breathingPattern]);

  // Meditation Timer Effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isMeditationTimerRunning && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (timerSecondsLeft === 0 && isMeditationTimerRunning) {
      sound.playBowl(5);
      addMeditationMinutes(timerDurationMins);
      setIsMeditationTimerRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isMeditationTimerRunning, timerSecondsLeft, timerDurationMins]);

  const toggleAmbientSound = (type: 'rain' | 'waves' | 'whitenoise') => {
    if (ambientType === type) {
      sound.stopAmbient();
      setAmbientType(null);
    } else {
      sound.startAmbient(type, 0.2);
      setAmbientType(type);
    }
  };

  const startMeditationTimer = () => {
    if (!isMeditationTimerRunning) {
      sound.playBowl(3);
    }
    setIsMeditationTimerRunning(!isMeditationTimerRunning);
  };

  const resetMeditationTimer = () => {
    setIsMeditationTimerRunning(false);
    setTimerSecondsLeft(timerDurationMins * 60);
  };

  const handleSaveJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalText.trim()) return;
    addJournalEntry({
      date: new Date().toISOString().split('T')[0],
      prompt: journalPrompt,
      content: journalText.trim(),
      gratitude: journalGratitude ? journalGratitude.split(',').map((g) => g.trim()) : [],
    });
    setJournalSaved(true);
    setTimeout(() => setJournalSaved(false), 3000);
    setJournalText('');
    setJournalGratitude('');
  };

  const timerMins = Math.floor(timerSecondsLeft / 60);
  const timerSecs = timerSecondsLeft % 60;
  const timerStr = `${String(timerMins).padStart(2, '0')}:${String(timerSecs).padStart(2, '0')}`;

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0e1526] border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-indigo-950 text-indigo-400 border border-indigo-800/40">
              <Sparkles className="w-4 h-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Meditation & Mental Wellness</h1>
          </div>
          <p className="text-xs text-slate-400">
            Regulate your autonomic nervous system through paced breathing, mindfulness, and gentle mobility.
          </p>
        </div>

        {/* Ambient Noise Selector */}
        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
          <Volume2 className="w-4 h-4 text-teal-400 ml-1.5" />
          {[
            { id: 'rain', label: 'Rain', icon: CloudRain },
            { id: 'waves', label: 'Ocean', icon: Waves },
            { id: 'whitenoise', label: 'White Noise', icon: Wind },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => toggleAmbientSound(id as 'rain' | 'waves' | 'whitenoise')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-medium transition ${
                ambientType === id
                  ? 'bg-teal-950 text-teal-300 border border-teal-800/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" /> {label}
            </button>
          ))}
          {ambientType && (
            <button
              onClick={() => {
                sound.stopAmbient();
                setAmbientType(null);
              }}
              className="p-1 text-rose-400 hover:bg-rose-950/40 rounded-lg"
              title="Stop sound"
            >
              <VolumeX className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Wellness & Mental Health Disclaimer */}
      <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 flex items-start gap-3 text-xs text-slate-400">
        <Shield className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <p>
          <strong className="text-slate-300">Wellness Notice:</strong> All exercises and relaxation sessions are voluntary tools to assist daily stress management. LifeOS is not a healthcare provider or a replacement for professional mental health counseling.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {[
          { id: 'breathing', label: 'Guided Breathing', icon: Wind },
          { id: 'timer', label: 'Meditation Timer', icon: Sparkles },
          { id: 'grounding', label: '5-4-3-2-1 Grounding', icon: Heart },
          { id: 'stretching', label: 'Gentle Desk Stretches', icon: Activity },
          { id: 'journal', label: 'Reflective Journal', icon: BookOpen },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as typeof activeTab)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
              activeTab === id
                ? 'border-indigo-500 bg-indigo-950/70 text-indigo-200'
                : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className="w-3.5 h-3.5" /> {label}
          </button>
        ))}
      </div>

      {/* TAB 1: GUIDED BREATHING CIRCLE */}
      {activeTab === 'breathing' && (
        <div className="p-8 sm:p-12 rounded-3xl bg-[#0e1526] border border-slate-800 flex flex-col items-center justify-center text-center space-y-8 max-w-2xl mx-auto">
          {/* Pattern Selector */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'box', label: 'Box Breathing (4-4-4-4)', desc: 'Stress reduction & mental clarity' },
              { id: '478', label: '4-7-8 Relaxing Breath', desc: 'Pre-sleep calming & anxiety relief' },
              { id: 'calm', label: 'Coherent 5-5 Breath', desc: 'Heart rate variability balance' },
              { id: 'energy', label: 'Energizing 4-2-4', desc: 'Morning alertness' },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => {
                  setBreathingPattern(id as typeof breathingPattern);
                  setBreathingPhase('Inhale');
                  setPhaseSecondsLeft(4);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                  breathingPattern === id
                    ? 'border-teal-400 bg-teal-950/60 text-teal-200'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Animated Visual Breathing Sphere */}
          <div className="relative flex items-center justify-center w-64 h-64 my-4">
            {/* Outer Glow Halo */}
            <div
              className={`absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500/20 to-teal-400/20 blur-2xl transition-all duration-1000 ${
                breathingPhase === 'Inhale' || breathingPhase === 'Hold' ? 'scale-125 opacity-100' : 'scale-90 opacity-40'
              }`}
            />

            {/* Inner Animated Pulsing Circle */}
            <div
              className={`w-44 h-44 rounded-full border-2 border-teal-400/50 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-950/70 to-teal-950/70 shadow-2xl transition-all duration-1000 ${
                breathingPhase === 'Inhale'
                  ? 'scale-110 shadow-teal-500/30'
                  : breathingPhase === 'Hold'
                  ? 'scale-110 shadow-indigo-500/30'
                  : 'scale-90 shadow-none'
              }`}
            >
              <span className="text-xl font-bold text-white tracking-wide">{breathingPhase}</span>
              <span className="text-4xl font-mono font-extrabold text-teal-300 mt-1">
                {phaseSecondsLeft}s
              </span>
            </div>
          </div>

          {/* Play/Pause */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (!isBreathingRunning) sound.playBowl(3);
                setIsBreathingRunning(!isBreathingRunning);
              }}
              className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-indigo-600 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 hover:scale-105 active:scale-95 transition"
            >
              {isBreathingRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              {isBreathingRunning ? 'Pause Breathing' : 'Start Paced Breathing'}
            </button>
            <button
              onClick={() => {
                setIsBreathingRunning(false);
                setBreathingPhase('Inhale');
                setPhaseSecondsLeft(4);
              }}
              className="p-3 rounded-2xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: MEDITATION TIMER */}
      {activeTab === 'timer' && (
        <div className="p-8 sm:p-12 rounded-3xl bg-[#0e1526] border border-slate-800 flex flex-col items-center justify-center text-center space-y-6 max-w-xl mx-auto">
          <div className="text-xs uppercase tracking-widest text-indigo-400 font-semibold">
            Tibetan Singing Bowl Meditation
          </div>

          {/* Time presets */}
          <div className="flex items-center gap-2">
            {[5, 10, 15, 20].map((mins) => (
              <button
                key={mins}
                onClick={() => {
                  setTimerDurationMins(mins);
                  setTimerSecondsLeft(mins * 60);
                  setIsMeditationTimerRunning(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                  timerDurationMins === mins
                    ? 'border-indigo-500 bg-indigo-950 text-indigo-200'
                    : 'border-slate-800 bg-slate-900 text-slate-400'
                }`}
              >
                {mins} mins
              </button>
            ))}
          </div>

          <div className="text-7xl font-mono font-bold text-white drop-shadow-xl">{timerStr}</div>

          <div className="flex items-center gap-3">
            <button
              onClick={startMeditationTimer}
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition active:scale-95"
            >
              {isMeditationTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              {isMeditationTimerRunning ? 'Pause Meditation' : 'Begin Meditation'}
            </button>
            <button
              onClick={resetMeditationTimer}
              className="p-3.5 rounded-2xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => sound.playBowl(4)}
            className="text-xs text-indigo-400 hover:text-indigo-300 underline underline-offset-4"
          >
            Preview Singing Bowl Chime 🔔
          </button>
        </div>
      )}

      {/* TAB 3: 5-4-3-2-1 GROUNDING */}
      {activeTab === 'grounding' && (
        <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-[#0e1526] border border-slate-800 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400" /> 5-4-3-2-1 Sensory Grounding Technique
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Engages your sensory cortex to quickly ground your awareness in the present moment when overwhelmed.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { num: 5, label: '5 things you can SEE', desc: 'Look around and notice 5 specific objects (e.g. a shadow, a grain on your desk, a leaf outside).' },
              { num: 4, label: '4 things you can physically FEEL', desc: 'Notice 4 physical textures (e.g. your feet on the floor, your shirt against your skin, the desk surface).' },
              { num: 3, label: '3 things you can HEAR', desc: 'Listen for 3 distinct sounds (e.g. distant traffic, clock ticking, the hum of air conditioning).' },
              { num: 2, label: '2 things you can SMELL', desc: 'Breathe in and identify 2 scents (e.g. coffee, fresh air, wood).' },
              { num: 1, label: '1 thing you can TASTE', desc: 'Notice the lingering taste of mint, tea, or take a refreshing sip of cool water.' },
            ].map(({ num, label, desc }) => (
              <div
                key={num}
                onClick={() => setGroundingStep(num)}
                className={`cursor-pointer p-4 rounded-2xl border transition ${
                  groundingStep === num
                    ? 'border-teal-500 bg-teal-950/40 shadow-sm'
                    : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3 mb-1">
                  <span className="w-6 h-6 rounded-lg bg-teal-950 text-teal-400 border border-teal-800/40 text-xs font-bold flex items-center justify-center">
                    {num}
                  </span>
                  <h4 className="text-xs font-bold text-white">{label}</h4>
                </div>
                <p className="text-xs text-slate-300 pl-9 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: GENTLE DESK STRETCHES */}
      {activeTab === 'stretching' && (
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="p-6 rounded-3xl bg-[#0e1526] border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-400" /> Gentle Desk Worker Stretching Breaks
            </h3>
            <p className="text-xs text-slate-400">
              Micro-breaks release muscular tension accumulated from prolonged screen focus and seated posture.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { title: 'Lateral Neck Release', dur: '30s each side', cue: 'Tilt ear gently toward shoulder. Place opposite hand behind back for gentle opening. Never pull or strain.' },
                { title: 'Seated Chest & Pec Opener', dur: '45 seconds', cue: 'Interlace fingers behind your lower back or hold the back of your chair. Gently squeeze shoulder blades together.' },
                { title: 'Seated Spinal Twist', dur: '30s each side', cue: 'Sit tall, place right hand on outer left thigh. Inhale to lengthen spine, exhale to gently rotate upper torso.' },
              ].map((st, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white">{st.title}</h4>
                    <span className="text-[10px] text-teal-400 font-mono">{st.dur}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{st.cue}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: REFLECTIVE JOURNAL */}
      {activeTab === 'journal' && (
        <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-[#0e1526] border border-slate-800 space-y-5">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" /> Evening Reflection & Gratitude
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Writing down your thoughts clears cognitive clutter before sleep.
            </p>
          </div>

          <div className="p-3.5 bg-indigo-950/40 border border-indigo-900/40 rounded-xl text-xs text-indigo-200">
            <strong>Today's Prompt:</strong> {journalPrompt}
          </div>

          <form onSubmit={handleSaveJournal} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Your Reflection</label>
              <textarea
                rows={4}
                required
                value={journalText}
                onChange={(e) => setJournalText(e.target.value)}
                placeholder="Write freely without judgment..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">3 Things You Are Grateful For (comma separated)</label>
              <input
                type="text"
                value={journalGratitude}
                onChange={(e) => setJournalGratitude(e.target.value)}
                placeholder="e.g. Morning coffee, warm shower, supportive text from friend"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              {journalSaved ? (
                <span className="text-xs text-teal-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Reflection saved!
                </span>
              ) : <div />}
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition"
              >
                Save Reflection Entry
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
