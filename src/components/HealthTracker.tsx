import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Droplet, Flame, Timer, Waves, Plus, Minus } from "lucide-react";
import { cn } from "../lib/utils";

interface Props {
  isSummary?: boolean;
}

export default function HealthTracker({ isSummary }: Props) {
  const [water, setWater] = useState(6);
  const [calories, setCalories] = useState(1450);
  const targetCalories = 2200;
  
  const ringData = [
    { name: "Progress", value: (calories / targetCalories) * 100 },
    { name: "Remaining", value: 100 - (calories / targetCalories) * 100 }
  ];

  if (isSummary) {
    return (
      <div className="glass-panel p-6">
        <h3 className="font-bold text-lg mb-6">Vitality</h3>
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ringData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={45}
                  startAngle={90}
                  endAngle={450}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill="#bc13fe" />
                  <Cell fill="rgba(255,255,255,0.05)" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold font-mono text-neon-violet">
                {Math.round((calories / targetCalories) * 100)}%
              </span>
            </div>
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-400">
                <Droplet size={14} className="text-neon-cyan" />
                <span className="text-xs font-medium uppercase tracking-wider">Hydration</span>
              </div>
              <span className="text-sm font-bold">{water}/8 gl</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-400">
                <Flame size={14} className="text-orange-500" />
                <span className="text-xs font-medium uppercase tracking-wider">Energy</span>
              </div>
              <span className="text-sm font-bold">{calories} kcal</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="glass-panel p-8 md:col-span-2">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Health & Vitality</h1>
            <p className="text-gray-400">Fueling the biological engine.</p>
          </div>
          <div className="p-3 bg-neon-violet/10 rounded-2xl border border-neon-violet/20">
            <HeartPulse className="text-neon-violet w-8 h-8" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Progress Ring */}
          <div className="flex flex-col items-center">
            <div className="w-48 h-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ringData}
                    cx="50%"
                    cy="50%"
                    innerRadius={75}
                    outerRadius={90}
                    startAngle={90}
                    endAngle={450}
                    dataKey="value"
                    stroke="none"
                  >
                    <Cell fill="#bc13fe" />
                    <Cell fill="rgba(255,255,255,0.05)" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Flame size={24} className="text-neon-violet mb-2" />
                <span className="text-3xl font-bold">{calories}</span>
                <span className="text-[10px] uppercase tracking-tighter text-gray-500 font-bold">KCAL BURNED</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 mt-4">Daily Goal: 2,200 kcal</p>
          </div>

          <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 h-min">
            <div className="glass-panel p-6 bg-gradient-to-br from-neon-cyan/5 to-transparent border-neon-cyan/10">
              <div className="flex items-center justify-between mb-6">
                <div className="p-2 bg-neon-cyan/20 rounded-lg">
                  <Droplet size={20} className="text-neon-cyan" />
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className={cn("w-1.5 h-6 rounded-full transition-all", i < water ? "bg-neon-cyan" : "bg-white/10")} />
                  ))}
                </div>
              </div>
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Water Intake</h4>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{water} <span className="text-sm font-normal text-gray-500 italic">glasses</span></span>
                <div className="flex items-center gap-2">
                  <button onClick={() => setWater(Math.max(0, water - 1))} className="p-1 hover:bg-white/5 rounded-md border border-white/10"><Minus size={16}/></button>
                  <button onClick={() => setWater(water + 1)} className="p-1 bg-neon-cyan text-black rounded-md"><Plus size={16}/></button>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 bg-gradient-to-br from-orange-500/5 to-transparent border-orange-500/10">
              <div className="p-2 bg-orange-500/20 rounded-lg w-fit mb-6">
                <Timer size={20} className="text-orange-500" />
              </div>
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Active Time</h4>
              <span className="text-3xl font-bold">45 <span className="text-sm font-normal text-gray-500 italic">mins</span></span>
              <div className="mt-4 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: "75%" }} />
              </div>
            </div>
            
            <div className="glass-panel p-6 md:col-span-2 overflow-hidden relative group">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Weekly Forecast</h4>
                  <p className="text-xs text-green-400">On track for muscle recovery phase</p>
                </div>
                <Waves className="text-gray-700 animate-pulse" />
              </div>
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <HeartPulse size={120} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { HeartPulse } from "lucide-react";
