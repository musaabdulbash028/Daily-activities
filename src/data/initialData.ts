import {
  UserProfile,
  ScheduleBlock,
  SubjectItem,
  AssignmentItem,
  Flashcard,
  WorkoutRoutine,
  HabitItem,
  TaskItem,
  RoutineCheckItem,
  MoodEnergyLog,
  JournalEntry,
  SleepLogEntry,
} from '../types';

export const initialProfile: UserProfile = {
  name: 'Alex Rivera',
  isTeenOrStudent: true,
  wakeTime: '07:00',
  bedTime: '23:00',
  fixedCommitments: [
    { title: 'Lectures / Core Classes', startTime: '09:00', endTime: '12:00', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
    { title: 'Team Project / Lab', startTime: '13:30', endTime: '15:00', days: ['Tue', 'Thu'] },
  ],
  studyHoursPreference: '2.5 hours',
  fitnessLevel: 'Beginner',
  equipment: 'None (Bodyweight)',
  goals: ['Ace Upcoming Exams', 'Improve Sleep Quality', 'Daily 20m Movement', 'Consistent Morning Habit'],
  meditationMinutes: 10,
  breakDuration: 10,
  currentRoutineRating: 7,
  onboardingCompleted: true,
};

export const initialScheduleBlocks: ScheduleBlock[] = [
  { id: 'sb-1', title: 'Morning Rise, Water & Natural Sunlight', category: 'routine', startTime: '07:00', endTime: '07:30', priority: 'medium', completed: true, notes: 'Drink 500ml water and view daylight for circadian synchronization.' },
  { id: 'sb-2', title: 'Nutritious Breakfast & Day Review', category: 'meals', startTime: '07:30', endTime: '08:15', priority: 'medium', completed: true, notes: 'High-protein breakfast to stabilize cognitive focus.' },
  { id: 'sb-3', title: 'Deep Work: Active Recall & Flashcards', category: 'study', startTime: '08:15', endTime: '08:55', priority: 'high', completed: true, notes: 'Neuroscience and Cognitive Psychology cards.' },
  { id: 'sb-4', title: 'Fixed Commitment: Lectures / Classes', category: 'commitment', startTime: '09:00', endTime: '12:00', priority: 'high', completed: false, isFixed: true, notes: 'University hall lecture block.' },
  { id: 'sb-5', title: 'Mindful Lunch & Screen-Free Rest', category: 'meals', startTime: '12:00', endTime: '13:00', priority: 'medium', completed: false, notes: 'Healthy meal, outdoor fresh air.' },
  { id: 'sb-6', title: 'Focused Study: Problem Solving & Practice', category: 'study', startTime: '13:00', endTime: '14:30', priority: 'high', completed: false, notes: 'Calculus problem set and practice quiz.' },
  { id: 'sb-7', title: 'Short Movement & Hydration Break', category: 'breaks', startTime: '14:30', endTime: '14:45', priority: 'low', completed: false, notes: 'Stand up, shoulder rolls, water refill.' },
  { id: 'sb-8', title: 'Tasks & Assignment Execution', category: 'tasks', startTime: '15:00', endTime: '16:15', priority: 'medium', completed: false, notes: 'Draft essay outline and send project updates.' },
  { id: 'sb-9', title: 'Energizing Safe Workout & Cooldown', category: 'workout', startTime: '16:30', endTime: '17:15', priority: 'high', completed: false, notes: 'Bodyweight mobility and functional strength.' },
  { id: 'sb-10', title: 'Guided Breathing & Decompression', category: 'meditation', startTime: '17:30', endTime: '17:45', priority: 'medium', completed: false, notes: '10 min Box breathing or body scan.' },
  { id: 'sb-11', title: 'Dinner & Leisure Time with Friends', category: 'meals', startTime: '18:30', endTime: '20:30', priority: 'low', completed: false, notes: 'Relax, cook a balanced meal, socialize.' },
  { id: 'sb-12', title: 'Evening Wind-Down & Digital Sunset', category: 'sleep', startTime: '22:00', endTime: '23:00', priority: 'high', completed: false, notes: 'Dim lights, avoid blue light, journal top 3 wins, ready for bed at 23:00.' },
];

export const initialSubjects: SubjectItem[] = [
  { id: 'sub-1', name: 'Cognitive Neuroscience', color: '#8b5cf6', targetExamDate: '2026-11-20', topics: ['Synaptic Plasticity', 'Hippocampal Memory Consolidation', 'Dopamine & Motivation', 'Prefrontal Executive Function'], difficulty: 'Challenging', progress: 68 },
  { id: 'sub-2', name: 'Applied Calculus II', color: '#3b82f6', targetExamDate: '2026-11-14', topics: ['Integration by Parts', 'Taylor Series', 'Differential Equations', 'Parametric Curves'], difficulty: 'Challenging', progress: 54 },
  { id: 'sub-3', name: 'Computer Systems', color: '#14b8a6', targetExamDate: '2026-12-05', topics: ['Cache Memory Hierarchy', 'Virtual Memory & Paging', 'Concurrency & Locks'], difficulty: 'Moderate', progress: 82 },
  { id: 'sub-4', name: 'World History & Societies', color: '#f59e0b', targetExamDate: '2026-12-12', topics: ['The Silk Road Trade', 'Industrial Revolution Impacts', 'Post-War Global Treaties'], difficulty: 'Easy', progress: 75 },
];

export const initialAssignments: AssignmentItem[] = [
  { id: 'as-1', title: 'Calculus Problem Set 6', subject: 'Applied Calculus II', dueDate: '2026-11-02', estimatedMinutes: 90, completed: false, priority: 'high', notes: 'Questions 14 through 28 on Taylor series.' },
  { id: 'as-2', title: 'Neuroscience Lab Summary Report', subject: 'Cognitive Neuroscience', dueDate: '2026-11-05', estimatedMinutes: 120, completed: false, priority: 'high', notes: 'Cite at least 3 peer-reviewed memory studies.' },
  { id: 'as-3', title: 'System Architecture Diagram Draft', subject: 'Computer Systems', dueDate: '2026-11-08', estimatedMinutes: 45, completed: true, priority: 'medium', notes: 'Cache mapping flow chart.' },
];

export const initialFlashcards: Flashcard[] = [
  { id: 'fc-1', subject: 'Cognitive Neuroscience', front: 'What is Long-Term Potentiation (LTP)?', back: 'A persistent strengthening of synapses based on recent patterns of activity, considered one of the major cellular mechanisms underlying learning and memory.', difficulty: 'good', reviewCount: 4 },
  { id: 'fc-2', subject: 'Cognitive Neuroscience', front: 'Which brain structure is primary for declarative memory consolidation?', back: 'The Hippocampus (in the medial temporal lobe). Long-term storage subsequently transfers to neocortical networks during sleep.', difficulty: 'easy', reviewCount: 6 },
  { id: 'fc-3', subject: 'Applied Calculus II', front: 'What is the formula for Integration by Parts?', back: '∫ u dv = u·v - ∫ v du (Derived from the product rule of differentiation: d(uv) = u dv + v du).', difficulty: 'hard', reviewCount: 3 },
  { id: 'fc-4', subject: 'Cognitive Neuroscience', front: 'What is the "Testing Effect" (Retrieval Practice)?', back: 'The empirical finding that actively retrieving information from memory produces stronger and longer-lasting retention than passively restudying or re-reading.', difficulty: 'easy', reviewCount: 7 },
  { id: 'fc-5', subject: 'Computer Systems', front: 'What are the 3 types of cache misses (The 3 Cs)?', back: '1. Compulsory (cold start)\n2. Capacity (cache too small to hold all working set)\n3. Conflict (multiple memory blocks map to the same set).', difficulty: 'good', reviewCount: 5 },
];

export const initialWorkouts: WorkoutRoutine[] = [
  {
    id: 'wo-1',
    title: 'Safe Full-Body Home Mobility & Strength',
    level: 'Beginner',
    category: 'Strength',
    equipment: 'None (Bodyweight)',
    durationMinutes: 25,
    warmUp: [
      'Neck rolls & shoulder circles (1 min)',
      'Gentle arm swings & torso twists (1 min)',
      'Hip openers & bodyweight good mornings (2 min)',
    ],
    exercises: [
      { name: 'Chair or Box Squats', sets: '3 sets', repsOrDuration: '10-12 reps', instruction: 'Stand tall, feet shoulder-width. Lower hips down toward a sturdy chair, tap lightly, and drive up through heels.', safetyCue: 'Keep knees tracking over toes. Never let knees collapse inward.', targetMuscle: 'Quadriceps, Glutes' },
      { name: 'Elevated / Wall Push-Ups', sets: '3 sets', repsOrDuration: '8-10 reps', instruction: 'Place hands on an elevated surface (wall, sturdy desk). Maintain a rigid straight body plank and press away.', safetyCue: 'Engage core tightly. Do not let lower back arch.', targetMuscle: 'Chest, Shoulders, Triceps' },
      { name: 'Glute Bridges', sets: '3 sets', repsOrDuration: '12 reps', instruction: 'Lie on your back, knees bent, feet flat. Drive hips upward squeezing glutes at the top for 1 second.', safetyCue: 'Drive from hips, not lower back.', targetMuscle: 'Glutes, Hamstrings' },
      { name: 'Bird-Dog Stability', sets: '2 sets', repsOrDuration: '8 reps each side', instruction: 'On hands and knees, reach right arm forward and left leg backward simultaneously. Hold 1s, return with control.', safetyCue: 'Keep spine neutral. Move with slow deliberate control.', targetMuscle: 'Core, Spinal Erectors' },
    ],
    coolDown: [
      'Standing calf & quad stretch (1 min each side)',
      'Child\'s pose slow breathing (2 min)',
      'Chest doorway stretch (1 min)',
    ],
  },
  {
    id: 'wo-2',
    title: 'Desk Worker Posture Reset & Spine Decompression',
    level: 'Beginner',
    category: 'Mobility',
    equipment: 'None (Bodyweight)',
    durationMinutes: 15,
    warmUp: [
      'Deep diaphragmatic breathing (1 min)',
      'Wrist and ankle circles (1 min)',
    ],
    exercises: [
      { name: 'Thoracic Extension over Chair', sets: '2 sets', repsOrDuration: '10 gentle reps', instruction: 'Interlock fingers behind head. Gently arch upper back over the top of your chair while keeping ribs down.', safetyCue: 'Only move through comfortable range of motion. No pinching.', targetMuscle: 'Upper Spine, Posture' },
      { name: 'Cat-Cow Flow', sets: '3 sets', repsOrDuration: '8 cycles', instruction: 'Alternate between arching the back with inhale and rounding gently with exhale.', safetyCue: 'Smooth cadence matching breath.', targetMuscle: 'Full Spine & Core' },
      { name: 'Wall Angels', sets: '3 sets', repsOrDuration: '10 reps', instruction: 'Stand with back, elbows, and wrists against a wall. Slide arms up and down like a snow angel.', safetyCue: 'Keep lower back from excessively arching off the wall.', targetMuscle: 'Upper Back, Scapular Stabilizers' },
    ],
    coolDown: [
      'Seated hamstring stretch (1 min)',
      'Neck lateral stretch with gentle breath (1 min)',
    ],
  },
  {
    id: 'wo-3',
    title: 'Cardio Stamina & Low-Impact Aerobic Flow',
    level: 'Intermediate',
    category: 'Cardio',
    equipment: 'None (Bodyweight)',
    durationMinutes: 20,
    warmUp: [
      'Light marching in place (2 min)',
      'Dynamic side step-touches (1 min)',
    ],
    exercises: [
      { name: 'Low-Impact Step Jacks', sets: '3 sets', repsOrDuration: '45 seconds', instruction: 'Step one foot out to the side while raising arms overhead, alternate sides at a steady rhythm.', safetyCue: 'Gentle on joints, keep knees soft.', targetMuscle: 'Cardiovascular' },
      { name: 'Bodyweight Skater Hops (or Steps)', sets: '3 sets', repsOrDuration: '40 seconds', instruction: 'Leap or step laterally from right to left, sweeping opposite leg behind.', safetyCue: 'Land softly on the midfoot.', targetMuscle: 'Glutes, Balance' },
      { name: 'High Knees March / Jog', sets: '3 sets', repsOrDuration: '30 seconds', instruction: 'Drive knees toward chest height while pumping arms in sync.', safetyCue: 'Maintain upright posture; do not lean backward.', targetMuscle: 'Hip Flexors, Cardio' },
    ],
    coolDown: [
      'Forward fold slow hang (1 min)',
      'Deep calming belly breathing (2 min)',
    ],
  },
];

export const initialHabits: HabitItem[] = [
  { id: 'hb-1', title: '500ml Water Upon Waking', category: 'health', frequency: 'daily', streak: 12, history: { '2026-10-25': true, '2026-10-26': true, '2026-10-27': true, '2026-10-28': true } },
  { id: 'hb-2', title: 'Outdoor Morning Sunlight (10m)', category: 'wellness', frequency: 'daily', streak: 8, history: { '2026-10-25': true, '2026-10-26': true, '2026-10-27': true, '2026-10-28': true } },
  { id: 'hb-3', title: '25-Min Focused Study Block', category: 'productivity', frequency: 'daily', streak: 5, history: { '2026-10-26': true, '2026-10-27': true, '2026-10-28': true } },
  { id: 'hb-4', title: 'Daily Safe Movement / Workout', category: 'health', frequency: '5-days', streak: 4, history: { '2026-10-25': true, '2026-10-27': true, '2026-10-28': false } },
  { id: 'hb-5', title: 'Digital Sunset (No Screens 45m before bed)', category: 'mind', frequency: 'daily', streak: 6, history: { '2026-10-25': true, '2026-10-26': true, '2026-10-27': true } },
];

export const initialTasks: TaskItem[] = [
  { id: 'tk-1', title: 'Submit Neuroscience Assignment Draft', category: 'Study', priority: 'high', dueDate: '2026-10-30', completed: false, subtasks: [{ id: 'st-1', title: 'Review citations', completed: true }, { id: 'st-2', title: 'Format PDF', completed: false }] },
  { id: 'tk-2', title: 'Order Electrolytes & Oats', category: 'Shopping', priority: 'low', dueDate: '2026-10-29', completed: false },
  { id: 'tk-3', title: 'Organize Study Desk & Clean Monitor', category: 'Personal', priority: 'medium', dueDate: '2026-10-28', completed: true },
  { id: 'tk-4', title: 'Email Professor re: Question on Problem 4', category: 'Study', priority: 'medium', dueDate: '2026-10-28', completed: true },
];

export const initialRoutines: RoutineCheckItem[] = [
  { id: 'rc-1', title: 'Drink glass of water with lemon / pinch of salt', type: 'morning', completedToday: true, iconName: 'Droplets' },
  { id: 'rc-2', title: 'Get 5-10 minutes natural daylight outside', type: 'morning', completedToday: true, iconName: 'Sun' },
  { id: 'rc-3', title: 'Make bed and organize desk workspace', type: 'morning', completedToday: true, iconName: 'Sparkles' },
  { id: 'rc-4', title: 'Review today\'s top 3 priorities', type: 'morning', completedToday: true, iconName: 'Target' },
  { id: 'rc-5', title: 'Dim household overhead lights (switch to warm glow)', type: 'evening', completedToday: false, iconName: 'Moon' },
  { id: 'rc-6', title: 'Screens off or blue-light filter activated', type: 'evening', completedToday: false, iconName: 'SmartphoneOff' },
  { id: 'rc-7', title: 'Prepare clothes & study materials for tomorrow', type: 'evening', completedToday: false, iconName: 'Briefcase' },
  { id: 'rc-8', title: 'Write 3 daily wins & gratitude in journal', type: 'evening', completedToday: false, iconName: 'BookOpen' },
];

export const initialMoodLogs: MoodEnergyLog[] = [
  { id: 'ml-1', timestamp: '2026-10-26T08:30:00Z', date: '2026-10-26', mood: 'focused', energy: 8, tags: ['Great sleep', 'Morning coffee', 'Sunlight'] },
  { id: 'ml-2', timestamp: '2026-10-27T09:00:00Z', date: '2026-10-27', mood: 'joyful', energy: 9, tags: ['Completed workout', 'Good breakfast'] },
  { id: 'ml-3', timestamp: '2026-10-28T08:15:00Z', date: '2026-10-28', mood: 'calm', energy: 8, tags: ['Hydrated', 'Clear plan'] },
];

export const initialJournals: JournalEntry[] = [
  {
    id: 'jn-1',
    date: '2026-10-27',
    prompt: 'What was your single most meaningful win today, and how did you feel?',
    content: 'Completed the Calculus integration sets without getting frustrated. Taking the 10-minute walk between sessions prevented mental fatigue.',
    gratitude: ['Peaceful morning quiet', 'Warm tea during study', 'Helpful feedback from study partner'],
  },
];

export const initialSleepLogs: SleepLogEntry[] = [
  { id: 'sl-1', date: '2026-10-25', targetBedtime: '23:00', actualBedtime: '23:15', targetWakeTime: '07:00', actualWakeTime: '07:05', qualityRating: 4, notes: 'Fell asleep in 15 minutes, woke up refreshed.', windDownCompleted: true },
  { id: 'sl-2', date: '2026-10-26', targetBedtime: '23:00', actualBedtime: '22:50', targetWakeTime: '07:00', actualWakeTime: '07:00', qualityRating: 5, notes: 'Deep restful sleep, 8 hours total opportunity.', windDownCompleted: true },
  { id: 'sl-3', date: '2026-10-27', targetBedtime: '23:00', actualBedtime: '23:10', targetWakeTime: '07:00', actualWakeTime: '07:00', qualityRating: 4, notes: 'Followed digital sunset routine, calm mind.', windDownCompleted: true },
];
