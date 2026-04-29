/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "motion/react";
import { 
  LayoutDashboard, 
  CheckSquare, 
  HeartPulse, 
  BrainCircuit, 
  MessageSquare,
  Menu,
  X,
  Sparkles,
  Search,
  Bell,
  Settings,
  Plus,
  Calendar as CalendarIcon
} from "lucide-react";
import { cn } from "./lib/utils";
import TaskDashboard from "./components/TaskDashboard";
import HealthTracker from "./components/HealthTracker";
import TalentHub from "./components/TalentHub";
import AIAssistant from "./components/AIAssistant";
import CalendarView from "./components/CalendarView";
import TiltCard from "./components/TiltCard";

type Tab = "dashboard" | "tasks" | "health" | "talent" | "calendar";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  // Handle mobile responsiveness
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Toggle AI Assistant with a shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowAIAssistant(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "calendar", label: "Calendar", icon: CalendarIcon },
    { id: "tasks", label: "To-Do List", icon: CheckSquare },
    { id: "health", label: "Health & Fitness", icon: HeartPulse },
    { id: "talent", label: "Talent Hub", icon: BrainCircuit },
  ];

  return (
    <div className="flex h-screen bg-[#050505] overflow-hidden text-gray-100">
      {/* Sidebar Navigation */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 80 }}
        className="glass-panel m-4 mr-0 flex flex-col border-r border-white/10 overflow-hidden"
      >
        <div className="p-6 flex items-center justify-between">
          <AnimatePresence mode="wait">
            {isSidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-neon-cyan to-neon-violet rounded-lg flex items-center justify-center neon-glow-cyan">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight">LifeSync AI</span>
              </motion.div>
            )}
          </AnimatePresence>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group",
                activeTab === item.id 
                  ? "bg-white/10 text-neon-cyan neon-border-cyan" 
                  : "hover:bg-white/5 text-gray-400"
              )}
            >
              <item.icon size={22} className={cn(
                "transition-transform",
                activeTab === item.id ? "scale-110" : "group-hover:scale-110"
              )} />
              {isSidebarOpen && (
                <span className="font-medium">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <button
            onClick={() => setShowAIAssistant(true)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-4 rounded-xl bg-gradient-to-r from-neon-cyan/20 to-neon-violet/20 border border-neon-cyan/30 hover:border-neon-cyan/60 transition-all group",
              !isSidebarOpen && "justify-center"
            )}
          >
            <MessageSquare size={22} className="text-neon-cyan" />
            {isSidebarOpen && (
              <div className="text-left">
                <p className="text-xs font-bold text-neon-cyan uppercase tracking-widest">AI Assistant</p>
                <p className="text-[10px] text-gray-400">Ctrl+K to toggle</p>
              </div>
            )}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header */}
        <header className="h-20 px-8 flex items-center justify-between z-10">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search your life..." 
                className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-neon-cyan/50 transition-colors text-sm"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-white/5 rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-neon-cyan rounded-full animate-pulse" />
            </button>
            <button className="p-2 hover:bg-white/5 rounded-full">
              <Settings size={20} />
            </button>
            <div className="flex items-center gap-3 ml-4 glass-panel px-3 py-1.5 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-gray-800 border border-white/10 overflow-hidden">
                <img 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                  alt="Avatar" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-sm font-medium">Khadija</span>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {activeTab === "dashboard" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Summary Widgets */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <TiltCard intensity={10} className="p-6 neon-border-cyan">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-neon-cyan mb-4">Total Energy</h3>
                        <div className="flex items-end gap-2">
                          <span className="text-4xl font-bold">84%</span>
                          <span className="text-green-400 text-sm mb-1">+5% from yesterday</span>
                        </div>
                      </TiltCard>
                      <TiltCard intensity={10} className="p-6 neon-border-violet">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-neon-violet mb-4">Focus Score</h3>
                        <div className="flex items-end gap-2">
                          <span className="text-4xl font-bold">92</span>
                          <span className="text-neon-violet text-sm mb-1">Peak performance</span>
                        </div>
                      </TiltCard>
                    </div>
                    <TaskDashboard isSummary />
                  </div>
                  <div className="space-y-6">
                    <CalendarView isSummary />
                    <HealthTracker isSummary />
                    <TalentHub isSummary />
                  </div>
                </div>
              )}
              {activeTab === "calendar" && <CalendarView />}
              {activeTab === "tasks" && <TaskDashboard />}
              {activeTab === "health" && <HealthTracker />}
              {activeTab === "talent" && <TalentHub />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* AI Assistant Persistent Sidebar/Panel */}
        <AnimatePresence>
          {showAIAssistant && (
            <AIAssistant onClose={() => setShowAIAssistant(false)} />
          )}
        </AnimatePresence>
      </main>

      {/* Decorative background elements */}
      <div className="fixed top-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-cyan/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-neon-violet/5 rounded-full blur-[100px] pointer-events-none" />
    </div>
  );
}

