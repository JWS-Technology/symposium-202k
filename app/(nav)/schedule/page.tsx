"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    Clock,
    MapPin,
    Zap,
    ChevronRight,
    Trophy,
    Coffee,
    Mic2,
    Monitor
} from "lucide-react";

const scheduleData = [
    { event: "Registration", round: "—", time: "8:30 – 9:00 AM", venue: "Jubilee Hall", type: "admin" },
    { event: "Inauguration", round: "—", time: "9:00 – 10:00 AM", venue: "Jubilee Hall", type: "admin" },
    { event: "Debugging", round: "Prelims", time: "10:00 – 10:45 AM", venue: "JCICT", type: "tech" },
    { event: "Web Design", round: "Prelims", time: "10:00 – 10:45 AM", venue: "JCICT", type: "tech" },
    { event: "IPL Auction", round: "Prelims", time: "10:00 – 10:45 AM", venue: "JCICT", type: "non-tech" },
    { event: "Ad-Zap", round: "Prelims", time: "10:00 – 10:45 AM", venue: "IB Room No. 30", type: "non-tech" },
    { event: "Paper Presentation", round: "Final", time: "10:50 – 12:20 PM", venue: "IB Secura Hall", type: "tech" },
    { event: "Lunch Break", round: "—", time: "12:20 – 1:00 PM", venue: "Canteen Back Side", type: "break" },
    { event: "Debugging", round: "Finals", time: "1:00 – 1:40 PM", venue: "JCICT", type: "tech" },
    { event: "Web Design", round: "Finals", time: "1:00 – 1:40 PM", venue: "JCICT", type: "tech" },
    { event: "Quiz", round: "Prelims", time: "1:45 – 2:15 PM", venue: "IB Room No. 32", type: "tech" },
    { event: "Quiz", round: "Finals", time: "2:20 – 3:00 PM", venue: "IB Room No. 32", type: "tech" },
    { event: "IPL Auction", round: "Finals", time: "2:20 – 3:00 PM", venue: "Secura Hall", type: "non-tech" },
    { event: "Ad-Zap", round: "Finals", time: "2:20 – 3:00 PM", venue: "Jubilee Hall", type: "non-tech" },
    { event: "Singing", round: "Final", time: "3:05 – 3:30 PM", venue: "Jubilee Hall", type: "cultural" },
    { event: "Dance", round: "Final", time: "3:30 – 3:55 PM", venue: "Jubilee Hall", type: "cultural" },
    { event: "Valedictory", round: "—", time: "4:00 – 4:40 PM", venue: "Jubilee Hall", type: "admin" },
];

export default function SchedulePage() {
    return (
        <div className="min-h-screen bg-[#050505] text-white py-12 px-4 md:px-8 relative overflow-hidden font-sans">

            {/* Background Spider Web Decoration */}
            <div className="fixed inset-0 opacity-10 pointer-events-none">
                <svg width="100%" height="100%"><path d="M0 0 L1000 1000 M200 0 L1000 800 M0 200 L800 1000" stroke="red" strokeWidth="1" fill="none" /></svg>
            </div>

            <div className="max-w-5xl mx-auto relative z-10">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-red-600 font-mono tracking-[0.4em] text-xs mb-2">TIMELINE_PROTOCOL_v2.6</h2>
                    <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter">
                        EVENT <span className="text-red-600">CHRONICLE_</span>
                    </h1>
                    <div className="w-24 h-1 bg-red-600 mx-auto mt-4 skew-x-[-20deg]" />
                </motion.div>

                {/* Schedule Table Interface */}
                <div className="bg-zinc-900/30 border border-white/10 rounded-3xl backdrop-blur-md overflow-hidden shadow-2xl">

                    {/* Table Header (Desktop only) */}
                    <div className="hidden md:grid grid-cols-12 bg-red-600 text-black font-black uppercase italic p-4 text-sm tracking-widest">
                        <div className="col-span-5 flex items-center gap-2"><Zap size={16} /> Event Name</div>
                        <div className="col-span-2">Round</div>
                        <div className="col-span-2">Time</div>
                        <div className="col-span-3 text-right">Venue</div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-white/5">
                        {scheduleData.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className={`grid grid-cols-1 md:grid-cols-12 p-5 items-center gap-4 hover:bg-white/[0.03] transition-colors relative group
                  ${item.type === 'break' ? 'bg-blue-900/10' : ''}
                  ${item.type === 'admin' ? 'bg-zinc-800/20' : ''}
                `}
                            >
                                {/* Visual Accent */}
                                <div className="absolute left-0 w-1 h-full bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />

                                {/* Event & Round */}
                                <div className="col-span-5">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg border ${getTypeColor(item.type)}`}>
                                            {getIcon(item.type)}
                                        </div>
                                        <div>
                                            <h3 className="font-black uppercase italic tracking-tight text-lg md:text-xl group-hover:text-red-500 transition-colors">
                                                {item.event}
                                            </h3>
                                            <span className="md:hidden text-[10px] font-mono text-zinc-500 block uppercase">
                                                Round: {item.round}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Round (Desktop Only) */}
                                <div className="hidden md:block col-span-2">
                                    <span className={`text-[10px] font-mono px-2 py-1 border rounded ${item.round === '—' ? 'border-zinc-800 text-zinc-600' : 'border-red-900 text-red-400'}`}>
                                        {item.round}
                                    </span>
                                </div>

                                {/* Time */}
                                <div className="col-span-2 flex items-center gap-2 text-zinc-300 font-mono text-sm">
                                    <Clock size={14} className="text-red-600" />
                                    {item.time}
                                </div>

                                {/* Venue */}
                                <div className="col-span-3 text-right flex md:justify-end items-center gap-2 text-zinc-400 font-black italic uppercase text-xs">
                                    <span className="md:hidden text-zinc-600">VENUE:</span>
                                    <MapPin size={14} className="text-cyan-500" />
                                    {item.venue}
                                    <ChevronRight size={14} className="hidden md:block text-zinc-800" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Legend */}
                <div className="mt-8 flex flex-wrap justify-center gap-6 text-[10px] font-mono text-zinc-500 uppercase tracking-widest bg-black/50 p-4 rounded-full border border-white/5">
                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-600" /> Technical</div>
                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cyan-500" /> Non-Technical</div>
                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-500" /> Cultural</div>
                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-zinc-600" /> Logistics</div>
                </div>

            </div>
        </div>
    );
}

/* --- HELPER FUNCTIONS --- */

function getTypeColor(type: string) {
    switch (type) {
        case 'tech': return 'border-red-600/30 text-red-600';
        case 'non-tech': return 'border-cyan-600/30 text-cyan-600';
        case 'cultural': return 'border-yellow-600/30 text-yellow-600';
        case 'break': return 'border-blue-600/30 text-blue-600';
        default: return 'border-zinc-700 text-zinc-500';
    }
}

function getIcon(type: string) {
    switch (type) {
        case 'tech': return <Monitor size={16} />;
        case 'non-tech': return <Zap size={16} />;
        case 'cultural': return <Mic2 size={16} />;
        case 'break': return <Coffee size={16} />;
        default: return <Trophy size={16} />;
    }
}