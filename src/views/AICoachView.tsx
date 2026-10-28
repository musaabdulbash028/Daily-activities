import React, { useState, useRef, useEffect } from 'react';
import { useLifeOS } from '../context/LifeOSContext';
import {
  Bot,
  Send,
  Sparkles,
  User,
  Zap,
  CheckCircle,
  AlertCircle,
  Clock,
  Dumbbell,
  Moon,
  GraduationCap,
} from 'lucide-react';

export const AICoachView: React.FC = () => {
  const {
    profile,
    schedule,
    chatMessages,
    addChatMessage,
    studyMinutesToday,
    meditationMinutesToday,
    workoutLogs,
    tasks,
  } = useLifeOS();

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isLoading]);

  const quickPrompts = [
    { label: 'Audit today for schedule overload', text: 'Please audit today\'s schedule. Are there any unrealistic time blocks or conflicts?' },
    { label: 'Break down a daunting assignment', text: 'I have a large university lab report due soon. Help me break it down into 4 manageable, bite-sized tasks.' },
    { label: 'Suggest a 20-min safe workout', text: 'I only have 20 minutes before dinner. Suggest a safe, low-impact workout that won\'t spike cortisol before sleep.' },
    { label: 'Conduct my evening win review', text: 'Let\'s conduct my evening reflection. Ask me about my wins, lessons learned, and tomorrow\'s priority.' },
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    addChatMessage('user', text.trim());
    setInputMessage('');
    setIsLoading(true);

    try {
      const scheduleSummary = {
        totalBlocks: schedule.length,
        completedBlocks: schedule.filter((b) => b.completed).length,
        studyMinsToday: studyMinutesToday,
        meditationMinsToday: meditationMinutesToday,
        workoutsThisWeek: workoutLogs.length,
        pendingTasksCount: tasks.filter((t) => !t.completed).length,
      };

      const res = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          history: chatMessages.slice(-6),
          profile,
          scheduleSummary,
        }),
      });

      const data = await res.json();
      if (data.reply) {
        addChatMessage('coach', data.reply);
      } else {
        addChatMessage('coach', "I'm with you! Focus on your top priority task today and protect your 8 hours of sleep tonight.");
      }
    } catch (err) {
      console.error(err);
      addChatMessage('coach', "I'm having a connection issue, but remember: consistency beats intensity! Take a short movement break, stay hydrated, and protect your evening wind-down.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn flex flex-col h-[calc(100vh-120px)] max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-5 rounded-3xl bg-[#0e1526] border border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-teal-400 p-0.5 shadow-md">
            <div className="w-full h-full bg-[#0e1526] rounded-[14px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-teal-400" />
            </div>
          </div>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              LifeOS AI Coach
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            </h1>
            <p className="text-xs text-slate-400">
              Personalized mentor for circadian scheduling, study techniques, and burnout prevention.
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
          <span>Bed: {profile.bedTime}</span>
          <span>•</span>
          <span>Wake: {profile.wakeTime}</span>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 bg-[#0e1526] border border-slate-800 rounded-3xl p-4 sm:p-6 overflow-y-auto space-y-4">
        {chatMessages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} animate-fadeIn`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gradient-to-tr from-teal-500 to-indigo-600 text-slate-950'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none whitespace-pre-wrap'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1 opacity-70 text-[10px]">
                  <span>{isUser ? profile.name : 'LifeOS Coach'}</span>
                  <span>{msg.timestamp}</span>
                </div>
                {msg.text}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-3 animate-pulse">
            <div className="w-8 h-8 rounded-xl bg-teal-950 border border-teal-800/40 flex items-center justify-center text-teal-400">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
              Thinking and tailoring advice...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 shrink-0">
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(p.text)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-[11px] text-slate-300 whitespace-nowrap transition"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Message Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 bg-[#0e1526] border border-slate-800 p-2 rounded-2xl shrink-0"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask LifeOS Coach anything about your schedule, study methods, workouts..."
          className="flex-1 bg-transparent px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || isLoading}
          className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-teal-400 text-white disabled:opacity-40 transition shadow-md"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
