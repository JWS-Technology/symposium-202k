"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Layers,
    Users,
    Settings,
    Plus,
    ShieldCheck,
    Activity,
    Info
} from "lucide-react";

interface EventItem {
    _id: string;
    eventName: string;
    minPlayers: number;
    maxPlayers: number;
    eventType: string;
    createdAt: string;
}

export default function AdminEventsPage() {
    const router = useRouter();
    const [events, setEvents] = useState<EventItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            router.push("/admin/login");
            return;
        }

        fetch("/api/events-fetch", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => setEvents(data.data || []))
            .catch(err => console.error("System Override Error:", err))
            .finally(() => setLoading(false));
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020202] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-red-600 font-mono text-[10px] tracking-[0.5em] uppercase animate-pulse">Scanning_Event_Horizons...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020202] text-zinc-300 font-sans selection:bg-red-600 relative overflow-hidden">

            {/* BACKGROUND OVERLAYS */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(185,28,28,0.05),transparent)] pointer-events-none" />
            <div className="fixed inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />

            <div className="max-w-6xl mx-auto px-6 py-12 relative z-10">

                {/* HEADER */}
                <header className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="flex items-center gap-3 mb-2 font-mono text-[10px] text-red-600 tracking-[0.4em] uppercase">
                            <ShieldCheck size={14} className="animate-pulse" /> Mission_Control
                        </div>
                        <h1 className="text-6xl font-[1000] italic text-white uppercase tracking-tighter">
                            Sector_<span className="text-red-600">Events</span>
                        </h1>
                    </motion.div>

                    <button className="flex items-center gap-2 px-8 py-4 bg-red-600 text-white font-black uppercase text-xs tracking-widest skew-x-[-12deg] hover:bg-red-700 transition-all shadow-lg shadow-red-600/20">
                        <Plus size={18} className="skew-x-[12deg]" />
                        <span className="skew-x-[12deg]">Initialize New Event</span>
                    </button>
                </header>

                {/* EVENTS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((ev, i) => (
                        <motion.div
                            key={ev._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="group relative bg-[#050505] border border-zinc-900 rounded-sm p-6 hover:border-red-600/50 transition-all duration-500 overflow-hidden"
                        >
                            {/* TECH DECORATION */}
                            <div className="absolute top-0 right-0 w-16 h-16 bg-red-600/5 rotate-45 translate-x-8 -translate-y-8 group-hover:bg-red-600/10 transition-colors" />

                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-zinc-900 border border-zinc-800 text-red-600 group-hover:text-white group-hover:bg-red-600 transition-all">
                                    <Layers size={20} />
                                </div>
                                <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest border border-zinc-900 px-2 py-1">
                                    UUID: {ev._id.slice(-6)}
                                </span>
                            </div>

                            <h3 className="text-xl font-black text-white italic uppercase mb-2 group-hover:text-red-500 transition-colors">
                                {ev.eventName}
                            </h3>

                            <div className="flex items-center gap-2 mb-6">
                                <Activity size={12} className="text-red-600 animate-pulse" />
                                <span className="text-[10px] font-mono font-black text-red-600 uppercase tracking-widest">
                                    {ev.eventType}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-zinc-900">
                                <div className="space-y-1">
                                    <p className="text-[9px] text-zinc-600 font-black uppercase tracking-tighter">Capacity</p>
                                    <div className="flex items-center gap-2 text-white font-mono">
                                        <Users size={14} className="text-zinc-500" />
                                        <span className="text-sm">{ev.minPlayers} - {ev.maxPlayers}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end justify-end">
                                    <button className="text-zinc-600 hover:text-white transition-colors">
                                        <Settings size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* HOVER GLOW EFFECT */}
                            <div className="absolute bottom-0 left-0 w-0 h-1 bg-red-600 group-hover:w-full transition-all duration-700" />
                        </motion.div>
                    ))}
                </div>

                {events.length === 0 && (
                    <div className="py-24 text-center border-2 border-dashed border-zinc-900 rounded-3xl">
                        <Info className="mx-auto text-zinc-700 mb-4" size={48} />
                        <p className="text-zinc-600 font-mono text-sm uppercase tracking-[0.3em]">No events found in this sector.</p>
                    </div>
                )}
            </div>

            {/* CRT OVERLAY */}
            <div className="fixed inset-0 pointer-events-none z-[100] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%)] bg-[length:100%_4px] opacity-20" />
        </div>
    );
}