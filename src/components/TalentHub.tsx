import React from "react";
import { BrainCircuit, Star, Rocket, Trophy, Calendar } from "lucide-react";
import { cn } from "../lib/utils";

interface Props {
  isSummary?: boolean;
}

const MILESTONES = [
  { id: "1", title: "Piano Bach Prelude", date: "May 12", completed: true, type: "Art" },
  { id: "2", title: "TypeScript Advanced Patterns", date: "May 25", completed: false, type: "Code" },
  { id: "3", title: "French B2 Certification", date: "June 05", completed: false, type: "Language" },
  { id: "4", title: "Stock Trading Basics", date: "June 18", completed: false, type: "Finance" },
];

export default function TalentHub({ isSummary }: Props) {
  if (isSummary) {
    return (
      <div className="glass-panel p-6">
        <h3 className="font-bold text-lg mb-6">Mastery Timeline</h3>
        <div className="space-y-6 relative">
          <div className="absolute left-[11px] top-1 bottom-1 w-[1px] bg-white/10" />
          {MILESTONES.slice(0, 3).map((m, i) => (
            <div key={m.id} className="flex gap-4 relative">
              <div className={cn(
                "w-6 h-6 rounded-full border-4 border-[#050505] z-10 flex items-center justify-center shrink-0",
                m.completed ? "bg-neon-cyan" : "bg-gray-800"
              )}>
                <div className="w-1.5 h-1.5 bg-[#050505] rounded-full" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold leading-none mb-1">{m.title}</p>
                <p className="text-[10px] text-gray-500 uppercase flex items-center gap-1">
                  <Calendar size={8} /> {m.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Talent & Growth Hub</h1>
          <p className="text-gray-400">Tracking the evolution of your potential.</p>
        </div>
        <div className="p-3 bg-neon-cyan/10 rounded-2xl border border-neon-cyan/20">
          <BrainCircuit className="text-neon-cyan w-8 h-8" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="glass-panel p-8 relative overflow-hidden">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
              <Rocket size={20} className="text-neon-cyan" />
              Active Path: Creative Coding
            </h2>
            
            <div className="space-y-12 relative">
              <div className="absolute left-[19px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-neon-cyan via-white/10 to-white/5" />
              
              {MILESTONES.map((m, i) => (
                <div key={m.id} className="flex gap-8 group">
                  <div className={cn(
                    "w-10 h-10 rounded-xl border flex items-center justify-center z-10 transition-all group-hover:scale-110",
                    m.completed 
                      ? "bg-neon-cyan border-neon-cyan text-black neon-glow-cyan" 
                      : "bg-gray-900 border-white/10 text-gray-400"
                  )}>
                    {m.completed ? <Trophy size={18} /> : <span>{i + 1}</span>}
                  </div>
                  <div className="flex-1 pb-4 border-b border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className={cn("font-bold text-lg", m.completed ? "text-white" : "text-gray-400")}>{m.title}</h4>
                      <span className="text-xs font-mono text-gray-500">{m.date}</span>
                    </div>
                    <p className="text-sm text-gray-500">Skill Domain: {m.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-6 bg-gradient-to-br from-yellow-500/5 to-transparent border-yellow-500/10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-yellow-500">Current Level</span>
              <Star className="text-yellow-500 fill-yellow-500" size={16} />
            </div>
            <div className="text-4xl font-bold mb-2">Advanced</div>
            <p className="text-xs text-gray-500 italic">Top 15% of practitioners</p>
          </div>
          
          <div className="glass-panel p-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Skill Matrix</h4>
            <div className="space-y-4">
              {[
                { name: "Coding", progress: 85 },
                { name: "Design", progress: 70 },
                { name: "Piano", progress: 40 },
                { name: "French", progress: 62 },
              ].map(skill => (
                <div key={skill.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-gray-500">{skill.progress}%</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-neon-cyan" style={{ width: `${skill.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
