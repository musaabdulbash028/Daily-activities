import React, { useState } from 'react';
import { useLifeOS } from '../context/LifeOSContext';
import {
  Brain,
  Sparkles,
  Zap,
  CheckCircle2,
  Info,
  Maximize2,
  Play,
  RotateCcw,
  Target,
  Sun,
  Moon,
  Droplets,
  Dumbbell,
  Clock,
  Layers,
} from 'lucide-react';

export const BrainPerformanceView: React.FC = () => {
  const { setFocusMode } = useLifeOS();
  const [activeChallenge, setActiveChallenge] = useState<'memory' | 'stroop' | 'math'>('memory');

  // Memory Span Game State
  const [memorySequence, setMemorySequence] = useState<number[]>([]);
  const [memoryInput, setMemoryInput] = useState<string>('');
  const [memoryLevel, setMemoryLevel] = useState<number>(4);
  const [isShowingSequence, setIsShowingSequence] = useState<boolean>(false);
  const [memoryFeedback, setMemoryFeedback] = useState<string | null>(null);

  const startMemoryChallenge = () => {
    const seq = Array.from({ length: memoryLevel }, () => Math.floor(Math.random() * 10));
    setMemorySequence(seq);
    setMemoryInput('');
    setMemoryFeedback(null);
    setIsShowingSequence(true);
    setTimeout(() => {
      setIsShowingSequence(false);
    }, memoryLevel * 900);
  };

  const checkMemoryAnswer = () => {
    const entered = memoryInput.replace(/\s+/g, '');
    const correct = memorySequence.join('');
    if (entered === correct) {
      setMemoryFeedback('🎉 Excellent recall! Ready for the next digit level.');
      setMemoryLevel((l) => l + 1);
    } else {
      setMemoryFeedback(`Incorrect. The sequence was ${correct}. Try again!`);
    }
  };

  // Stroop Test State
  const stroopWords = ['RED', 'BLUE', 'GREEN', 'YELLOW', 'PURPLE'];
  const stroopColors = ['text-rose-500', 'text-blue-500', 'text-emerald-500', 'text-amber-400', 'text-purple-400'];
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [currentColorIdx, setCurrentColorIdx] = useState(1);
  const [stroopScore, setStroopScore] = useState(0);
  const [stroopFeedback, setStroopFeedback] = useState<string | null>(null);

  const nextStroop = (selectedColorIdx: number) => {
    if (selectedColorIdx === currentColorIdx) {
      setStroopScore((s) => s + 1);
      setStroopFeedback('✓ Correct color filter!');
    } else {
      setStroopFeedback('✗ Attention slipped: match the ink color, not the word!');
    }
    setCurrentWordIdx(Math.floor(Math.random() * stroopWords.length));
    setCurrentColorIdx(Math.floor(Math.random() * stroopColors.length));
  };

  const cognitivePillars = [
    {
      title: '1. Active Retrieval Practice',
      icon: Target,
      tag: 'High Empirical Evidence',
      desc: 'Instead of passively reading notes, generate answers from memory. The mental retrieval struggle strengthens synaptic connections.',
    },
    {
      title: '2. Expanding Spaced Repetition',
      icon: Clock,
      tag: 'Ebbinghaus Forgetting Curve',
      desc: 'Reviewing concepts with increasing time intervals (1 day, 3 days, 1 week) prevents the natural memory decay curve.',
    },
    {
      title: '3. Interleaving Related Subjects',
      icon: Layers,
      tag: 'Category Discrimination',
      desc: 'Switch between related problem types rather than block-practicing one formula. This trains your brain to identify which method to apply.',
    },
    {
      title: '4. Physical Activity & BDNF',
      icon: Dumbbell,
      tag: 'Neurogenesis',
      desc: '20 minutes of moderate movement stimulates Brain-Derived Neurotrophic Factor (BDNF), enhancing neuroplasticity and executive focus.',
    },
    {
      title: '5. Sleep & Memory Consolidation',
      icon: Moon,
      tag: 'Hippocampal Neocortex Transfer',
      desc: 'During deep slow-wave sleep and REM phases, temporary hippocampal short-term memories are transferred into permanent long-term neocortical networks.',
    },
    {
      title: '6. Morning Daylight & Circadian Rhythm',
      icon: Sun,
      tag: 'Adenosine & Cortisol Timing',
      desc: 'Viewing morning sunlight sets your suprachiasmatic nucleus clock, triggering healthy daytime cortisol release and evening melatonin synthesis.',
    },
    {
      title: '7. Hydration & Cognitive Processing Speed',
      icon: Droplets,
      tag: 'Fluid Balance',
      desc: 'Even a 1.5% drop in cellular hydration significantly degrades sustained attention and short-term memory accuracy.',
    },
    {
      title: '8. Single-Tasking & Reducing Friction',
      icon: Zap,
      tag: 'Attention Restoration',
      desc: 'Multitasking is actually rapid context switching, which incurs a heavy metabolic cognitive penalty (attention residue). Focus on one task at a time.',
    },
  ];

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0e1526] border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-teal-950 text-teal-400 border border-teal-800/40">
              <Brain className="w-4 h-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Brain Performance & Focus Center</h1>
          </div>
          <p className="text-xs text-slate-400">
            Evidence-based cognitive science and daily mental challenges to sustain attention and long-term memory.
          </p>
        </div>

        <button
          onClick={() => setFocusMode(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 hover:scale-105 active:scale-95 transition shrink-0"
        >
          <Maximize2 className="w-4 h-4" /> Enter Focus Mode
        </button>
      </div>

      {/* Science vs Pseudo-Science Boundary Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 flex items-start gap-3 text-xs text-slate-400">
        <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
        <p>
          <strong className="text-slate-300">Scientific Integrity Notice:</strong> LifeOS does not make false claims of "unlocking 100% of brain power" or guaranteed IQ enhancement. We synthesize peer-reviewed cognitive psychology and lifestyle medicine to support sustainable mental clarity.
        </p>
      </div>

      {/* Interactive Brain Challenge Drill */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0e1526] border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-400" /> Daily Working Memory & Attention Drill
            </h3>
            <p className="text-xs text-slate-400">Warm up your working memory before a study session.</p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveChallenge('memory')}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                activeChallenge === 'memory' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Digit Span
            </button>
            <button
              onClick={() => setActiveChallenge('stroop')}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                activeChallenge === 'stroop' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Stroop Focus
            </button>
          </div>
        </div>

        {/* Challenge 1: Digit Span Recall */}
        {activeChallenge === 'memory' && (
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-4 max-w-md mx-auto">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Working Memory Level: {memoryLevel} Digits</span>
              <button
                onClick={() => {
                  setMemoryLevel(4);
                  setMemorySequence([]);
                  setMemoryFeedback(null);
                }}
                className="hover:text-white"
              >
                Reset Level
              </button>
            </div>

            {isShowingSequence ? (
              <div className="py-8">
                <p className="text-xs text-teal-400 uppercase tracking-widest font-semibold mb-2">Memorize this sequence:</p>
                <div className="text-4xl sm:text-5xl font-mono font-bold text-white tracking-widest animate-pulse">
                  {memorySequence.join(' ')}
                </div>
              </div>
            ) : memorySequence.length > 0 ? (
              <div className="space-y-3 py-4">
                <p className="text-xs text-slate-300">Enter the digits in order:</p>
                <input
                  type="text"
                  placeholder="e.g. 5821"
                  value={memoryInput}
                  onChange={(e) => setMemoryInput(e.target.value)}
                  className="w-48 text-center text-xl font-mono bg-slate-800 border border-slate-700 rounded-xl py-2 text-white focus:outline-none focus:border-indigo-500"
                />
                <div>
                  <button
                    onClick={checkMemoryAnswer}
                    className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs"
                  >
                    Check Recall
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-6 space-y-3">
                <p className="text-xs text-slate-300">A sequence of digits will appear on screen for a few seconds. Recall them from working memory.</p>
                <button
                  onClick={startMemoryChallenge}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md"
                >
                  Start Recall Drill ({memoryLevel} digits)
                </button>
              </div>
            )}

            {memoryFeedback && (
              <p className="text-xs font-semibold text-teal-300 pt-2">{memoryFeedback}</p>
            )}
          </div>
        )}

        {/* Challenge 2: Stroop Attention Inhibitory Control */}
        {activeChallenge === 'stroop' && (
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-5 max-w-md mx-auto">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Selective Attention (Inhibitory Control)</span>
              <span className="text-teal-400 font-mono">Streak: {stroopScore}</span>
            </div>

            <p className="text-xs text-slate-400">Click the button for the <strong>FONT COLOR</strong>, not the printed word!</p>

            <div className="py-4">
              <span className={`text-4xl sm:text-5xl font-extrabold tracking-wider ${stroopColors[currentColorIdx]}`}>
                {stroopWords[currentWordIdx]}
              </span>
            </div>

            <div className="grid grid-cols-5 gap-1.5">
              {stroopWords.map((colorName, idx) => (
                <button
                  key={colorName}
                  onClick={() => nextStroop(idx)}
                  className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-white border border-slate-700 transition"
                >
                  {colorName}
                </button>
              ))}
            </div>

            {stroopFeedback && (
              <p className="text-xs text-slate-300">{stroopFeedback}</p>
            )}
          </div>
        )}
      </div>

      {/* 8 Pillars of Cognitive Performance */}
      <div className="p-6 rounded-3xl bg-[#0e1526] border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white">8 Evidence-Based Cognitive Pillars</h3>
        <p className="text-xs text-slate-400">Validated by neuropsychology and educational research.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {cognitivePillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div key={idx} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-md bg-indigo-950 text-indigo-400 border border-indigo-800/40">
                      <Icon className="w-3.5 h-3.5" />
                    </span>
                    <h4 className="text-xs font-bold text-white">{p.title}</h4>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-teal-400 font-mono">
                    {p.tag}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pl-7">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
