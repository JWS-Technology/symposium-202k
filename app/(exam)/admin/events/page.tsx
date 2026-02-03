"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Layers,
    Users,
    Settings,
    Plus,
    ShieldCheck,
    Activity,
    Info,
    Terminal,
    Cpu
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
            <div className="min-h-screen bg-[#020202] flex items-center justify-center font-mono">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                        <div className="w-16 h-16 border-2 border-red-600/20 rounded-full" />
                        <div className="absolute top-0 w-16 h-16 border-t-2 border-red-600 rounded-full animate-spin" />
                    </div>
                    <div className="text-center">
                        <p className="text-red-600 font-bold text-xs tracking-[0.5em] uppercase animate-pulse">Establishing_Link...</p>
                        <p className="text-zinc-700 text-[8px] mt-2 tracking-widest uppercase">Sector_Access_Granted</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020202] text-zinc-300 font-sans selection:bg-red-600 relative overflow-hidden">

            {/* AMBIENT BACKGROUND */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(185,28,28,0.08),transparent_50%)] pointer-events-none" />
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_100%_100%,rgba(185,28,28,0.05),transparent_50%)] pointer-events-none" />

            {/* GRID MESH */}
            <div className="fixed inset-0 opacity-[0.15] pointer-events-none"
                style={{ backgroundImage: `radial-gradient(#333 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />

            <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">

                {/* TOP STATUS BAR */}
                <div className="flex items-center justify-between mb-12 border-b border-zinc-900 pb-6">
                    <div className="flex items-center gap-6 text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
                        <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> System_Live</div>
                        <div className="hidden md:block">Node_Ref: 01-A</div>
                    </div>
                    <div className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
                        Total_Sectors: {events.length}
                    </div>
                </div>

                {/* HEADER */}
                <header className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-8">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="flex items-center gap-2 mb-3 text-red-600 group">
                            <Cpu size={14} className="group-hover:rotate-180 transition-transform duration-500" />
                            <span className="font-mono text-[9px] tracking-[0.4em] uppercase">Core_Database</span>
                        </div>
                        <h1 className="text-7xl font-black italic text-white uppercase tracking-tighter leading-none">
                            EVENT_<span className="text-red-600">UNITS</span>
                        </h1>
                    </motion.div>

                    <Link href="/create-event">
                        <button className="relative group px-10 py-5 bg-red-600 text-white font-black uppercase text-xs tracking-[0.2em] skew-x-[-12deg] hover:bg-red-700 transition-all shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:shadow-red-600/50">
                            <div className="absolute inset-0 w-1 bg-white/20 translate-x-[-100%] group-hover:translate-x-[1000%] transition-all duration-700" />
                            <div className="flex items-center gap-3 skew-x-[12deg]">
                                <Plus size={20} strokeWidth={3} />
                                <span>Initialize New Event</span>
                            </div>
                        </button>
                    </Link>
                </header>

                {/* GRID SYSTEM */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((ev, i) => (
                        <motion.div
                            key={ev._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className="group relative bg-zinc-950/50 border border-zinc-900 p-8 hover:bg-black transition-all duration-300"
                        >
                            {/* CORNER BORDER ACCENT */}
                            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-zinc-700 group-hover:border-red-600 transition-colors" />
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-zinc-700 group-hover:border-red-600 transition-colors" />

                            <div className="flex justify-between items-start mb-8">
                                <div className="p-3 bg-zinc-900/50 border border-zinc-800 text-red-600 group-hover:shadow-[0_0_15px_rgba(220,38,38,0.2)] transition-all">
                                    <Terminal size={20} />
                                </div>
                                <div className="text-right">
                                    <div className="text-[8px] font-mono text-zinc-600 uppercase tracking-tighter mb-1">Index_Hash</div>
                                    <div className="font-mono text-[10px] text-zinc-400">#{ev._id.slice(-6).toUpperCase()}</div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-2xl font-black text-white italic uppercase tracking-tight group-hover:translate-x-1 transition-transform">
                                    {ev.eventName}
                                </h3>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
                                    <span className="text-[10px] font-mono font-bold text-red-600 uppercase tracking-widest">
                                        {ev.eventType}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4 pt-6 border-t border-zinc-900/50">
                                <div className="flex justify-between items-end">
                                    <div className="space-y-1">
                                        <p className="text-[8px] text-zinc-500 font-black uppercase tracking-widest">Unit_Capacity</p>
                                        <div className="flex items-center gap-2 text-white">
                                            <Users size={14} className="text-red-600" />
                                            <span className="text-lg font-mono font-bold">{ev.minPlayers.toString().padStart(2, '0')} — {ev.maxPlayers.toString().padStart(2, '0')}</span>
                                        </div>
                                    </div>
                                    <button className="p-2 hover:bg-zinc-900 rounded-md transition-colors text-zinc-600 hover:text-red-500">
                                        <Settings size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* HOVER GLOW BAR */}
                            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-zinc-900 group-hover:bg-red-600 transition-colors" />
                        </motion.div>
                    ))}
                </div>

                {events.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-32 flex flex-col items-center justify-center border border-zinc-900 bg-zinc-950/20"
                    >
                        <Info className="text-zinc-800 mb-6" size={64} strokeWidth={1} />
                        <p className="text-zinc-600 font-mono text-xs uppercase tracking-[0.4em]">Empty_Data_Set_Detected</p>
                        <Link href="/create-event" className="mt-8 text-red-600 text-[10px] font-bold uppercase tracking-widest hover:underline underline-offset-8">
                            Initialize_First_Node
                        </Link>
                    </motion.div>
                )}
            </div>

            {/* OVERLAY EFFECTS */}
            <div className="fixed inset-0 pointer-events-none z-[100] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_8px] opacity-10" />
            <div className="fixed inset-0 pointer-events-none z-[100] border-[40px] border-black opacity-20 blur-2xl" />
        </div>
    );
}