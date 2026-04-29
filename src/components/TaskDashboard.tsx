import React, { useState } from "react";
import { motion, Reorder } from "motion/react";
import { Plus, GripVertical, Sparkles, Check, Trash2, Clock } from "lucide-react";
import { cn } from "../lib/utils";
import { Task } from "../types";
import { autoSortTasks } from "../services/gemini";
import TiltCard from "./TiltCard";

interface Props {
  isSummary?: boolean;
}

const INITIAL_TASKS: Task[] = [
  { id: "1", title: "Complete LifeSync AI Design", priority: "High", completed: false },
  { id: "2", title: "Morning Workout - 30 mins", priority: "Medium", completed: true },
  { id: "3", title: "Read 'Atomic Habits' - 10 pages", priority: "Low", completed: false },
  { id: "4", title: "React Performance Review", priority: "High", completed: false },
];

export default function TaskDashboard({ isSummary }: Props) {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isSorting, setIsSorting] = useState(false);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTaskTitle,
      priority: "Medium",
      completed: false,
    };
    setTasks([newTask, ...tasks]);
    setNewTaskTitle("");
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleAutoSort = async () => {
    setIsSorting(true);
    const sortedData = await autoSortTasks(tasks);
    if (sortedData && Array.isArray(sortedData)) {
      const newTasks = [...tasks].sort((a, b) => {
        const indexA = sortedData.findIndex(s => s.id === a.id);
        const indexB = sortedData.findIndex(s => s.id === b.id);
        return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
      });
      // Also update priorities if provided
      const updatedTasks = newTasks.map(t => {
        const sortInfo = sortedData.find(s => s.id === t.id);
        return sortInfo ? { ...t, priority: sortInfo.priority as any } : t;
      });
      setTasks(updatedTasks);
    }
    setIsSorting(false);
  };

  if (isSummary) {
    return (
      <TiltCard intensity={5} className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg">Top Priorities</h3>
          <button onClick={handleAutoSort} disabled={isSorting} className="text-neon-cyan hover:text-white transition-colors">
            {isSorting ? <Clock className="animate-spin w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
          </button>
        </div>
        <div className="space-y-3">
          {tasks.filter(t => !t.completed).slice(0, 3).map(task => (
            <div key={task.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
              <div className={cn(
                "w-1 h-6 rounded-full",
                task.priority === "High" ? "bg-red-500" : task.priority === "Medium" ? "bg-yellow-500" : "bg-blue-500"
              )} />
              <span className="text-sm font-medium line-clamp-1">{task.title}</span>
            </div>
          ))}
        </div>
      </TiltCard>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
            AI Task Manager
          </h1>
          <p className="text-gray-400 mt-1">Optimize your flow with Gemini intelligence.</p>
        </div>
        <button
          onClick={handleAutoSort}
          disabled={isSorting}
          className="flex items-center gap-2 px-4 py-2 bg-neon-cyan/20 text-neon-cyan rounded-lg border border-neon-cyan/30 hover:bg-neon-cyan/30 transition-all font-medium disabled:opacity-50"
        >
          {isSorting ? <Clock className="animate-spin w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
          {isSorting ? "Sorting..." : "Auto-Sort"}
        </button>
      </div>

      <form onSubmit={addTask} className="relative">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="What's the next mission?"
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-16 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 focus:border-transparent transition-all placeholder:text-gray-600"
        />
        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-neon-cyan text-black rounded-xl hover:scale-105 transition-transform">
          <Plus size={24} />
        </button>
      </form>

      <Reorder.Group axis="y" values={tasks} onReorder={setTasks} className="space-y-3">
        {tasks.map((task) => (
          <Reorder.Item
            key={task.id}
            value={task}
            className={cn(
              "group flex items-center gap-4 p-4 glass-panel transition-all active:scale-[0.98] cursor-grab active:cursor-grabbing",
              task.completed && "opacity-60"
            )}
          >
            <GripVertical className="text-gray-600 group-hover:text-gray-400 transition-colors shrink-0" size={20} />
            
            <button
              onClick={() => toggleTask(task.id)}
              className={cn(
                "w-6 h-6 rounded-lg border flex items-center justify-center transition-all shrink-0",
                task.completed 
                  ? "bg-neon-cyan border-neon-cyan text-black" 
                  : "border-white/20 hover:border-neon-cyan/50"
              )}
            >
              {task.completed && <Check size={14} strokeWidth={4} />}
            </button>

            <span className={cn(
              "flex-1 font-medium transition-all",
              task.completed && "line-through text-gray-500"
            )}>
              {task.title}
            </span>

            <div className={cn(
              "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0",
              task.priority === "High" ? "bg-red-500/10 text-red-500 border border-red-500/20" :
              task.priority === "Medium" ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20" :
              "bg-blue-500/10 text-blue-500 border border-blue-500/20"
            )}>
              {task.priority}
            </div>

            <button
              onClick={() => deleteTask(task.id)}
              className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all"
            >
              <Trash2 size={18} />
            </button>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
}
