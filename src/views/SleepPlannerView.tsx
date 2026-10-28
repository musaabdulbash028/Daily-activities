import React, { useState } from 'react';
import { useLifeOS } from '../context/LifeOSContext';
import {
  Moon,
  Sun,
  Shield,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Info,
  Calendar,
  Check,
} from 'lucide-react';

export const SleepPlannerView: React.FC = () => {
  const { profile, updateProfile, sleepLogs, logSleep, schedule } = useLifeOS();

  const [wakeTime, setWakeTime] = useState(profile.wakeTime || '07:00');
  const [bedTime, setBedTime] = useState(profile.bedTime || '23:00');
  const [isTeenMode, setIsTeenMode] = useState(profile.isTeenOrStudent);

  // New sleep log modal
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [actualBed, setActualBed] = useState('23:00');
  const [actualWake, setActualWake] = useState('07:00');
  const [quality, setQuality] = useState(4);
  const [sleepNotes, setSleepNotes] = useState('');

  // Calculate planned sleep opportunity in hours and minutes
  const calculateSleepDuration = (start: string, end: string) => {
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);

    let diffMinutes = endH * 60 + endM - (startH * 60 + startM);
    if (diffMinutes < 0) {
      diffMinutes += 24 * 60; // Crosses midnight
    }
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    return { hours, minutes, totalHours: diffMinutes / 60 };
  };

  const sleepCalc = calculateSleepDuration(bedTime, wakeTime);

  // Check if any schedule block extends past bedtime
  const lateNightConflicts = schedule.filter((b) => {
    if (b.category === 'sleep') return false;
    // If block end time is past bedtime (e.g. 23:30 when bedtime is 23:00)
    return b.endTime > bedTime && b.startTime >= '20:00';
  });

  const handleUpdateScheduleTimes = () => {
    updateProfile({
      wakeTime,
      bedTime,
      isTeenOrStudent: isTeenMode,
    });
  };

  const handleSaveSleepLog = (e: React.FormEvent) => {
    e.preventDefault();
    logSleep({
      date: new Date().toISOString().split('T')[0],
      targetBedtime: bedTime,
      actualBedtime: actualBed,
      targetWakeTime: wakeTime,
      actualWakeTime: actualWake,
      qualityRating: quality,
      notes: sleepNotes,
      windDownCompleted: true,
    });
    setLogModalOpen(false);
    setSleepNotes('');
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0e1526] border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-blue-950 text-blue-400 border border-blue-800/40">
              <Moon className="w-4 h-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Sleep & Energy Planner</h1>
          </div>
          <p className="text-xs text-slate-400">
            Circadian synchronization, wind-down rituals, and protecting restorative sleep opportunity.
          </p>
        </div>

        <button
          onClick={() => setLogModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md transition"
        >
          <Moon className="w-4 h-4" /> Log Last Night's Sleep
        </button>
      </div>

      {/* Teen / Student Sleep Guideline Notice */}
      <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-800/40 flex items-start gap-3 text-xs text-blue-200/90 leading-relaxed">
        <Shield className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-white">Evidence-Based Sleep Standard:</strong> For adolescents, young adults, and university students, the National Sleep Foundation and American Academy of Pediatrics recommend <strong>8–10 hours of sleep per 24 hours</strong>. LifeOS will never suggest reducing sleep opportunity to squeeze in cramming or late-night workouts.
        </div>
      </div>

      {/* Late Night Conflicts Warning */}
      {lateNightConflicts.length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/50 flex items-center gap-3 text-xs text-rose-200">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>
            <strong>Schedule Warning:</strong> You have {lateNightConflicts.length} activity scheduled past your target bedtime ({bedTime}). Reschedule or shorten them to safeguard sleep!
          </span>
        </div>
      )}

      {/* Sleep Opportunity Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-[#0e1526] border border-slate-800 space-y-6">
          <h3 className="text-base font-bold text-white">Target Sleep Window Configuration</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <label className="block text-xs font-medium text-slate-300">Target Bedtime</label>
              <input
                type="time"
                value={bedTime}
                onChange={(e) => setBedTime(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-base focus:outline-none focus:border-blue-500"
              />
              <span className="text-[11px] text-slate-400 block">Wind-down begins 45 minutes prior.</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <label className="block text-xs font-medium text-slate-300">Target Wake-Up Time</label>
              <input
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-base focus:outline-none focus:border-blue-500"
              />
              <span className="text-[11px] text-slate-400 block">View natural sunlight within 30m.</span>
            </div>
          </div>

          {/* Student Toggle */}
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-white">Student / Teen Optimization Mode</p>
              <p className="text-[11px] text-slate-400">Prioritizes 8–10 hours sleep opportunity.</p>
            </div>
            <button
              onClick={() => setIsTeenMode(!isTeenMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isTeenMode ? 'bg-blue-600' : 'bg-slate-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  isTeenMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-slate-400">
              Calculated Sleep Opportunity: <strong className="text-teal-400 font-mono text-base">{sleepCalc.hours}h {sleepCalc.minutes}m</strong>
            </div>
            <button
              onClick={handleUpdateScheduleTimes}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md transition"
            >
              Save Sleep Targets
            </button>
          </div>
        </div>

        {/* Evening Wind-Down Checklist */}
        <div className="p-6 rounded-3xl bg-[#0e1526] border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" /> Evidence-Based Wind-Down
          </h3>
          <p className="text-xs text-slate-400">Step-by-step pre-sleep hygiene protocol:</p>

          <div className="space-y-2.5 text-xs text-slate-300">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2.5">
              <span className="font-mono text-blue-400 font-semibold shrink-0">T-60m</span>
              <div>
                <strong className="text-white block">Digital Sunset</strong>
                Put devices away or switch to warm amber night mode to protect melatonin secretion.
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2.5">
              <span className="font-mono text-blue-400 font-semibold shrink-0">T-45m</span>
              <div>
                <strong className="text-white block">Thermal Regulation</strong>
                Keep bedroom cool (~65–68°F / 18–20°C). A warm shower before bed promotes vasodilation and core body cooling.
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2.5">
              <span className="font-mono text-blue-400 font-semibold shrink-0">T-20m</span>
              <div>
                <strong className="text-white block">Cognitive Offloading</strong>
                Write down tomorrow's top 3 tasks or journal in LifeOS to prevent late-night rumination.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sleep Log History */}
      <div className="p-6 rounded-3xl bg-[#0e1526] border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white">Recent Sleep Consistency Log</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {sleepLogs.map((log) => (
            <div key={log.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">{log.date}</span>
                <span className="text-teal-400 font-mono">Rating: {log.qualityRating}/5 ⭐</span>
              </div>
              <p className="text-xs text-slate-300">
                Bed: <span className="font-mono text-slate-200">{log.actualBedtime}</span> • Wake: <span className="font-mono text-slate-200">{log.actualWakeTime}</span>
              </p>
              {log.notes && (
                <p className="text-[11px] text-slate-400 italic">"{log.notes}"</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Log Modal */}
      {logModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#0e1526] rounded-2xl border border-slate-700 p-6 text-slate-100 space-y-4">
            <h4 className="text-sm font-bold text-white">Log Last Night's Sleep</h4>

            <form onSubmit={handleSaveSleepLog} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Time to Sleep</label>
                  <input
                    type="time"
                    required
                    value={actualBed}
                    onChange={(e) => setActualBed(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Time Woke Up</label>
                  <input
                    type="time"
                    required
                    value={actualWake}
                    onChange={(e) => setActualWake(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Sleep Quality (1-5)</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setQuality(star)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                        quality >= star
                          ? 'border-blue-500 bg-blue-950/60 text-blue-300'
                          : 'border-slate-800 bg-slate-900 text-slate-500'
                      }`}
                    >
                      {star}★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Notes / Morning Energy</label>
                <input
                  type="text"
                  placeholder="e.g. Woke up refreshed, followed wind-down"
                  value={sleepNotes}
                  onChange={(e) => setSleepNotes(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button onClick={() => setLogModalOpen(false)} className="px-3 py-1.5 text-xs text-slate-400 hover:text-white">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs">
                  Save Sleep Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
