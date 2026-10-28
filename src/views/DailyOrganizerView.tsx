import React, { useState } from 'react';
import { useLifeOS } from '../context/LifeOSContext';
import { TaskItem, Priority } from '../types';
import {
  CheckSquare,
  Plus,
  Trash2,
  Check,
  Sparkles,
  Sun,
  Moon,
  Tag,
  Clock,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const DailyOrganizerView: React.FC = () => {
  const {
    tasks,
    addTask,
    toggleTaskComplete,
    deleteTask,
    toggleSubtask,
    routines,
    toggleRoutineItem,
    addRoutineItem,
  } = useLifeOS();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<TaskItem['category']>('Study');
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>('medium');
  const [newTaskDate, setNewTaskDate] = useState(new Date().toISOString().split('T')[0]);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  // Quick subtask add state
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  // Routine tab: morning vs evening
  const [routineTab, setRoutineTab] = useState<'morning' | 'evening'>('morning');

  const filteredTasks = tasks.filter((t) =>
    activeCategory === 'All' ? true : t.category === activeCategory
  );

  const morningRoutines = routines.filter((r) => r.type === 'morning');
  const eveningRoutines = routines.filter((r) => r.type === 'evening');

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask({
      title: newTaskTitle.trim(),
      category: newTaskCategory,
      priority: newTaskPriority,
      dueDate: newTaskDate,
      completed: false,
      subtasks: [],
    });
    setNewTaskTitle('');
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0e1526] border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-indigo-950 text-indigo-400 border border-indigo-800/40">
              <CheckSquare className="w-4 h-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Daily Life Organizer</h1>
          </div>
          <p className="text-xs text-slate-400">
            Keep your responsibilities structured, track morning & evening rituals, and prevent mental overwhelm.
          </p>
        </div>
      </div>

      {/* Morning & Evening Routines Section */}
      <div className="p-6 rounded-3xl bg-[#0e1526] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setRoutineTab('morning')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                  routineTab === 'morning' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-400" /> Morning Routine
              </button>
              <button
                onClick={() => setRoutineTab('evening')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                  routineTab === 'evening' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-indigo-400" /> Evening Wind-Down
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {(routineTab === 'morning' ? morningRoutines : eveningRoutines).map((item) => (
            <div
              key={item.id}
              onClick={() => toggleRoutineItem(item.id)}
              className={`cursor-pointer p-3.5 rounded-xl border flex items-center justify-between gap-3 transition ${
                item.completedToday
                  ? 'bg-slate-950/40 border-slate-800 opacity-60'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className={`w-5 h-5 rounded-md flex items-center justify-center transition shrink-0 ${
                    item.completedToday ? 'bg-teal-500 text-white' : 'border border-slate-600'
                  }`}
                >
                  {item.completedToday && <Check className="w-3.5 h-3.5" />}
                </button>
                <span className={`text-xs font-medium ${item.completedToday ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                  {item.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Task Creation & Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Task Manager */}
        <div className="lg:col-span-2 space-y-4">
          {/* Quick Add Form */}
          <form onSubmit={handleCreateTask} className="p-4 rounded-2xl bg-[#0e1526] border border-slate-800 space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                required
                placeholder="What do you need to accomplish today?"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition"
              >
                <Plus className="w-4 h-4" /> Add Task
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Category:</span>
                <select
                  value={newTaskCategory}
                  onChange={(e) => setNewTaskCategory(e.target.value as TaskItem['category'])}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
                >
                  <option value="Study">Study</option>
                  <option value="Personal">Personal</option>
                  <option value="Work">Work</option>
                  <option value="Errands">Errands</option>
                  <option value="Shopping">Shopping</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Priority:</span>
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value as Priority)}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Due:</span>
                <input
                  type="date"
                  value={newTaskDate}
                  onChange={(e) => setNewTaskDate(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
                />
              </div>
            </div>
          </form>

          {/* Category Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {['All', 'Study', 'Personal', 'Work', 'Errands', 'Shopping'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
                  activeCategory === cat
                    ? 'border-indigo-500 bg-indigo-950/60 text-indigo-200'
                    : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Task Items List */}
          <div className="space-y-2">
            {filteredTasks.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-[#0e1526] border border-slate-800 text-slate-400 text-xs">
                No tasks in this category. All clear!
              </div>
            ) : (
              filteredTasks.map((t) => {
                const isExpanded = expandedTaskId === t.id;
                const completedSubs = t.subtasks?.filter((st) => st.completed).length || 0;
                const totalSubs = t.subtasks?.length || 0;

                return (
                  <div
                    key={t.id}
                    className={`rounded-2xl border transition-all ${
                      t.completed ? 'bg-slate-950/30 border-slate-900 opacity-60' : 'bg-[#0e1526] border-slate-800'
                    }`}
                  >
                    <div className="p-3.5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleTaskComplete(t.id)}
                          className={`w-5 h-5 rounded-md flex items-center justify-center transition shrink-0 ${
                            t.completed ? 'bg-teal-500 text-white' : 'border border-slate-600 hover:border-teal-400'
                          }`}
                        >
                          {t.completed && <Check className="w-3.5 h-3.5" />}
                        </button>
                        <div>
                          <p className={`text-xs font-semibold ${t.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                            {t.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">{t.category}</span>
                            {t.dueDate && <span>Due {t.dueDate}</span>}
                            {totalSubs > 0 && <span>• {completedSubs}/{totalSubs} subtasks</span>}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {t.priority === 'high' && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 font-semibold">
                            HIGH
                          </span>
                        )}
                        <button
                          onClick={() => setExpandedTaskId(isExpanded ? null : t.id)}
                          className="p-1.5 text-slate-400 hover:text-white rounded-lg"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => deleteTask(t.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Subtasks Accordion */}
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-1 border-t border-slate-800/60 space-y-2 text-xs">
                        {t.subtasks && t.subtasks.length > 0 && (
                          <div className="space-y-1.5 pl-6">
                            {t.subtasks.map((st) => (
                              <div
                                key={st.id}
                                onClick={() => toggleSubtask(t.id, st.id)}
                                className="cursor-pointer flex items-center gap-2 text-slate-300"
                              >
                                <div
                                  className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                                    st.completed ? 'bg-teal-500 border-teal-500 text-white' : 'border-slate-600'
                                  }`}
                                >
                                  {st.completed && <Check className="w-2.5 h-2.5" />}
                                </div>
                                <span className={st.completed ? 'line-through text-slate-500' : ''}>{st.title}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Time-Use & Priorities Guide */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-[#0e1526] border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-400" /> Daily Time-Use Estimation
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Sleep Opportunity:</span>
                <span className="font-mono text-teal-400">8.0 hrs (33%)</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Core Study / Deep Work:</span>
                <span className="font-mono text-purple-400">2.5 hrs (10%)</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Fixed Commitments:</span>
                <span className="font-mono text-amber-400">3.5 hrs (15%)</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Safe Exercise / Movement:</span>
                <span className="font-mono text-teal-400">0.7 hrs (3%)</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Meals & Breaks:</span>
                <span className="font-mono text-indigo-400">2.5 hrs (10%)</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Personal & Leisure:</span>
                <span className="font-mono text-slate-400">6.8 hrs (29%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
