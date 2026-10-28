/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LifeOSProvider, useLifeOS } from './context/LifeOSContext';
import { Navigation, ActiveTab } from './components/Navigation';
import { FocusModeOverlay } from './components/FocusModeOverlay';
import { OnboardingModal } from './components/OnboardingModal';

// Views
import { DashboardView } from './views/DashboardView';
import { PlannerView } from './views/PlannerView';
import { StudyCoachView } from './views/StudyCoachView';
import { WorkoutPlannerView } from './views/WorkoutPlannerView';
import { MeditationView } from './views/MeditationView';
import { BrainPerformanceView } from './views/BrainPerformanceView';
import { DailyOrganizerView } from './views/DailyOrganizerView';
import { HabitsView } from './views/HabitsView';
import { SleepPlannerView } from './views/SleepPlannerView';
import { AnalyticsView } from './views/AnalyticsView';
import { AICoachView } from './views/AICoachView';
import { SettingsProfileView } from './views/SettingsProfileView';

function AppContent() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView setActiveTab={setActiveTab} />;
      case 'planner':
        return <PlannerView />;
      case 'study':
        return <StudyCoachView />;
      case 'workout':
        return <WorkoutPlannerView />;
      case 'meditation':
        return <MeditationView />;
      case 'brain':
        return <BrainPerformanceView />;
      case 'tasks':
        return <DailyOrganizerView />;
      case 'habits':
        return <HabitsView />;
      case 'sleep':
        return <SleepPlannerView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'coach':
        return <AICoachView />;
      case 'settings':
        return <SettingsProfileView />;
      default:
        return <DashboardView setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col md:flex-row antialiased selection:bg-indigo-500 selection:text-white">
      {/* Sidebar Navigation */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main App Content Area */}
      <main className="flex-1 min-w-0 px-4 sm:px-8 py-6 md:py-8 max-w-7xl mx-auto w-full overflow-x-hidden">
        {renderActiveView()}
      </main>

      {/* Focus Mode Fullscreen Distraction-Free Overlay */}
      <FocusModeOverlay />

      {/* Personalized Onboarding Wizard */}
      <OnboardingModal />
    </div>
  );
}

export default function App() {
  return (
    <LifeOSProvider>
      <AppContent />
    </LifeOSProvider>
  );
}
