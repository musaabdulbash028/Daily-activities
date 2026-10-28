import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  UserProfile,
  ScheduleBlock,
  SubjectItem,
  AssignmentItem,
  Flashcard,
  WorkoutRoutine,
  WorkoutLogEntry,
  HabitItem,
  TaskItem,
  RoutineCheckItem,
  MoodEnergyLog,
  JournalEntry,
  SleepLogEntry,
  ChatMessage,
} from '../types';
import {
  initialProfile,
  initialScheduleBlocks,
  initialSubjects,
  initialAssignments,
  initialFlashcards,
  initialWorkouts,
  initialHabits,
  initialTasks,
  initialRoutines,
  initialMoodLogs,
  initialJournals,
  initialSleepLogs,
} from '../data/initialData';

interface ConflictItem {
  block1: ScheduleBlock;
  block2: ScheduleBlock;
  message: string;
}

interface LifeOSContextType {
  profile: UserProfile;
  updateProfile: (updated: Partial<UserProfile>) => void;
  schedule: ScheduleBlock[];
  addScheduleBlock: (block: Omit<ScheduleBlock, 'id'>) => void;
  updateScheduleBlock: (id: string, updated: Partial<ScheduleBlock>) => void;
  deleteScheduleBlock: (id: string) => void;
  toggleCompleteBlock: (id: string) => void;
  conflicts: ConflictItem[];
  replaceSchedule: (blocks: ScheduleBlock[]) => void;
  subjects: SubjectItem[];
  addSubject: (subject: Omit<SubjectItem, 'id'>) => void;
  updateSubject: (id: string, updated: Partial<SubjectItem>) => void;
  deleteSubject: (id: string) => void;
  assignments: AssignmentItem[];
  addAssignment: (assignment: Omit<AssignmentItem, 'id'>) => void;
  toggleCompleteAssignment: (id: string) => void;
  deleteAssignment: (id: string) => void;
  flashcards: Flashcard[];
  addFlashcard: (card: Omit<Flashcard, 'id' | 'reviewCount'>) => void;
  rateFlashcard: (id: string, rating: 'again' | 'hard' | 'good' | 'easy') => void;
  deleteFlashcard: (id: string) => void;
  workouts: WorkoutRoutine[];
  workoutLogs: WorkoutLogEntry[];
  logCompletedWorkout: (log: Omit<WorkoutLogEntry, 'id'>) => void;
  habits: HabitItem[];
  toggleHabitToday: (id: string) => void;
  addHabit: (habit: Omit<HabitItem, 'id' | 'streak' | 'history'>) => void;
  updateHabit: (id: string, updated: Partial<HabitItem>) => void;
  deleteHabit: (id: string) => void;
  tasks: TaskItem[];
  addTask: (task: Omit<TaskItem, 'id'>) => void;
  toggleTaskComplete: (id: string) => void;
  deleteTask: (id: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  routines: RoutineCheckItem[];
  toggleRoutineItem: (id: string) => void;
  addRoutineItem: (item: Omit<RoutineCheckItem, 'id'>) => void;
  moodLogs: MoodEnergyLog[];
  logMoodEnergy: (mood: MoodEnergyLog['mood'], energy: number, tags: string[], note?: string) => void;
  journals: JournalEntry[];
  addJournalEntry: (entry: Omit<JournalEntry, 'id'>) => void;
  sleepLogs: SleepLogEntry[];
  logSleep: (entry: Omit<SleepLogEntry, 'id'>) => void;
  chatMessages: ChatMessage[];
  addChatMessage: (sender: 'user' | 'coach', text: string) => void;
  studyMinutesToday: number;
  addStudyMinutes: (mins: number) => void;
  meditationMinutesToday: number;
  addMeditationMinutes: (mins: number) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  focusMode: boolean;
  setFocusMode: (val: boolean) => void;
  onboardingOpen: boolean;
  setOnboardingOpen: (val: boolean) => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonString: string) => boolean;
  resetToSampleData: () => void;
}

const STORAGE_KEY = 'lifeos_userdata_v1';

const LifeOSContext = createContext<LifeOSContextType | undefined>(undefined);

export const LifeOSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initial from localStorage if available
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.profile) return parsed.profile;
      }
    } catch {
      // Ignore
    }
    return initialProfile;
  });

  const [schedule, setSchedule] = useState<ScheduleBlock[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.schedule) return parsed.schedule;
      }
    } catch {
      // Ignore
    }
    return initialScheduleBlocks;
  });

  const [subjects, setSubjects] = useState<SubjectItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.subjects) return parsed.subjects;
      }
    } catch {
      // Ignore
    }
    return initialSubjects;
  });

  const [assignments, setAssignments] = useState<AssignmentItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.assignments) return parsed.assignments;
      }
    } catch {
      // Ignore
    }
    return initialAssignments;
  });

  const [flashcards, setFlashcards] = useState<Flashcard[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.flashcards) return parsed.flashcards;
      }
    } catch {
      // Ignore
    }
    return initialFlashcards;
  });

  const [workouts] = useState<WorkoutRoutine[]>(initialWorkouts);

  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.workoutLogs) return parsed.workoutLogs;
      }
    } catch {
      // Ignore
    }
    return [
      { id: 'wl-1', date: '2026-10-26', routineTitle: 'Safe Full-Body Home Mobility & Strength', durationMinutes: 25, feeling: 'great' },
      { id: 'wl-2', date: '2026-10-27', routineTitle: 'Desk Worker Posture Reset', durationMinutes: 15, feeling: 'good' },
    ];
  });

  const [habits, setHabits] = useState<HabitItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.habits) return parsed.habits;
      }
    } catch {
      // Ignore
    }
    return initialHabits;
  });

  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.tasks) return parsed.tasks;
      }
    } catch {
      // Ignore
    }
    return initialTasks;
  });

  const [routines, setRoutines] = useState<RoutineCheckItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.routines) return parsed.routines;
      }
    } catch {
      // Ignore
    }
    return initialRoutines;
  });

  const [moodLogs, setMoodLogs] = useState<MoodEnergyLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.moodLogs) return parsed.moodLogs;
      }
    } catch {
      // Ignore
    }
    return initialMoodLogs;
  });

  const [journals, setJournals] = useState<JournalEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.journals) return parsed.journals;
      }
    } catch {
      // Ignore
    }
    return initialJournals;
  });

  const [sleepLogs, setSleepLogs] = useState<SleepLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.sleepLogs) return parsed.sleepLogs;
      }
    } catch {
      // Ignore
    }
    return initialSleepLogs;
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'cm-1',
      sender: 'coach',
      text: "Hello Alex! I'm your LifeOS Coach. I'm here to help you structure balanced study sessions, maintain restful sleep, and build realistic, safe daily habits. What would you like to focus on today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [studyMinutesToday, setStudyMinutesToday] = useState<number>(75);
  const [meditationMinutesToday, setMeditationMinutesToday] = useState<number>(10);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [focusMode, setFocusMode] = useState<boolean>(false);
  const [onboardingOpen, setOnboardingOpen] = useState<boolean>(false);

  // Sync theme class to document body
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  // Persist to localStorage on state changes
  useEffect(() => {
    try {
      const payload = {
        profile,
        schedule,
        subjects,
        assignments,
        flashcards,
        workoutLogs,
        habits,
        tasks,
        routines,
        moodLogs,
        journals,
        sleepLogs,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Local storage might be full or disabled
    }
  }, [
    profile,
    schedule,
    subjects,
    assignments,
    flashcards,
    workoutLogs,
    habits,
    tasks,
    routines,
    moodLogs,
    journals,
    sleepLogs,
  ]);

  // Conflict Detection Algorithm for Schedule
  const conflicts: ConflictItem[] = React.useMemo(() => {
    const list: ConflictItem[] = [];
    const timeToMinutes = (timeStr: string) => {
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    };

    for (let i = 0; i < schedule.length; i++) {
      for (let j = i + 1; j < schedule.length; j++) {
        const b1 = schedule[i];
        const b2 = schedule[j];
        const start1 = timeToMinutes(b1.startTime);
        const end1 = timeToMinutes(b1.endTime);
        const start2 = timeToMinutes(b2.startTime);
        const end2 = timeToMinutes(b2.endTime);

        // Overlap if (start1 < end2 && end1 > start2)
        if (start1 < end2 && end1 > start2) {
          list.push({
            block1: b1,
            block2: b2,
            message: `"${b1.title}" (${b1.startTime}-${b1.endTime}) overlaps with "${b2.title}" (${b2.startTime}-${b2.endTime}).`,
          });
        }
      }
    }
    return list;
  }, [schedule]);

  const updateProfile = (updated: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  const addScheduleBlock = (block: Omit<ScheduleBlock, 'id'>) => {
    const newBlock: ScheduleBlock = { ...block, id: `sb-${Date.now()}` };
    setSchedule((prev) => [...prev, newBlock].sort((a, b) => a.startTime.localeCompare(b.startTime)));
  };

  const updateScheduleBlock = (id: string, updated: Partial<ScheduleBlock>) => {
    setSchedule((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updated } : b)).sort((a, b) => a.startTime.localeCompare(b.startTime))
    );
  };

  const deleteScheduleBlock = (id: string) => {
    setSchedule((prev) => prev.filter((b) => b.id !== id));
  };

  const toggleCompleteBlock = (id: string) => {
    setSchedule((prev) =>
      prev.map((b) => (b.id === id ? { ...b, completed: !b.completed } : b))
    );
  };

  const replaceSchedule = (blocks: ScheduleBlock[]) => {
    setSchedule(blocks.sort((a, b) => a.startTime.localeCompare(b.startTime)));
  };

  const addSubject = (sub: Omit<SubjectItem, 'id'>) => {
    setSubjects((prev) => [...prev, { ...sub, id: `sub-${Date.now()}` }]);
  };

  const updateSubject = (id: string, updated: Partial<SubjectItem>) => {
    setSubjects((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
  };

  const deleteSubject = (id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  };

  const addAssignment = (asgn: Omit<AssignmentItem, 'id'>) => {
    setAssignments((prev) => [...prev, { ...asgn, id: `as-${Date.now()}` }]);
  };

  const toggleCompleteAssignment = (id: string) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, completed: !a.completed } : a))
    );
  };

  const deleteAssignment = (id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  };

  const addFlashcard = (card: Omit<Flashcard, 'id' | 'reviewCount'>) => {
    setFlashcards((prev) => [...prev, { ...card, id: `fc-${Date.now()}`, reviewCount: 0 }]);
  };

  const rateFlashcard = (id: string, rating: 'again' | 'hard' | 'good' | 'easy') => {
    setFlashcards((prev) =>
      prev.map((fc) =>
        fc.id === id
          ? {
              ...fc,
              difficulty: rating,
              reviewCount: fc.reviewCount + 1,
              lastReviewed: new Date().toISOString(),
            }
          : fc
      )
    );
  };

  const deleteFlashcard = (id: string) => {
    setFlashcards((prev) => prev.filter((fc) => fc.id !== id));
  };

  const logCompletedWorkout = (log: Omit<WorkoutLogEntry, 'id'>) => {
    setWorkoutLogs((prev) => [{ ...log, id: `wl-${Date.now()}` }, ...prev]);
  };

  const toggleHabitToday = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          const wasCompleted = Boolean(h.history[today]);
          const newHistory = { ...h.history, [today]: !wasCompleted };
          const newStreak = !wasCompleted ? h.streak + 1 : Math.max(0, h.streak - 1);
          return { ...h, history: newHistory, streak: newStreak };
        }
        return h;
      })
    );
  };

  const addHabit = (habit: Omit<HabitItem, 'id' | 'streak' | 'history'>) => {
    setHabits((prev) => [...prev, { ...habit, id: `hb-${Date.now()}`, streak: 0, history: {} }]);
  };

  const updateHabit = (id: string, updated: Partial<HabitItem>) => {
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, ...updated } : h)));
  };

  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const addTask = (task: Omit<TaskItem, 'id'>) => {
    setTasks((prev) => [...prev, { ...task, id: `tk-${Date.now()}` }]);
  };

  const toggleTaskComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId && t.subtasks) {
          return {
            ...t,
            subtasks: t.subtasks.map((st) =>
              st.id === subtaskId ? { ...st, completed: !st.completed } : st
            ),
          };
        }
        return t;
      })
    );
  };

  const toggleRoutineItem = (id: string) => {
    setRoutines((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completedToday: !r.completedToday } : r))
    );
  };

  const addRoutineItem = (item: Omit<RoutineCheckItem, 'id'>) => {
    setRoutines((prev) => [...prev, { ...item, id: `rc-${Date.now()}` }]);
  };

  const logMoodEnergy = (mood: MoodEnergyLog['mood'], energy: number, tags: string[], note?: string) => {
    const today = new Date().toISOString().split('T')[0];
    const newEntry: MoodEnergyLog = {
      id: `ml-${Date.now()}`,
      timestamp: new Date().toISOString(),
      date: today,
      mood,
      energy,
      tags,
      note,
    };
    setMoodLogs((prev) => [newEntry, ...prev]);
  };

  const addJournalEntry = (entry: Omit<JournalEntry, 'id'>) => {
    setJournals((prev) => [{ ...entry, id: `jn-${Date.now()}` }, ...prev]);
  };

  const logSleep = (entry: Omit<SleepLogEntry, 'id'>) => {
    setSleepLogs((prev) => [{ ...entry, id: `sl-${Date.now()}` }, ...prev]);
  };

  const addChatMessage = (sender: 'user' | 'coach', text: string) => {
    setChatMessages((prev) => [
      ...prev,
      {
        id: `cm-${Date.now()}`,
        sender,
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const addStudyMinutes = (mins: number) => {
    setStudyMinutesToday((prev) => prev + mins);
  };

  const addMeditationMinutes = (mins: number) => {
    setMeditationMinutesToday((prev) => prev + mins);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const exportDataJSON = () => {
    const data = {
      profile,
      schedule,
      subjects,
      assignments,
      flashcards,
      workoutLogs,
      habits,
      tasks,
      routines,
      moodLogs,
      journals,
      sleepLogs,
      exportedAt: new Date().toISOString(),
      app: 'LifeOS',
      version: '1.0.0',
    };
    return JSON.stringify(data, null, 2);
  };

  const importDataJSON = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.profile) setProfile(data.profile);
      if (data.schedule) setSchedule(data.schedule);
      if (data.subjects) setSubjects(data.subjects);
      if (data.assignments) setAssignments(data.assignments);
      if (data.flashcards) setFlashcards(data.flashcards);
      if (data.workoutLogs) setWorkoutLogs(data.workoutLogs);
      if (data.habits) setHabits(data.habits);
      if (data.tasks) setTasks(data.tasks);
      if (data.routines) setRoutines(data.routines);
      if (data.moodLogs) setMoodLogs(data.moodLogs);
      if (data.journals) setJournals(data.journals);
      if (data.sleepLogs) setSleepLogs(data.sleepLogs);
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  };

  const resetToSampleData = () => {
    setProfile(initialProfile);
    setSchedule(initialScheduleBlocks);
    setSubjects(initialSubjects);
    setAssignments(initialAssignments);
    setFlashcards(initialFlashcards);
    setHabits(initialHabits);
    setTasks(initialTasks);
    setRoutines(initialRoutines);
    setMoodLogs(initialMoodLogs);
    setJournals(initialJournals);
    setSleepLogs(initialSleepLogs);
    setStudyMinutesToday(75);
    setMeditationMinutesToday(10);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <LifeOSContext.Provider
      value={{
        profile,
        updateProfile,
        schedule,
        addScheduleBlock,
        updateScheduleBlock,
        deleteScheduleBlock,
        toggleCompleteBlock,
        conflicts,
        replaceSchedule,
        subjects,
        addSubject,
        updateSubject,
        deleteSubject,
        assignments,
        addAssignment,
        toggleCompleteAssignment,
        deleteAssignment,
        flashcards,
        addFlashcard,
        rateFlashcard,
        deleteFlashcard,
        workouts,
        workoutLogs,
        logCompletedWorkout,
        habits,
        toggleHabitToday,
        addHabit,
        updateHabit,
        deleteHabit,
        tasks,
        addTask,
        toggleTaskComplete,
        deleteTask,
        toggleSubtask,
        routines,
        toggleRoutineItem,
        addRoutineItem,
        moodLogs,
        logMoodEnergy,
        journals,
        addJournalEntry,
        sleepLogs,
        logSleep,
        chatMessages,
        addChatMessage,
        studyMinutesToday,
        addStudyMinutes,
        meditationMinutesToday,
        addMeditationMinutes,
        theme,
        toggleTheme,
        focusMode,
        setFocusMode,
        onboardingOpen,
        setOnboardingOpen,
        exportDataJSON,
        importDataJSON,
        resetToSampleData,
      }}
    >
      {children}
    </LifeOSContext.Provider>
  );
};

export const useLifeOS = () => {
  const context = useContext(LifeOSContext);
  if (!context) {
    throw new Error('useLifeOS must be used within a LifeOSProvider');
  }
  return context;
};
