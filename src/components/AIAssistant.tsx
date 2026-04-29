import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Send, Sparkles, BrainCircuit, Lightbulb, Zap } from "lucide-react";
import { getAssistantResponse } from "../services/gemini";
import { cn } from "../lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Props {
  onClose: () => void;
}

export default function AIAssistant({ onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Greetings, Commander. I am LifeSync AI. How can I optimize your trajectory today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setIsTyping(true);

    const response = await getAssistantResponse(userMsg);
    setMessages(prev => [...prev, { role: "assistant", content: response }]);
    setIsTyping(false);
  };

  const suggestions = [
    { text: "Optimize my morning routine", icon: Zap },
    { text: "Help me stay focused", icon: BrainCircuit },
    { text: "Suggest a healthy meal", icon: Lightbulb },
  ];

  return (
    <motion.div
      initial={{ x: 400 }}
      animate={{ x: 0 }}
      exit={{ x: 400 }}
      className="fixed right-0 top-0 bottom-0 w-[400px] glass-panel m-4 z-50 flex flex-col bg-black/80 backdrop-blur-2xl border-l border-white/20 shadow-2xl"
    >
      <div className="p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-neon-cyan/5 to-neon-violet/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-neon-cyan flex items-center justify-center neon-glow-cyan">
             <Sparkles className="text-black w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight uppercase tracking-widest text-neon-cyan">Life Assistant</h2>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Online</span>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <X size={20} />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-6 custom-scrollbar">
        {messages.map((msg, i) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={i}
            className={cn(
              "flex",
              msg.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div className={cn(
              "max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed",
              msg.role === "user" 
                ? "bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan" 
                : "bg-white/5 border border-white/5"
            )}>
              {msg.content}
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white/5 p-4 rounded-2xl flex gap-1">
              <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>

      <div className="p-6 space-y-4">
        {messages.length === 1 && (
          <div className="grid grid-cols-1 gap-2">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => { setInput(s.text); }}
                className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-neon-cyan/30 hover:bg-neon-cyan/5 text-xs font-medium text-left transition-all"
              >
                <s.icon size={14} className="text-neon-cyan" />
                {s.text}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a command..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-4 pr-12 focus:outline-none focus:ring-1 focus:ring-neon-cyan placeholder:text-gray-600 text-sm"
          />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-neon-cyan hover:bg-neon-cyan/10 rounded-lg">
            <Send size={18} />
          </button>
        </form>
      </div>
    </motion.div>
  );
}
