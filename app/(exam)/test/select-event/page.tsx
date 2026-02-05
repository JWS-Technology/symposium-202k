"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaPlay, FaLock, FaTrophy, FaTerminal, FaIdCard } from "react-icons/fa";

interface RegisteredEvent {
    eventName: string;
    eventType: string;
}

export default function SelectEventPage() {
    const router = useRouter();
    const [events, setEvents] = useState<RegisteredEvent[]>([]);
    const [participantName, setParticipantName] = useState("");

    // 🛡️ Fix: State to prevent Hydration Mismatch
    const [isMounted, setIsMounted] = useState(false);
    const [randomLogs, setRandomLogs] = useState<string[]>([]);

    useEffect(() => {
        setIsMounted(true);

        const storedEvents = localStorage.getItem("participant_events");
        const storedData = localStorage.getItem("participant_data");

        // Debugging: Check the console to see what is being retrieved
        console.log("Buffer Check:", storedEvents);

        if (storedEvents && storedEvents !== "undefined" && storedEvents !== "null") {
            try {
                const parsedEvents = JSON.parse(storedEvents);
                // Ensure we are setting an array even if data is weird
                setEvents(Array.isArray(parsedEvents) ? parsedEvents : []);

                if (storedData) {
                    setParticipantName(JSON.parse(storedData).name);
                }
            } catch (err) {
                console.error("DATA_READ_ERROR:", err);
            }
        }
    }, []);

    const handleStartTest = (eventName: string) => {
        localStorage.setItem("active_event", eventName);
        router.push(`/test/live`);
    };

    return (
        <div className="min-h-screen bg-[#020202] text-white p-6 md:p-12 font-sans relative overflow-hidden">

            {/* BACKGROUND LOGIC DECOR - Rendered only after mounting */}
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none font-mono text-[10px] leading-none">
                {isMounted && randomLogs.map((log, i) => (
                    <div key={i} className="whitespace-nowrap">
                        {log}
                    </div>
                ))}
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                {/* USER PROFILE HUD */}
                <header className="mb-12 flex items-center justify-between border-b border-white/10 pb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-600/20 border border-red-600/50 rounded-full flex items-center justify-center">
                            <FaIdCard className="text-red-600" />
                        </div>
                        <div>
                            <h2 className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Operator_Detected</h2>
                            <h1 className="text-xl font-black uppercase italic tracking-tighter">{participantName || "UNRESOLVED_USER"}</h1>
                        </div>
                    </div>
                    <div className="text-right hidden md:block">
                        <p className="text-[10px] font-mono text-red-500 uppercase font-bold tracking-widest">Status: Ready_For_Prelims</p>
                        <p className="text-[9px] font-mono text-zinc-600 uppercase">Latency: 14ms</p>
                    </div>
                </header>

                <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-2">
                        <FaTerminal className="text-red-600 text-xs" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Available_Sectors</span>
                    </div>
                    <h3 className="text-4xl font-[1000] italic uppercase tracking-tighter">SELECT <span className="text-red-600">MISSION</span></h3>
                </div>

                {/* EVENT CARDS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {events.length > 0 ? (
                        events.map((event, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="group relative bg-zinc-900/30 border border-white/5 p-8 rounded-[2rem] hover:border-red-600/50 transition-all cursor-pointer overflow-hidden"
                                onClick={() => handleStartTest(event.eventName)}
                            >
                                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-opacity">
                                    <FaTrophy size={60} />
                                </div>

                                <span className="text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-500/10 px-3 py-1 rounded-md mb-4 inline-block border border-red-500/20">
                                    {event.eventType}
                                </span>

                                <h4 className="text-2xl font-black text-white uppercase italic mb-6 leading-tight group-hover:text-red-500 transition-colors">
                                    {event.eventName}
                                </h4>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-mono">
                                        <FaLock className="text-zinc-700" size={10} />
                                        ENCRYPTED_LINK
                                    </div>
                                    <div className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-xl font-black text-[10px] uppercase group-hover:bg-red-600 group-hover:text-white transition-all">
                                        Initialize <FaPlay size={8} />
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full p-12 border-2 border-dashed border-white/5 rounded-[3rem] text-center">
                            <p className="text-zinc-600 font-mono text-xs uppercase tracking-widest">No Registered Events Found in Data_Buffer</p>
                        </div>
                    )}
                </div>

                <footer className="mt-12 pt-8 border-t border-white/5 text-center">
                    <p className="text-[9px] font-mono text-zinc-700 uppercase tracking-[0.5em]">
                        Warning: Once initialized, the timer cannot be paused.
                    </p>
                </footer>
            </div>
        </div>
    );
}