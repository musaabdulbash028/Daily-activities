import React, { useState } from 'react';
import { useLifeOS } from '../context/LifeOSContext';
import {
  Sparkles,
  Clock,
  Briefcase,
  GraduationCap,
  Dumbbell,
  Heart,
  ChevronRight,
  ChevronLeft,
  Check,
  X,
} from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const { profile, updateProfile, onboardingOpen, setOnboardingOpen } = useLifeOS();
  const [step, setStep] = useState<number>(1);

  // Local state initialized with profile
  const [wakeTime, setWakeTime] = useState(profile.wakeTime || '07:00');
  const [bedTime, setBedTime] = useState(profile.bedTime || '23:00');
  const [isTeenOrStudent, setIsTeenOrStudent] = useState(profile.isTeenOrStudent);
  const [studyHours, setStudyHours] = useState(profile.studyHoursPreference || '2.5 hours');
  const [fitnessLevel, setFitnessLevel] = useState(profile.fitnessLevel || 'Beginner');
  const [equipment, setEquipment] = useState(profile.equipment || 'None (Bodyweight)');
  const [selectedGoals, setSelectedGoals] = useState<string[]>(
    profile.goals.length ? profile.goals : ['Ace Upcoming Exams', 'Improve Sleep Quality', 'Daily 20m Movement']
  );
  const [meditationMinutes, setMeditationMinutes] = useState(profile.meditationMinutes || 10);
  const [breakDuration, setBreakDuration] = useState(profile.breakDuration || 10);

  if (!onboardingOpen) return null;

  const totalSteps = 4;

  const goalOptions = [
    'Ace Upcoming Exams',
    'Improve Sleep Quality',
    'Daily 20m Movement',
    'Consistent Morning Routine',
    'Reduce Stress & Overwhelm',
    'Master Active Recall',
    'Work-Life-Study Balance',
  ];

  const toggleGoal = (g: string) => {
    if (selectedGoals.includes(g)) {
      setSelectedGoals(selectedGoals.filter((item) => item !== g));
    } else {
      setSelectedGoals([...selectedGoals, g]);
    }
  };

  const handleFinish = () => {
    updateProfile({
      wakeTime,
      bedTime,
      isTeenOrStudent,
      studyHoursPreference: studyHours,
      fitnessLevel,
      equipment,
      goals: selectedGoals,
      meditationMinutes,
      breakDuration,
      onboardingCompleted: true,
    });
    setOnboardingOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0e1526] text-slate-100 rounded-2xl border border-indigo-900/50 shadow-2xl p-6 sm:p-8 overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-teal-400 flex items-center justify-center shadow-lg">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Personalize Your LifeOS</h2>
              <p className="text-xs text-slate-400">Step {step} of {totalSteps}</p>
            </div>
          </div>
          <button
            onClick={() => setOnboardingOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full my-6 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-teal-400 transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        {/* Step Content */}
        <div className="py-2 min-h-[300px]">
          {step === 1 && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-400" /> Sleep & Circadian Rhythms
                </h3>
                <p className="text-sm text-slate-400">
                  Protecting adequate sleep is non-negotiable for memory consolidation, focus, and physical recovery.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Typical Wake-Up Time</label>
                  <input
                    type="time"
                    value={wakeTime}
                    onChange={(e) => setWakeTime(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">Best followed by sunlight & hydration.</span>
                </div>

                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Target Bedtime</label>
                  <input
                    type="time"
                    value={bedTime}
                    onChange={(e) => setBedTime(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">Wind-down starts 45m before.</span>
                </div>
              </div>

              <div className="p-3.5 bg-indigo-950/40 rounded-xl border border-indigo-900/40 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-indigo-200">Are you a student or teenager?</p>
                  <p className="text-xs text-indigo-400/80">Recommends 8–10 hours sleep opportunity per 24h.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsTeenOrStudent(!isTeenOrStudent)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isTeenOrStudent ? 'bg-indigo-600' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      isTeenOrStudent ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-purple-400" /> Study & Focus Preferences
                </h3>
                <p className="text-sm text-slate-400">
                  We balance intensive study blocks with necessary cognitive breaks to prevent burnout.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">Preferred Daily Study Time</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['1-2 hours', '2-3 hours', '3-4 hours', '4+ hours'].map((hrs) => (
                    <button
                      key={hrs}
                      type="button"
                      onClick={() => setStudyHours(hrs)}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition ${
                        studyHours === hrs
                          ? 'border-purple-500 bg-purple-950/40 text-purple-200'
                          : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {hrs}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Preferred Break Duration</label>
                  <select
                    value={breakDuration}
                    onChange={(e) => setBreakDuration(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                  >
                    <option value={5}>5 minutes (Quick stretch & hydration)</option>
                    <option value={10}>10 minutes (Recommended Pomodoro)</option>
                    <option value={15}>15 minutes (Full reset & walk)</option>
                  </select>
                </div>

                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Daily Meditation Time</label>
                  <select
                    value={meditationMinutes}
                    onChange={(e) => setMeditationMinutes(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                  >
                    <option value={5}>5 minutes (Quick breath reset)</option>
                    <option value={10}>10 minutes (Balanced mindfulness)</option>
                    <option value={15}>15 minutes (Deep relaxation)</option>
                    <option value={20}>20 minutes (Full calm immersion)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <Dumbbell className="w-4 h-4 text-teal-400" /> Physical Fitness & Movement
                </h3>
                <p className="text-sm text-slate-400">
                  Physical activity increases brain-derived neurotrophic factor (BDNF), supporting learning and stamina.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">Fitness Experience</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setFitnessLevel(lvl)}
                      className={`py-3 px-3 rounded-xl border text-center transition ${
                        fitnessLevel === lvl
                          ? 'border-teal-500 bg-teal-950/40 text-teal-200'
                          : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <p className="text-xs font-semibold">{lvl}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {lvl === 'Beginner' ? 'Safe bodyweight & form' : lvl === 'Intermediate' ? 'Consistent flow' : 'Challenging'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">Available Equipment</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['None (Bodyweight)', 'Dumbbells', 'Full Gym', 'Resistance Bands'] as const).map((eq) => (
                    <button
                      key={eq}
                      type="button"
                      onClick={() => setEquipment(eq)}
                      className={`py-2.5 px-3 rounded-xl border text-left text-xs font-medium transition ${
                        equipment === eq
                          ? 'border-teal-500 bg-teal-950/40 text-teal-200'
                          : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {eq}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-400" /> Main Goals & Priorities
                </h3>
                <p className="text-sm text-slate-400">
                  Select what you want LifeOS to optimize for your daily flow.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                {goalOptions.map((g) => {
                  const active = selectedGoals.includes(g);
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => toggleGoal(g)}
                      className={`p-3 rounded-xl border text-left text-xs font-medium transition flex items-center justify-between ${
                        active
                          ? 'border-indigo-500 bg-indigo-950/50 text-indigo-200'
                          : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span>{g}</span>
                      {active && <Check className="w-4 h-4 text-indigo-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-800 text-xs text-slate-400">
                💡 <span className="text-slate-300 font-medium">All settings can be customized anytime</span> in the Settings & Profile view. LifeOS adapts to your schedule, never the other way around.
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-5 border-t border-slate-800 mt-4">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 transition"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setOnboardingOpen(false)}
              className="text-xs text-slate-500 hover:text-slate-300 transition"
            >
              Skip for now
            </button>
          )}

          {step < totalSteps ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-500 to-teal-400 text-white shadow-lg shadow-indigo-500/25 hover:opacity-95 transition"
            >
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-teal-400 text-white shadow-lg shadow-teal-500/25 hover:opacity-95 transition"
            >
              Complete Setup & Enter LifeOS <Check className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
