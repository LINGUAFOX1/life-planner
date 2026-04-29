import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Send, Sparkles, BrainCircuit, Lightbulb, Zap, Terminal } from "lucide-react";
import { getAssistantResponse } from "../services/gemini";
import { cn } from "../lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
  time?: string;
}

interface Props {
  onClose: () => void;
  contextData?: string;
}

export default function AIAssistant({ onClose, contextData }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "assistant", 
      content: "Greetings, Commander. I am LifeSync AI. System status: All modules operational. How can I optimize your trajectory today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, isTyping]);

  const handleSubmit = async (e?: React.FormEvent, overrideInput?: string) => {
    if (e) e.preventDefault();
    const finalInput = overrideInput || input;
    if (!finalInput.trim() || isTyping) return;

    const userMsg = finalInput;
    setInput("");
    setMessages(prev => [...prev, { 
      role: "user", 
      content: userMsg, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }]);
    setIsTyping(true);

    const response = await getAssistantResponse(userMsg, contextData);
    setMessages(prev => [...prev, { 
      role: "assistant", 
      content: response,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setIsTyping(false);
  };

  const suggestions = [
    { text: "Optimize my morning routine", icon: Zap },
    { text: "Help me stay focused", icon: BrainCircuit },
    { text: "Analyze my productivity data", icon: Terminal },
  ];

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed right-0 top-0 bottom-0 w-full sm:w-[400px] glass-panel m-0 sm:m-4 z-50 flex flex-col bg-black/60 backdrop-blur-3xl border-l border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
    >
      <div className="p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-neon-cyan/10 to-neon-violet/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-neon-cyan flex items-center justify-center neon-glow-cyan rotate-3">
             <Sparkles className="text-black w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight uppercase tracking-widest text-neon-cyan drop-shadow-sm">Life Guardian</h2>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Neural Link Active</span>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
          <X size={20} />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-6 custom-scrollbar pb-10">
        {messages.map((msg, i) => (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            key={i}
            className={cn(
              "flex flex-col",
              msg.role === "user" ? "items-end" : "items-start"
            )}
          >
            <div className={cn(
              "max-w-[90%] p-4 rounded-2xl text-sm leading-relaxed relative group",
              msg.role === "user" 
                ? "bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan rounded-tr-none" 
                : "bg-white/5 border border-white/10 text-gray-200 rounded-tl-none"
            )}>
              {msg.content}
              <div className={cn(
                "absolute -bottom-5 text-[9px] font-bold text-gray-600 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity",
                msg.role === "user" ? "right-0" : "left-0"
              )}>
                {msg.time}
              </div>
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none flex gap-1.5">
              <span className="w-1.5 h-1.5 bg-neon-cyan/50 rounded-full animate-bounce [animation-duration:0.6s]" />
              <span className="w-1.5 h-1.5 bg-neon-cyan/50 rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-neon-cyan/50 rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>

      <div className="p-6 space-y-4 bg-black/20">
        {messages.length < 3 && (
          <div className="grid grid-cols-1 gap-2">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => { handleSubmit(undefined, s.text); }}
                className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-neon-cyan/40 hover:bg-neon-cyan/5 text-[11px] font-bold uppercase tracking-wider text-gray-400 hover:text-neon-cyan transition-all group"
              >
                <s.icon size={14} className="group-hover:scale-110 transition-transform" />
                {s.text}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Terminal size={14} className="text-gray-600" />
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Initialize command..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-10 pr-12 focus:outline-none focus:border-neon-cyan/50 focus:bg-white/[0.07] transition-all placeholder:text-gray-700 text-sm font-medium"
          />
          <button 
            type="submit" 
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-neon-cyan/10 text-neon-cyan hover:bg-neon-cyan hover:text-black rounded-lg transition-all"
          >
            <Send size={18} />
          </button>
        </form>
        <p className="text-[10px] text-center text-gray-600 font-bold uppercase tracking-widest">
          Powered by Gemini 3.0 Flash Nexus
        </p>
      </div>
    </motion.div>
  );
}
