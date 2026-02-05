"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Database, Target, Trash2,
    ChevronRight, Loader2, AlertCircle
} from "lucide-react";


// 1. Define the structure
interface Event {
    _id: string;
    eventName: string;
    eventType?: string;
}

export default function ViewQuestionsPage() {
    const [events, setEvents] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState("");
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    // Load Events for the Dropdown
    useEffect(() => {
        fetch("/api/events-fetch")
            .then(res => res.json())
            .then(data => setEvents(data.data || []));
    }, []);

    // Fetch Questions
    const fetchQuestions = async () => {
        setLoading(true);
        try {
            const url = selectedEventId
                ? `/api/admin/questions/fetch?eventId=${selectedEventId}`
                : `/api/admin/questions/fetch`;

            const res = await fetch(url);
            if (!res.ok) throw new Error(`Status_${res.status}`);
            const data = await res.json();
            setQuestions(data.data || []);
        } catch (err: any) {
            console.error("FETCH_ERROR:", err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, [selectedEventId]);

    // 🗑️ DELETE SINGLE QUESTION
    const handleDeleteSingle = async (id: string) => {
        if (!confirm("PERMANENTLY DELETE THIS UNIT?")) return;

        try {
            const res = await fetch(`/api/admin/questions/delete?questionId=${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                setQuestions(questions.filter((q: any) => q._id !== id));
            } else {
                alert("DELETE_FAILED");
            }
        } catch (err) {
            console.error("DELETE_ERROR", err);
        }
    };

    // 💣 PURGE ALL FOR EVENT
    const handlePurgeEvent = async () => {
        const [events, setEvents] = useState<Event[]>([]);
        if (!selectedEventId) return;
        const eventName = events.find((e: any) => e._id === selectedEventId)?.eventName;

        if (!confirm(`EXTERMINATE ALL DATA FOR: ${eventName}?`)) return;

        setActionLoading(true);
        try {
            const res = await fetch(`/api/admin/questions/delete?eventId=${selectedEventId}`, {
                method: "DELETE",
            });
            if (res.ok) {
                setQuestions([]);
                alert("DATABASE_PURGED");
            }
        } catch (err) {
            alert("PURGE_FAILED");
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020202] text-zinc-300 p-6 md:p-12 font-sans selection:bg-red-600 selection:text-white">
            <div className="max-w-7xl mx-auto">

                {/* HUD HEADER */}
                <header className="mb-12 border-b border-white/10 pb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h1 className="text-4xl md:text-5xl font-[1000] text-white uppercase italic tracking-tighter">
                            INTEL_<span className="text-red-600">ARCHIVE</span>
                        </h1>
                        <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.3em]">Query_Segment: {selectedEventId || "GLOBAL"}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        {/* PURGE BUTTON */}
                        {selectedEventId && questions.length > 0 && (
                            <button
                                onClick={handlePurgeEvent}
                                disabled={actionLoading}
                                className="flex items-center gap-2 px-6 py-3 bg-red-600/10 border border-red-600/30 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all disabled:opacity-50"
                            >
                                {actionLoading ? <Loader2 className="animate-spin" size={14} /> : <Trash2 size={14} />}
                                Purge_Event_Segment
                            </button>
                        )}

                        <div className="flex items-center gap-4 bg-zinc-900/50 p-1.5 rounded-2xl border border-white/5">
                            <Target size={18} className="ml-3 text-red-600" />
                            <select
                                value={selectedEventId}
                                onChange={(e) => setSelectedEventId(e.target.value)}
                                className="bg-transparent text-white font-black uppercase text-xs p-3 outline-none cursor-pointer min-w-[220px]"
                            >
                                <option value="">ALL_SYSTEM_RECORDS</option>
                                {events.map((e: any) => (
                                    <option key={e._id} value={e._id} className="bg-black text-white">{e.eventName}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </header>

                {/* RESULTS GRID */}
                {loading ? (
                    <div className="h-96 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-12 h-12 text-red-600 animate-spin" strokeWidth={1} />
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600">Syncing_Records...</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {questions.length === 0 ? (
                            <div className="text-center py-32 border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.01]">
                                <Database className="mx-auto text-zinc-800 mb-6" size={60} strokeWidth={1} />
                                <p className="font-black text-zinc-600 uppercase tracking-[0.5em] text-xs">Sector_Empty</p>
                            </div>
                        ) : (
                            questions.map((q: any, i) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.03 }}
                                    key={q._id}
                                    className="bg-zinc-900/20 border border-white/5 p-8 rounded-[2.5rem] hover:border-red-600/30 transition-all group relative overflow-hidden"
                                >
                                    {/* DELETE ACTION BUTTON */}
                                    <button
                                        onClick={() => handleDeleteSingle(q._id)}
                                        className="absolute top-6 right-8 p-3 bg-zinc-900 rounded-xl text-zinc-600 hover:text-red-500 border border-white/5 hover:border-red-600/30 transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={18} />
                                    </button>

                                    {/* META TAGS */}
                                    <div className="flex flex-wrap items-center gap-3 mb-6">
                                        <div className="bg-zinc-800 text-zinc-400 font-mono text-[9px] px-3 py-1 rounded-md font-black uppercase border border-white/5">
                                            ID_{q._id.slice(-4)}
                                        </div>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-red-500 bg-red-500/10 px-3 py-1 rounded-md border border-red-500/20">
                                            {q.type}
                                        </span>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 bg-white/5 px-3 py-1 rounded-md border border-white/10">
                                            {q.eventName}
                                        </span>
                                    </div>

                                    <h3 className="text-2xl font-[1000] text-white mb-8 leading-tight uppercase italic tracking-tight max-w-[90%]">{q.question}</h3>

                                    {/* OPTIONS HUD */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                        {q.options.map((opt: string, idx: number) => (
                                            <div
                                                key={idx}
                                                className={`p-5 rounded-2xl border text-[11px] font-black uppercase flex items-center gap-4 transition-all
                                                    ${idx === q.correctIndex
                                                        ? "bg-green-600/10 border-green-600/30 text-green-400"
                                                        : "bg-black/40 border-white/5 text-zinc-500"}`}
                                            >
                                                <div className={`w-2 h-2 rounded-full ${idx === q.correctIndex ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-zinc-800'}`} />
                                                <span className="flex-1">{opt}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* EXPLANATION / CODE BLOCKS */}
                                    {q.explanation && (
                                        <div className="pt-6 border-t border-white/5 flex gap-4">
                                            <AlertCircle size={14} className="text-red-600 shrink-0 mt-0.5" />
                                            <p className="text-[10px] font-mono text-zinc-500 uppercase leading-relaxed italic">
                                                <span className="text-white font-black mr-2">LOG_ENTRY:</span> {q.explanation}
                                            </p>
                                        </div>
                                    )}
                                </motion.div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}