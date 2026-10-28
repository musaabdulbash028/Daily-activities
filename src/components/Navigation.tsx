import React, { useState } from 'react';
import { useLifeOS } from '../context/LifeOSContext';
import {
  LayoutDashboard,
  CalendarDays,
  GraduationCap,
  Dumbbell,
  Sparkles,
  Brain,
  CheckSquare,
  Flame,
  Moon,
  BarChart3,
  Bot,
  Settings,
  Sun,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Zap,
} from 'lucide-react';

export type ActiveTab =
  | 'dashboard'
  | 'planner'
  | 'study'
  | 'workout'
  | 'meditation'
  | 'brain'
  | 'tasks'
  | 'habits'
  | 'sleep'
  | 'analytics'
  | 'coach'
  | 'settings';

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
  isHighlight?: boolean;
}

interface NavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const { theme, toggleTheme, setFocusMode, conflicts } = useLifeOS();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'planner',
      label: 'Smart Daily Planner',
      icon: CalendarDays,
      badge: conflicts.length > 0 ? `${conflicts.length} conflict` : undefined,
      badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
    },
    { id: 'study', label: 'AI Study Coach', icon: GraduationCap },
    { id: 'workout', label: 'Workout Planner', icon: Dumbbell },
    { id: 'meditation', label: 'Meditation & Calm', icon: Sparkles },
    { id: 'brain', label: 'Brain Performance', icon: Brain },
    { id: 'tasks', label: 'Daily Life Organizer', icon: CheckSquare },
    { id: 'habits', label: 'Habit Tracker', icon: Flame },
    { id: 'sleep', label: 'Sleep & Energy', icon: Moon },
    { id: 'analytics', label: 'Progress & Analytics', icon: BarChart3 },
    { id: 'coach', label: 'LifeOS AI Coach', icon: Bot, isHighlight: true },
    { id: 'settings', label: 'Settings & Profile', icon: Settings },
  ];

  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col justify-between h-screen sticky top-0 bg-[#0a0f1d] border-r border-slate-800/80 transition-all duration-300 z-30 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Top Logo & App Title */}
        <div>
          <div className="flex items-center justify-between p-4 border-b border-slate-800/60">
            {!collapsed ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-teal-400 p-0.5 shadow-lg shadow-indigo-600/30">
                  <div className="w-full h-full bg-[#0a0f1d] rounded-[10px] flex items-center justify-center">
                    <Zap className="w-5 h-5 text-teal-400 fill-teal-400/20" />
                  </div>
                </div>
                <div>
                  <h1 className="text-base font-bold bg-gradient-to-r from-white via-indigo-200 to-teal-300 bg-clip-text text-transparent">
                    LifeOS
                  </h1>
                  <p className="text-[10px] text-slate-400 leading-none">Life Optimizer</p>
                </div>
              </div>
            ) : (
              <div className="w-10 h-10 mx-auto rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-teal-400 p-0.5 shadow-lg">
                <div className="w-full h-full bg-[#0a0f1d] rounded-[10px] flex items-center justify-center">
                  <Zap className="w-5 h-5 text-teal-400" />
                </div>
              </div>
            )}

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
              title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Quick Focus Mode Launch Pill */}
          {!collapsed && (
            <div className="px-3 pt-3">
              <button
                onClick={() => setFocusMode(true)}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-950/80 to-purple-950/80 border border-indigo-700/40 text-indigo-200 hover:border-indigo-500 hover:text-white text-xs font-semibold transition group shadow-sm"
              >
                <Maximize2 className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition" />
                <span>Enter Focus Mode</span>
              </button>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-210px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id as ActiveTab)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition group relative ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600/20 to-purple-600/10 text-white border border-indigo-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition ${
                      isActive ? 'text-teal-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                  {!collapsed && item.badge && (
                    <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded-full ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-gradient-to-b from-indigo-500 to-teal-400" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom User / Theme bar */}
        <div className="p-3 border-t border-slate-800/60 bg-slate-900/40">
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>

            {!collapsed && (
              <div className="text-right">
                <p className="text-[11px] font-medium text-slate-300 leading-tight">Alex Rivera</p>
                <p className="text-[10px] text-teal-400 font-mono">Plan: Active</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <div className="md:hidden sticky top-0 z-40 bg-[#0a0f1d] border-b border-slate-800 flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-teal-400 p-0.5">
            <div className="w-full h-full bg-[#0a0f1d] rounded-md flex items-center justify-center">
              <Zap className="w-4 h-4 text-teal-400" />
            </div>
          </div>
          <span className="font-bold text-sm text-white">LifeOS</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFocusMode(true)}
            className="p-2 text-indigo-400 hover:bg-slate-800 rounded-lg transition"
            title="Focus Mode"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-400 hover:bg-slate-800 rounded-lg transition"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:bg-slate-800 rounded-lg transition"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-md pt-16 p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-[#0e1526] rounded-2xl border border-slate-800 p-4 space-y-1">
            <div className="pb-3 border-b border-slate-800/80 mb-2">
              <p className="text-xs font-semibold text-slate-300">Navigation</p>
              <p className="text-[11px] text-slate-500">Select a section to explore</p>
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id as ActiveTab)}
                  className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-xs font-medium transition ${
                    isActive
                      ? 'bg-indigo-600/20 text-white border border-indigo-500/40'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};
