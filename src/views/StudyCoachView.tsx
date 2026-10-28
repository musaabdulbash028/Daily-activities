import React, { useState, useEffect } from 'react';
import { useLifeOS } from '../context/LifeOSContext';
import { sound } from '../utils/audioService';
import { SubjectItem, AssignmentItem, Flashcard, PracticeQuizQuestion } from '../types';
import {
  GraduationCap,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  BookOpen,
  Calendar,
  Layers,
  CheckCircle2,
  Plus,
  HelpCircle,
  Lightbulb,
  Check,
  X,
  Volume2,
  Trash2,
  RotateCw,
  Award,
} from 'lucide-react';

export const StudyCoachView: React.FC = () => {
  const {
    subjects,
    addSubject,
    deleteSubject,
    assignments,
    addAssignment,
    toggleCompleteAssignment,
    deleteAssignment,
    flashcards,
    addFlashcard,
    rateFlashcard,
    deleteFlashcard,
    studyMinutesToday,
    addStudyMinutes,
  } = useLifeOS();

  const [activeSection, setActiveSection] = useState<'pomodoro' | 'flashcards' | 'quiz' | 'subjects' | 'assistant'>('pomodoro');

  // Pomodoro Timer State
  const [workMinutes, setWorkMinutes] = useState<number>(25);
  const [breakMinutes, setBreakMinutes] = useState<number>(5);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerMode, setTimerMode] = useState<'work' | 'break'>('work');
  const [completedSessionsCount, setCompletedSessionsCount] = useState<number>(3);

  // Flashcards state
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [newCardFront, setNewCardFront] = useState<string>('');
  const [newCardBack, setNewCardBack] = useState<string>('');
  const [newCardSubject, setNewCardSubject] = useState<string>(subjects[0]?.name || 'Cognitive Neuroscience');
  const [showAddCardModal, setShowAddCardModal] = useState<boolean>(false);

  // Practice Quiz State
  const [quizSubject, setQuizSubject] = useState<string>(subjects[0]?.name || 'Cognitive Neuroscience');
  const [quizTopic, setQuizTopic] = useState<string>('Memory Consolidation & Synapses');
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState<boolean>(false);
  const [quizQuestions, setQuizQuestions] = useState<PracticeQuizQuestion[]>([
    {
      question: 'Why is active recall superior to passive re-reading for long-term retention?',
      options: [
        'It requires less time',
        'It forces retrieval, strengthening neuronal synaptic pathways and highlighting knowledge gaps',
        'It prevents physical fatigue',
        'It guarantees 100% test scores',
      ],
      correctIndex: 1,
      explanation: 'Cognitive retrieval practice forces the brain to reconstruct memory traces, significantly increasing memory retention.',
    },
    {
      question: 'What is the optimal spacing interval for reviewing new material?',
      options: [
        'Review every hour for 24 hours',
        'Review 1 day later, then 3 days, then 1 week, then 2 weeks (expanding spacing)',
        'Never review until exam night',
        'Review continuously without sleep',
      ],
      correctIndex: 1,
      explanation: 'Expanding spaced retrieval leverages the spacing effect, catching memories right before they decay.',
    },
  ]);
  const [currentQuizQuestionIndex, setCurrentQuizQuestionIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  // AI Study Assistant State
  const [assistantSubject, setAssistantSubject] = useState<string>(subjects[0]?.name || 'Cognitive Neuroscience');
  const [assistantTopic, setAssistantTopic] = useState<string>('Synaptic Plasticity');
  const [isExplaining, setIsExplaining] = useState<boolean>(false);
  const [explanationOutput, setExplanationOutput] = useState<string | null>(null);

  // Add Subject Modal State
  const [showAddSubjectModal, setShowAddSubjectModal] = useState<boolean>(false);
  const [newSubName, setNewSubName] = useState('');
  const [newSubColor, setNewSubColor] = useState('#8b5cf6');
  const [newSubDate, setNewSubDate] = useState('2026-11-30');
  const [newSubDifficulty, setNewSubDifficulty] = useState<'Easy' | 'Moderate' | 'Challenging'>('Moderate');

  // Add Assignment Modal State
  const [showAddAssignModal, setShowAddAssignModal] = useState<boolean>(false);
  const [newAssignTitle, setNewAssignTitle] = useState('');
  const [newAssignSubject, setNewAssignSubject] = useState(subjects[0]?.name || 'Cognitive Neuroscience');
  const [newAssignDate, setNewAssignDate] = useState('2026-11-10');
  const [newAssignMins, setNewAssignMins] = useState(60);

  // Pomodoro Interval Effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isTimerRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0) {
      if (timerMode === 'work') {
        sound.playChime(true);
        addStudyMinutes(workMinutes);
        setCompletedSessionsCount((c) => c + 1);
        setTimerMode('break');
        setSecondsRemaining(breakMinutes * 60);
      } else {
        sound.playChime(false);
        setTimerMode('work');
        setSecondsRemaining(workMinutes * 60);
      }
      setIsTimerRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, secondsRemaining, timerMode, workMinutes, breakMinutes]);

  const handleStartTimer = () => {
    if (!isTimerRunning) sound.playChime(false);
    setIsTimerRunning(!isTimerRunning);
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setSecondsRemaining(timerMode === 'work' ? workMinutes * 60 : breakMinutes * 60);
  };

  // Generate Quiz handler
  const handleGenerateQuiz = async () => {
    setIsGeneratingQuiz(true);
    setQuizFinished(false);
    setSelectedAnswer(null);
    setCurrentQuizQuestionIndex(0);
    setQuizScore(0);
    try {
      const res = await fetch('/api/ai/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: quizSubject, topic: quizTopic }),
      });
      const data = await res.json();
      if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
        setQuizQuestions(data.questions);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  // AI Concept Explainer handler
  const handleExplainConcept = async () => {
    setIsExplaining(true);
    setExplanationOutput(null);
    try {
      const res = await fetch('/api/ai/study-explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: assistantSubject, topic: assistantTopic }),
      });
      const data = await res.json();
      setExplanationOutput(data.explanation || 'No explanation generated.');
    } catch (e) {
      console.error(e);
      setExplanationOutput('Unable to fetch explanation. Try focusing on the core definitions.');
    } finally {
      setIsExplaining(false);
    }
  };

  // Flashcard filtering
  const filteredFlashcards = flashcards.filter((fc) =>
    selectedSubjectFilter === 'all' ? true : fc.subject === selectedSubjectFilter
  );
  const activeCard = filteredFlashcards[currentCardIndex] || filteredFlashcards[0];

  const handleRateCard = (rating: 'again' | 'hard' | 'good' | 'easy') => {
    if (activeCard) {
      rateFlashcard(activeCard.id, rating);
      setIsFlipped(false);
      if (currentCardIndex < filteredFlashcards.length - 1) {
        setCurrentCardIndex((c) => c + 1);
      } else {
        setCurrentCardIndex(0);
      }
    }
  };

  const calculateDaysUntil = (dateStr?: string) => {
    if (!dateStr) return null;
    const target = new Date(dateStr);
    const now = new Date();
    const diffTime = target.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  const timerMins = Math.floor(secondsRemaining / 60);
  const timerSecs = secondsRemaining % 60;
  const timerString = `${String(timerMins).padStart(2, '0')}:${String(timerSecs).padStart(2, '0')}`;

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0e1526] border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-purple-950 text-purple-400 border border-purple-800/40">
              <GraduationCap className="w-4 h-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white">AI Study Coach & Memory Hub</h1>
          </div>
          <p className="text-xs text-slate-400">
            Grounded in cognitive science: Spaced repetition, Active recall, Interleaving, and Pomodoro focus intervals.
          </p>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs">
          {[
            { id: 'pomodoro', label: 'Pomodoro', icon: Clock },
            { id: 'flashcards', label: 'Flashcards', icon: Layers },
            { id: 'quiz', label: 'Practice Quiz', icon: HelpCircle },
            { id: 'subjects', label: 'Subjects & Exams', icon: BookOpen },
            { id: 'assistant', label: 'AI Explainer', icon: Sparkles },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id as typeof activeSection)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                activeSection === id ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1: POMODORO TIMER */}
      {activeSection === 'pomodoro' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-[#0e1526] border border-slate-800 flex flex-col items-center justify-center text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-800/40 text-purple-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-teal-400" />
              {timerMode === 'work' ? 'Deep Work Interval' : 'Restorative Break'}
            </div>

            <div className="text-7xl sm:text-8xl font-mono font-bold tracking-tight text-white drop-shadow-lg">
              {timerString}
            </div>

            {/* Interval Presets */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setWorkMinutes(25);
                  setBreakMinutes(5);
                  setSecondsRemaining(25 * 60);
                  setIsTimerRunning(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                  workMinutes === 25 ? 'bg-purple-950 border-purple-500 text-purple-200' : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                Classic 25/5m
              </button>
              <button
                onClick={() => {
                  setWorkMinutes(50);
                  setBreakMinutes(10);
                  setSecondsRemaining(50 * 60);
                  setIsTimerRunning(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                  workMinutes === 50 ? 'bg-purple-950 border-purple-500 text-purple-200' : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                Ultradian 50/10m
              </button>
            </div>

            {/* Play/Pause/Reset Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleStartTimer}
                className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-xl shadow-purple-600/25 active:scale-95 transition"
              >
                {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                {isTimerRunning ? 'Pause Interval' : 'Start Focus Interval'}
              </button>
              <button
                onClick={handleResetTimer}
                className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                title="Reset timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-400">
              Completed today: <strong className="text-teal-400 font-mono">{completedSessionsCount} intervals</strong> ({completedSessionsCount * 25} minutes total study logged)
            </div>
          </div>

          {/* Spaced Retrieval Guidelines Sidebar */}
          <div className="p-6 rounded-3xl bg-[#0e1526] border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400" /> Evidence-Based Focus Rules
            </h3>
            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <strong className="text-purple-300 block mb-0.5">1. Active Recall beats Highlighting</strong>
                Close the book and test yourself. Struggle during recall is the exact signal that triggers synaptic consolidation.
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <strong className="text-teal-300 block mb-0.5">2. Interleave Topics</strong>
                Rather than studying one subject for 4 hours, alternate two related topics (e.g. Calculus then Neuroscience) to build classification agility.
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <strong className="text-indigo-300 block mb-0.5">3. Non-Screen Breaks</strong>
                During your 5m break, stand up, look out the window at distance, or drink water. Checking your phone prevents cognitive reset.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: FLASHCARDS & SPACED REPETITION */}
      {activeSection === 'flashcards' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Filter Subject:</span>
              <select
                value={selectedSubjectFilter}
                onChange={(e) => {
                  setSelectedSubjectFilter(e.target.value);
                  setCurrentCardIndex(0);
                  setIsFlipped(false);
                }}
                className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white"
              >
                <option value="all">All Subjects ({flashcards.length})</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowAddCardModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition"
            >
              <Plus className="w-3.5 h-3.5" /> Create Flashcard
            </button>
          </div>

          {filteredFlashcards.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#0e1526] border border-slate-800 text-slate-400">
              <Layers className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              <p className="text-sm font-semibold text-slate-300">No flashcards for this subject</p>
              <button
                onClick={() => setShowAddCardModal(true)}
                className="mt-3 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
              >
                Add Your First Flashcard
              </button>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>Card {currentCardIndex + 1} of {filteredFlashcards.length}</span>
                <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-900/50">
                  {activeCard.subject}
                </span>
              </div>

              {/* 3D Flip Card */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="cursor-pointer min-h-[260px] p-8 rounded-3xl bg-[#0e1526] border border-indigo-900/40 hover:border-indigo-600/50 transition-all shadow-xl flex flex-col justify-between select-none"
              >
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="uppercase tracking-wider font-semibold text-[11px] text-teal-400">
                    {isFlipped ? 'Answer / Explanation' : 'Prompt / Question'}
                  </span>
                  <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                    <RotateCw className="w-3 h-3" /> Click anywhere to flip
                  </span>
                </div>

                <div className="my-auto py-4 text-center">
                  <p className="text-lg sm:text-xl font-medium text-white leading-relaxed">
                    {isFlipped ? activeCard.back : activeCard.front}
                  </p>
                </div>

                <div className="text-center text-[11px] text-slate-400">
                  Reviewed: <strong className="text-slate-300">{activeCard.reviewCount} times</strong>
                </div>
              </div>

              {/* Spaced Repetition Rating Buttons */}
              {isFlipped && (
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 animate-fadeIn">
                  <p className="text-xs text-center text-slate-400">Rate your recall ease (Spaced Repetition Algorithm):</p>
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      onClick={() => handleRateCard('again')}
                      className="py-2.5 rounded-xl bg-rose-950/60 border border-rose-800/40 text-rose-300 hover:bg-rose-900/60 text-xs font-semibold transition"
                    >
                      Again <span className="block text-[10px] text-rose-400/80">(&lt; 10 min)</span>
                    </button>
                    <button
                      onClick={() => handleRateCard('hard')}
                      className="py-2.5 rounded-xl bg-amber-950/60 border border-amber-800/40 text-amber-300 hover:bg-amber-900/60 text-xs font-semibold transition"
                    >
                      Hard <span className="block text-[10px] text-amber-400/80">(1 day)</span>
                    </button>
                    <button
                      onClick={() => handleRateCard('good')}
                      className="py-2.5 rounded-xl bg-indigo-950/60 border border-indigo-800/40 text-indigo-300 hover:bg-indigo-900/60 text-xs font-semibold transition"
                    >
                      Good <span className="block text-[10px] text-indigo-400/80">(3 days)</span>
                    </button>
                    <button
                      onClick={() => handleRateCard('easy')}
                      className="py-2.5 rounded-xl bg-teal-950/60 border border-teal-800/40 text-teal-300 hover:bg-teal-900/60 text-xs font-semibold transition"
                    >
                      Easy <span className="block text-[10px] text-teal-400/80">(7 days)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* SECTION 3: PRACTICE QUIZ */}
      {activeSection === 'quiz' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="p-5 rounded-2xl bg-[#0e1526] border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-400" /> AI Practice Quiz Generator
            </h3>
            <p className="text-xs text-slate-400">Generate targeted multiple-choice questions for any topic.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Subject</label>
                <input
                  type="text"
                  value={quizSubject}
                  onChange={(e) => setQuizSubject(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Topic</label>
                <input
                  type="text"
                  value={quizTopic}
                  onChange={(e) => setQuizTopic(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <button
              onClick={handleGenerateQuiz}
              disabled={isGeneratingQuiz}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 text-white font-semibold text-xs shadow-md transition disabled:opacity-50"
            >
              {isGeneratingQuiz ? 'Generating Questions...' : '✨ Generate Practice Quiz'}
            </button>
          </div>

          {/* Active Quiz Question */}
          {quizQuestions.length > 0 && !quizFinished && (
            <div className="p-6 rounded-3xl bg-[#0e1526] border border-slate-800 space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Question {currentQuizQuestionIndex + 1} of {quizQuestions.length}</span>
                <span className="font-mono text-teal-400">Score: {quizScore}</span>
              </div>

              <h4 className="text-base font-bold text-white leading-snug">
                {quizQuestions[currentQuizQuestionIndex].question}
              </h4>

              <div className="space-y-2.5">
                {quizQuestions[currentQuizQuestionIndex].options.map((option, idx) => {
                  const isSelected = selectedAnswer === idx;
                  const isCorrect = idx === quizQuestions[currentQuizQuestionIndex].correctIndex;
                  let btnStyle = 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700';

                  if (selectedAnswer !== null) {
                    if (isCorrect) {
                      btnStyle = 'bg-teal-950/70 border-teal-500 text-teal-200';
                    } else if (isSelected) {
                      btnStyle = 'bg-rose-950/70 border-rose-500 text-rose-200';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={selectedAnswer !== null}
                      onClick={() => {
                        setSelectedAnswer(idx);
                        if (isCorrect) setQuizScore((s) => s + 1);
                      }}
                      className={`w-full p-3.5 rounded-xl border text-left text-xs font-medium transition flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{option}</span>
                      {selectedAnswer !== null && isCorrect && <Check className="w-4 h-4 text-teal-400 shrink-0" />}
                      {selectedAnswer !== null && isSelected && !isCorrect && <X className="w-4 h-4 text-rose-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Explanation note when answered */}
              {selectedAnswer !== null && (
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1 animate-fadeIn">
                  <span className="font-semibold text-teal-400">Explanation:</span>
                  <p>{quizQuestions[currentQuizQuestionIndex].explanation}</p>
                </div>
              )}

              {selectedAnswer !== null && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => {
                      if (currentQuizQuestionIndex < quizQuestions.length - 1) {
                        setCurrentQuizQuestionIndex((c) => c + 1);
                        setSelectedAnswer(null);
                      } else {
                        setQuizFinished(true);
                      }
                    }}
                    className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs shadow-md hover:bg-indigo-500 transition"
                  >
                    {currentQuizQuestionIndex < quizQuestions.length - 1 ? 'Next Question →' : 'View Results'}
                  </button>
                </div>
              )}
            </div>
          )}

          {quizFinished && (
            <div className="p-8 rounded-3xl bg-[#0e1526] border border-slate-800 text-center space-y-4 animate-fadeIn">
              <Award className="w-12 h-12 mx-auto text-teal-400" />
              <h4 className="text-xl font-bold text-white">Quiz Complete!</h4>
              <p className="text-sm text-slate-300">
                You scored <strong className="text-teal-400">{quizScore}</strong> out of <strong className="text-white">{quizQuestions.length}</strong>!
              </p>
              <button
                onClick={() => {
                  setQuizFinished(false);
                  setCurrentQuizQuestionIndex(0);
                  setSelectedAnswer(null);
                  setQuizScore(0);
                }}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs shadow-lg transition"
              >
                Retake Quiz
              </button>
            </div>
          )}
        </div>
      )}

      {/* SECTION 4: SUBJECTS, EXAM COUNTDOWNS & ASSIGNMENTS */}
      {activeSection === 'subjects' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Subjects & Exam Countdowns</h3>
            <button
              onClick={() => setShowAddSubjectModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition"
            >
              <Plus className="w-3.5 h-3.5" /> Add Subject
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subjects.map((sub) => {
              const daysLeft = calculateDaysUntil(sub.targetExamDate);
              return (
                <div key={sub.id} className="p-5 rounded-2xl bg-[#0e1526] border border-slate-800 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sub.color }} />
                        <h4 className="text-sm font-bold text-white">{sub.name}</h4>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        Exam: {sub.targetExamDate || 'Not set'} • {daysLeft !== null ? `${daysLeft} days remaining` : ''}
                      </span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-slate-300 font-medium">
                      {sub.difficulty}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Subject Mastery</span>
                      <span className="text-teal-400 font-mono">{sub.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-teal-400 rounded-full" style={{ width: `${sub.progress}%` }} />
                    </div>
                  </div>

                  <div className="pt-1">
                    <p className="text-[11px] font-semibold text-slate-300 mb-1">Core Topics:</p>
                    <div className="flex flex-wrap gap-1">
                      {sub.topics.map((t, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900/80 border border-slate-800 text-slate-400">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Assignments Section */}
          <div className="p-6 rounded-3xl bg-[#0e1526] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Assignments & Homework</h3>
                <p className="text-xs text-slate-400">Due dates, estimated duration, and completion tracking.</p>
              </div>
              <button
                onClick={() => setShowAddAssignModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
              >
                <Plus className="w-3.5 h-3.5" /> Add Assignment
              </button>
            </div>

            <div className="space-y-2">
              {assignments.map((asgn) => (
                <div
                  key={asgn.id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition ${
                    asgn.completed ? 'bg-slate-950/40 border-slate-900 opacity-60' : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleCompleteAssignment(asgn.id)}
                      className={`w-5 h-5 rounded-md flex items-center justify-center transition ${
                        asgn.completed ? 'bg-teal-500 text-white' : 'border border-slate-600 hover:border-teal-400'
                      }`}
                    >
                      {asgn.completed && <Check className="w-3.5 h-3.5" />}
                    </button>
                    <div>
                      <p className={`text-xs font-semibold ${asgn.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                        {asgn.title}
                      </p>
                      <span className="text-[11px] text-slate-400">
                        {asgn.subject} • Due {asgn.dueDate} • ~{asgn.estimatedMinutes} mins
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteAssignment(asgn.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: AI STUDY ASSISTANT */}
      {activeSection === 'assistant' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="p-6 rounded-3xl bg-[#0e1526] border border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-indigo-950 text-indigo-400 border border-indigo-800/40">
                <Sparkles className="w-4 h-4" />
              </span>
              <h3 className="text-base font-bold text-white">AI Concept Explainer (ELI5 & Analogy)</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enter any confusing academic concept. LifeOS simplifies it using everyday analogies, highlights key definitions, and gives you an active recall challenge.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Subject</label>
                <input
                  type="text"
                  value={assistantSubject}
                  onChange={(e) => setAssistantSubject(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Difficult Topic / Term</label>
                <input
                  type="text"
                  value={assistantTopic}
                  onChange={(e) => setAssistantTopic(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <button
              onClick={handleExplainConcept}
              disabled={isExplaining}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-xs shadow-md transition disabled:opacity-50"
            >
              {isExplaining ? 'Simplifying Concept...' : '✨ Explain Simply with Analogies'}
            </button>
          </div>

          {explanationOutput && (
            <div className="p-6 rounded-3xl bg-[#0e1526] border border-purple-900/40 text-slate-200 space-y-3 leading-relaxed text-xs animate-fadeIn whitespace-pre-wrap">
              {explanationOutput}
            </div>
          )}
        </div>
      )}

      {/* Add Flashcard Modal */}
      {showAddCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#0e1526] rounded-2xl border border-slate-700 p-6 text-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="text-sm font-bold text-white">Create New Flashcard</h4>
              <button onClick={() => setShowAddCardModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Subject</label>
                <select
                  value={newCardSubject}
                  onChange={(e) => setNewCardSubject(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Front Prompt / Question</label>
                <textarea
                  rows={2}
                  value={newCardFront}
                  onChange={(e) => setNewCardFront(e.target.value)}
                  placeholder="e.g. What is the testing effect?"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Back Answer / Explanation</label>
                <textarea
                  rows={3}
                  value={newCardBack}
                  onChange={(e) => setNewCardBack(e.target.value)}
                  placeholder="e.g. Actively retrieving information strengthens memory traces..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowAddCardModal(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newCardFront.trim() && newCardBack.trim()) {
                    addFlashcard({
                      subject: newCardSubject,
                      front: newCardFront.trim(),
                      back: newCardBack.trim(),
                      difficulty: 'good',
                    });
                    setNewCardFront('');
                    setNewCardBack('');
                    setShowAddCardModal(false);
                  }
                }}
                className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
              >
                Save Flashcard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Subject Modal */}
      {showAddSubjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#0e1526] rounded-2xl border border-slate-700 p-6 text-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="text-sm font-bold text-white">Add Subject</h4>
              <button onClick={() => setShowAddSubjectModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Subject Name</label>
                <input
                  type="text"
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  placeholder="e.g. Organic Chemistry"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Exam Date</label>
                  <input
                    type="date"
                    value={newSubDate}
                    onChange={(e) => setNewSubDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Difficulty</label>
                  <select
                    value={newSubDifficulty}
                    onChange={(e) => setNewSubDifficulty(e.target.value as 'Easy' | 'Moderate' | 'Challenging')}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Challenging">Challenging</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button onClick={() => setShowAddSubjectModal(false)} className="px-3 py-1.5 text-xs text-slate-400 hover:text-white">Cancel</button>
              <button
                onClick={() => {
                  if (newSubName.trim()) {
                    addSubject({
                      name: newSubName.trim(),
                      color: newSubColor,
                      targetExamDate: newSubDate,
                      topics: ['Core Foundations', 'Key Definitions'],
                      difficulty: newSubDifficulty,
                      progress: 30,
                    });
                    setNewSubName('');
                    setShowAddSubjectModal(false);
                  }
                }}
                className="px-4 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-semibold"
              >
                Save Subject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Assignment Modal */}
      {showAddAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#0e1526] rounded-2xl border border-slate-700 p-6 text-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="text-sm font-bold text-white">Add Assignment</h4>
              <button onClick={() => setShowAddAssignModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Assignment Title</label>
                <input
                  type="text"
                  value={newAssignTitle}
                  onChange={(e) => setNewAssignTitle(e.target.value)}
                  placeholder="e.g. Chapter 4 Practice Set"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Subject</label>
                  <select
                    value={newAssignSubject}
                    onChange={(e) => setNewAssignSubject(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newAssignDate}
                    onChange={(e) => setNewAssignDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button onClick={() => setShowAddAssignModal(false)} className="px-3 py-1.5 text-xs text-slate-400 hover:text-white">Cancel</button>
              <button
                onClick={() => {
                  if (newAssignTitle.trim()) {
                    addAssignment({
                      title: newAssignTitle.trim(),
                      subject: newAssignSubject,
                      dueDate: newAssignDate,
                      estimatedMinutes: newAssignMins,
                      completed: false,
                      priority: 'high',
                    });
                    setNewAssignTitle('');
                    setShowAddAssignModal(false);
                  }
                }}
                className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
              >
                Save Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
