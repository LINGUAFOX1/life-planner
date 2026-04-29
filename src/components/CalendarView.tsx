import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Calendar as CalendarIcon, RefreshCw, ExternalLink, ShieldCheck, LogOut, Clock } from "lucide-react";
import { cn } from "../lib/utils";
import { CalendarEvent } from "../types";
import TiltCard from "./TiltCard";

interface Props {
  isSummary?: boolean;
}

export default function CalendarView({ isSummary }: Props) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/status");
      const data = await res.json();
      setIsAuthenticated(data.isAuthenticated);
      if (data.isAuthenticated) {
        fetchEvents();
      }
    } catch (error) {
      console.error("Auth status error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/calendar/events");
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (error) {
      console.error("Fetch events error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      const response = await fetch("/api/auth/google/url");
      const { url } = await response.json();
      
      const width = 600;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      const authWindow = window.open(
        url,
        "google_oauth",
        `width=${width},height=${height},left=${left},top=${top}`
      );

      if (!authWindow) {
        alert("Popup blocked! Please allow popups for this site.");
      }
    } catch (error) {
      console.error("OAuth URL error:", error);
    }
  };

  useEffect(() => {
    checkAuth();

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        setIsAuthenticated(true);
        fetchEvents();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setIsAuthenticated(false);
    setEvents([]);
  };

  if (isSummary) {
    return (
      <TiltCard intensity={5} className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg leading-tight uppercase tracking-widest text-xs text-gray-500">Upcoming Flow</h3>
          {isAuthenticated && (
            <button onClick={fetchEvents} className="text-gray-500 hover:text-neon-cyan transition-colors">
              <RefreshCw size={14} className={cn(loading && "animate-spin")} />
            </button>
          )}
        </div>
        
        {!isAuthenticated ? (
          <button 
            onClick={handleConnect}
            className="w-full p-4 border border-white/10 rounded-xl flex items-center justify-center gap-2 hover:bg-white/5 transition-colors text-sm font-medium"
          >
            <CalendarIcon size={16} className="text-neon-cyan" />
            Connect Calendar
          </button>
        ) : (
          <div className="space-y-4">
            {events.length === 0 ? (
              <p className="text-xs text-gray-500 italic">No events scheduled today.</p>
            ) : (
              events.slice(0, 3).map(event => (
                <div key={event.id} className="flex gap-3">
                  <div className="w-1 h-8 rounded-full bg-neon-cyan/40" />
                  <div>
                    <p className="text-xs font-bold line-clamp-1">{event.summary}</p>
                    <p className="text-[10px] text-gray-500">
                      {event.start?.dateTime ? new Date(event.start.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "All-day"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </TiltCard>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">LifeStream Calendar</h1>
          <p className="text-gray-400">Harmonizing your digital schedule.</p>
        </div>
        {isAuthenticated ? (
          <div className="flex gap-2">
            <button onClick={fetchEvents} className="p-2 hover:bg-white/5 rounded-lg border border-white/10 transition-colors">
              <RefreshCw size={20} className={cn(loading && "animate-spin")} />
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 hover:bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg transition-all text-sm font-medium">
              <LogOut size={16} /> Disconnect
            </button>
          </div>
        ) : (
          <button 
            onClick={handleConnect}
            className="flex items-center gap-2 px-6 py-3 bg-neon-cyan text-black rounded-xl font-bold hover:scale-105 transition-all neon-glow-cyan"
          >
            <CalendarIcon size={20} />
            Sync Google Calendar
          </button>
        )}
      </div>

      {!isAuthenticated ? (
        <div className="glass-panel p-12 text-center space-y-6 bg-gradient-to-br from-neon-cyan/5 to-transparent">
          <div className="w-20 h-20 bg-neon-cyan/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-neon-cyan/20">
            <ShieldCheck size={40} className="text-neon-cyan" />
          </div>
          <h2 className="text-2xl font-bold">Secure Integration</h2>
          <p className="text-gray-400 max-w-md mx-auto">
            Connect your Google Calendar to visualize your day, eliminate conflicts, and let LifeSync AI optimize your tasks around your reality.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs font-bold text-gray-500 uppercase tracking-widest pt-4">
             <div className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-neon-cyan" /> Read-only access</div>
             <div className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-neon-cyan" /> Secure Tokens</div>
             <div className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-neon-cyan" /> Real-time Sync</div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {events.length === 0 && !loading ? (
            <div className="glass-panel p-12 text-center">
              <p className="text-gray-500">Your schedule is currently clear. Optimization potential detected.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {events.map((event) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={event.id}
                  className="glass-panel p-6 flex items-center justify-between group hover:neon-border-cyan transition-all"
                >
                  <div className="flex items-center gap-6">
                    <div className="hidden sm:flex flex-col items-center justify-center w-16 h-16 bg-white/5 rounded-2xl border border-white/5">
                      <Clock size={20} className="text-neon-cyan mb-1" />
                      <span className="text-[10px] font-bold text-gray-500 uppercase">
                         {event.start?.dateTime ? new Date(event.start.dateTime).toLocaleTimeString([], { hour: 'numeric', hour12: true }).split(' ')[0] : "Day"}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg group-hover:text-neon-cyan transition-colors">{event.summary}</h3>
                      <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock size={14} /> 
                          {event.start?.dateTime ? new Date(event.start.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "All Day"}
                          {event.end?.dateTime && ` - ${new Date(event.end.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                        </span>
                        {event.status === "confirmed" && (
                          <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[10px] font-bold uppercase rounded-md border border-green-500/20">Confirmed</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button className="p-3 bg-white/5 rounded-xl border border-white/5 opacity-0 group-hover:opacity-100 transition-all text-gray-400 hover:text-white">
                    <ExternalLink size={20} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
