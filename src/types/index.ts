export type Priority = 'low' | 'medium' | 'high';

export type ActivityCategory =
  | 'study'
  | 'workout'
  | 'meditation'
  | 'routine'
  | 'meals'
  | 'breaks'
  | 'tasks'
  | 'sleep'
  | 'commitment';

export interface ScheduleBlock {
  id: string;
  title: string;
  category: ActivityCategory;
  startTime: string; // HH:mm format, e.g. "09:00"
  endTime: string;   // HH:mm format, e.g. "10:30"
  priority: Priority;
  completed: boolean;
  notes?: string;
  isFixed?: boolean; // school, work, classes
}

export interface UserProfile {
  name: string;
  isTeenOrStudent: boolean;
  wakeTime: string; // "07:00"
  bedTime: string;  // "23:00"
  fixedCommitments: Array<{ title: string; startTime: string; endTime: string; days: string[] }>;
  studyHoursPreference: string; // e.g. "2-3 hours"
  fitnessLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  equipment: 'None (Bodyweight)' | 'Dumbbells' | 'Full Gym' | 'Resistance Bands';
  goals: string[];
  meditationMinutes: number; // e.g. 10
  breakDuration: number; // e.g. 10
  currentRoutineRating: number; // 1-10
  onboardingCompleted: boolean;
}

export interface SubjectItem {
  id: string;
  name: string;
  color: string;
  targetExamDate?: string;
  topics: string[];
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  progress: number; // 0-100%
}

export interface AssignmentItem {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  estimatedMinutes: number;
  completed: boolean;
  priority: Priority;
  notes?: string;
}

export interface Flashcard {
  id: string;
  subject: string;
  front: string;
  back: string;
  difficulty: 'again' | 'hard' | 'good' | 'easy';
  lastReviewed?: string;
  reviewCount: number;
}

export interface PracticeQuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ExerciseItem {
  name: string;
  sets: string;
  repsOrDuration: string;
  instruction: string;
  safetyCue: string;
  targetMuscle: string;
}

export interface WorkoutRoutine {
  id: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'Strength' | 'Mobility' | 'Cardio' | 'Recovery';
  equipment: string;
  durationMinutes: number;
  warmUp: string[];
  exercises: ExerciseItem[];
  coolDown: string[];
}

export interface WorkoutLogEntry {
  id: string;
  date: string;
  routineTitle: string;
  durationMinutes: number;
  notes?: string;
  feeling: 'great' | 'good' | 'tired' | 'challenging';
}

export interface HabitItem {
  id: string;
  title: string;
  category: 'wellness' | 'productivity' | 'health' | 'mind';
  frequency: 'daily' | '5-days' | 'weekly';
  streak: number;
  history: Record<string, boolean>; // 'YYYY-MM-DD': boolean
  isPaused?: boolean;
}

export interface TaskItem {
  id: string;
  title: string;
  category: 'Personal' | 'Study' | 'Work' | 'Errands' | 'Shopping';
  priority: Priority;
  dueDate?: string;
  completed: boolean;
  subtasks?: Array<{ id: string; title: string; completed: boolean }>;
}

export interface RoutineCheckItem {
  id: string;
  title: string;
  type: 'morning' | 'evening';
  completedToday: boolean;
  iconName: string;
}

export interface MoodEnergyLog {
  id: string;
  timestamp: string;
  date: string; // YYYY-MM-DD
  mood: 'joyful' | 'calm' | 'focused' | 'neutral' | 'stressed' | 'tired';
  energy: number; // 1-10
  tags: string[];
  note?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  prompt: string;
  content: string;
  gratitude: string[];
}

export interface SleepLogEntry {
  id: string;
  date: string;
  targetBedtime: string;
  actualBedtime: string;
  targetWakeTime: string;
  actualWakeTime: string;
  qualityRating: number; // 1-5
  notes?: string;
  windDownCompleted: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  timestamp: string;
}
