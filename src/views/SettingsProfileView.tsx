import React, { useState, useRef } from 'react';
import { useLifeOS } from '../context/LifeOSContext';
import {
  Settings,
  User,
  Download,
  Upload,
  RotateCcw,
  Sun,
  Moon,
  Sparkles,
  Terminal,
  CheckCircle2,
  AlertTriangle,
  Info,
  Shield,
  FileCode,
} from 'lucide-react';

export const SettingsProfileView: React.FC = () => {
  const {
    profile,
    updateProfile,
    theme,
    toggleTheme,
    setOnboardingOpen,
    exportDataJSON,
    importDataJSON,
    resetToSampleData,
  } = useLifeOS();

  const [name, setName] = useState(profile.name);
  const [wakeTime, setWakeTime] = useState(profile.wakeTime);
  const [bedTime, setBedTime] = useState(profile.bedTime);
  const [studyHours, setStudyHours] = useState(profile.studyHoursPreference);
  const [fitnessLevel, setFitnessLevel] = useState(profile.fitnessLevel);
  const [equipment, setEquipment] = useState(profile.equipment);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim(),
      wakeTime,
      bedTime,
      studyHoursPreference: studyHours,
      fitnessLevel,
      equipment,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleExport = () => {
    const jsonStr = exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lifeos-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importDataJSON(content);
      if (success) {
        setImportStatus('Backup successfully restored!');
        setTimeout(() => setImportStatus(null), 4000);
      } else {
        setImportStatus('Error: Invalid JSON backup file.');
        setTimeout(() => setImportStatus(null), 4000);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0e1526] border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-indigo-950 text-indigo-400 border border-indigo-800/40">
              <Settings className="w-4 h-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Settings & Profile</h1>
          </div>
          <p className="text-xs text-slate-400">
            Personalize your parameters, manage local data backups, and configure themes.
          </p>
        </div>

        <button
          onClick={() => setOnboardingOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition"
        >
          <Sparkles className="w-4 h-4" /> Re-launch Onboarding Wizard
        </button>
      </div>

      {/* Profile Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0e1526] border border-slate-800 space-y-5">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <User className="w-4 h-4 text-teal-400" /> User Profile & Daily Baselines
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Your Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Wake-Up Time</label>
              <input
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Target Bedtime</label>
              <input
                type="time"
                value={bedTime}
                onChange={(e) => setBedTime(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Study Hours Goal</label>
              <select
                value={studyHours}
                onChange={(e) => setStudyHours(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="1-2 hours">1-2 hours / day</option>
                <option value="2-3 hours">2-3 hours / day</option>
                <option value="3-4 hours">3-4 hours / day</option>
                <option value="4+ hours">4+ hours / day</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Fitness Experience</label>
              <select
                value={fitnessLevel}
                onChange={(e) => setFitnessLevel(e.target.value as typeof fitnessLevel)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="Beginner">Beginner (Safe mobility)</option>
                <option value="Intermediate">Intermediate (Consistent)</option>
                <option value="Advanced">Advanced (High intensity)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Available Equipment</label>
              <select
                value={equipment}
                onChange={(e) => setEquipment(e.target.value as typeof equipment)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="None (Bodyweight)">None (Bodyweight)</option>
                <option value="Dumbbells">Dumbbells</option>
                <option value="Full Gym">Full Gym</option>
                <option value="Resistance Bands">Resistance Bands</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {savedSuccess && (
              <span className="text-xs text-teal-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Profile updated successfully!
              </span>
            )}
            <button
              type="submit"
              className="ml-auto px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md transition"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>

      {/* Theme & Display */}
      <div className="p-6 rounded-3xl bg-[#0e1526] border border-slate-800 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-white">Appearance & Theme</h4>
          <p className="text-xs text-slate-400">Toggle between Dark Navy and Clean Light mode.</p>
        </div>

        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          <span>{theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
        </button>
      </div>

      {/* Data Management (Export & Import) */}
      <div className="p-6 rounded-3xl bg-[#0e1526] border border-slate-800 space-y-4">
        <div>
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <Download className="w-4 h-4 text-indigo-400" /> Complete Data Backup & Restore
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            LifeOS stores your schedule, habits, flashcards, and notes locally in your browser. Export anytime to back up or transfer between devices.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition"
          >
            <Download className="w-4 h-4" /> Export All Data (.JSON)
          </button>

          <input
            type="file"
            accept=".json"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
          >
            <Upload className="w-4 h-4" /> Import Backup (.JSON)
          </button>

          <button
            onClick={() => {
              if (window.confirm('Reset all schedule, habits, and study data to default starter sample?')) {
                resetToSampleData();
              }
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 text-xs font-semibold transition ml-auto"
          >
            <RotateCcw className="w-4 h-4" /> Reset to Starter Sample
          </button>
        </div>

        {importStatus && (
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs font-medium text-teal-300">
            {importStatus}
          </div>
        )}
      </div>

      {/* Local Setup & Deployment Guide */}
      <div className="p-6 rounded-3xl bg-[#0e1526] border border-slate-800 space-y-4">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <Terminal className="w-4 h-4 text-teal-400" /> Windows / VS Code Local Development Guide
        </h4>
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-mono">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[11px]"># 1. Clone or extract project folder, then open in VS Code</span>
            <p className="text-teal-300">npm install</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[11px]"># 2. Add Gemini API Key to .env (Optional; demo mode operates offline)</span>
            <p className="text-indigo-300">GEMINI_API_KEY="YOUR_KEY_HERE"</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[11px]"># 3. Start full-stack development server (Express + Vite)</span>
            <p className="text-teal-300">npm run dev</p>
            <span className="text-slate-400 text-[11px] block mt-1">Visit http://localhost:3000 in your browser</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[11px]"># 4. Production build</span>
            <p className="text-teal-300">npm run build && npm run start</p>
          </div>
        </div>
      </div>
    </div>
  );
};
