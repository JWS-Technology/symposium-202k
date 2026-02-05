"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    UploadCloud, CheckCircle2, AlertTriangle,
    Database, Loader2, Brackets,
    Trash2, Eye, ShieldCheck, ChevronRight,
    Target, Cpu, Terminal, Zap
} from "lucide-react";

// Types
type Question = {
    type?: "mcq" | "code";
    question: string;
    code?: string;
    language?: string;
    options: string[];
    subject?: string;
    difficulty?: string;
};

type Event = {
    _id: string;
    eventName: string;
    eventType: string;
};

export default function ImportQuestionsPage() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedEventId, setSelectedEventId] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    // 1. Fetch Available Events
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch("/api/events-fetch");
                const result = await res.json();
                if (res.ok && Array.isArray(result.data)) {
                    setEvents(result.data);
                }
            } catch (err) {
                console.error("EVENT_SYNC_FAILURE");
            }
        };
        fetchEvents();
    }, []);

    // Inside ImportQuestionsPage component
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError("");
        setSuccess("");
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            try {
                const rawContent = reader.result as string;

                // 🛡️ Debug: Log the first few characters to see what's being read
                console.log("File content start:", rawContent.substring(0, 50));

                const parsed = JSON.parse(rawContent);

                if (!Array.isArray(parsed)) {
                    throw new Error("JSON must be an ARRAY [ ... ]");
                }

                const validated = parsed.filter((q: any) =>
                    q.question && Array.isArray(q.options)
                );

                if (validated.length === 0) {
                    throw new Error("No valid question units found in array.");
                }

                setQuestions(validated);
                setSuccess(`STAGED: ${validated.length} units detected.`);
            } catch (err: any) {
                // This will now show "Unexpected token..." with more detail
                setError(`JSON_PARSE_ERROR: ${err.message.toUpperCase()}`);
                console.error("FULL_ERROR:", err);
            }
        };
        reader.readAsText(file);
    };

    // 3. Execute Database Injection
    const handleImport = async () => {
        if (!selectedEventId) {
            setError("TARGET_LOCK_REQUIRED");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const res = await fetch("/api/admin/questions/import", { // Correct path based on your route.ts location
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    eventId: selectedEventId,
                    questions: questions
                }),
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "INJECTION_ABORTED");

            setSuccess(`SUCCESS: ${data.count} units integrated into ${data.event}.`);
            setQuestions([]);
            setSelectedEventId("");
        } catch (err: any) {
            setError(err.message.toUpperCase());
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020202] text-zinc-300 p-4 md:p-10 font-sans selection:bg-red-600 selection:text-white">
            <div className="max-w-7xl mx-auto">

                {/* --- HEADER SECTION --- */}
                <header className="mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-white/10 pb-10">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="text-red-600 animate-pulse" size={18} />
                            <span className="text-red-500 font-mono text-[10px] tracking-[0.5em] uppercase font-black">Admin_Injection_Terminal</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-[1000] italic text-white uppercase tracking-tighter leading-none">
                            INTEL_<span className="text-red-600">IMPORT</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {questions.length > 0 && (
                            <button
                                onClick={() => { setQuestions([]); setSelectedEventId(""); }}
                                className="px-6 py-5 bg-zinc-900 border border-white/5 text-zinc-500 hover:text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all"
                            >
                                <Trash2 size={16} /> Wipe_Buffer
                            </button>
                        )}
                        <button
                            onClick={handleImport}
                            disabled={loading || questions.length === 0 || !selectedEventId}
                            className={`px-10 py-5 font-[1000] uppercase text-xs tracking-[0.3em] rounded-xl transition-all flex items-center gap-4 
                                ${questions.length > 0 && selectedEventId
                                    ? "bg-red-600 text-white shadow-2xl shadow-red-600/20 hover:scale-105 active:scale-95"
                                    : "bg-zinc-800 text-zinc-600 cursor-not-allowed"}`}
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <Database size={20} />}
                            {loading ? "INJECTING..." : "EXECUTE_INJECTION"}
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* --- SIDEBAR: CONTROLS --- */}
                    <aside className="lg:col-span-4 space-y-6">

                        {/* TARGET SELECTION */}
                        <div className="bg-zinc-900/40 border border-white/5 p-6 rounded-[2rem] space-y-4">
                            <div className="flex items-center gap-2">
                                <Target size={16} className="text-red-600" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Target_Event_Link</span>
                            </div>
                            <select
                                value={selectedEventId}
                                onChange={(e) => setSelectedEventId(e.target.value)}
                                className="w-full bg-black border border-white/10 rounded-xl p-4 text-xs font-bold uppercase text-white focus:border-red-600 outline-none transition-all appearance-none cursor-pointer"
                            >
                                <option value="">SELECT_TARGET_DATABASE...</option>
                                {events.map((event) => (
                                    <option key={event._id} value={event._id}>
                                        {event.eventName} — [{event.eventType}]
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* FILE UPLOAD */}
                        <div className="relative group bg-zinc-900/10 border-2 border-dashed border-white/5 rounded-[2rem] p-10 transition-all hover:border-red-600/30">
                            <input type="file" accept=".json" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                            <div className="flex flex-col items-center text-center">
                                <div className="p-5 bg-zinc-800 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                                    <UploadCloud size={32} className="text-red-600" />
                                </div>
                                <h3 className="text-white font-black uppercase italic tracking-tighter mb-1">Load_JSON</h3>
                                <p className="text-zinc-600 font-mono text-[9px] tracking-widest uppercase">Select Intel Payload</p>
                            </div>
                        </div>

                        {/* STATUS MESSAGES */}
                        <AnimatePresence>
                            {error && (
                                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="p-4 bg-red-600/10 border-l-4 border-red-600 rounded-r-lg flex items-center gap-3">
                                    <AlertTriangle className="text-red-600" size={18} />
                                    <p className="text-red-500 font-black uppercase text-[10px] tracking-widest">{error}</p>
                                </motion.div>
                            )}
                            {success && (
                                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="p-4 bg-green-600/10 border-l-4 border-green-600 rounded-r-lg flex items-center gap-3">
                                    <CheckCircle2 className="text-green-500" size={18} />
                                    <p className="text-green-500 font-black uppercase text-[10px] tracking-widest">{success}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </aside>

                    {/* --- MAIN: PREVIEW HUD --- */}
                    <main className="lg:col-span-8 bg-zinc-900/20 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-3xl h-[700px] relative flex flex-col shadow-2xl">

                        {/* PREVIEW HEADER */}
                        <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-zinc-900/60 sticky top-0 z-20">
                            <div className="flex items-center gap-4">
                                <Eye className="text-red-600" size={18} />
                                <span className="font-black uppercase tracking-[0.3em] text-[10px] text-white italic">Pre_Injection_Review</span>
                            </div>

                            {selectedEventId && (
                                <div className="flex items-center gap-3 px-4 py-1.5 bg-red-600/10 border border-red-600/20 rounded-full">
                                    <Zap size={12} className="text-red-600 animate-pulse" />
                                    <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">
                                        TARGET: {events.find(e => e._id === selectedEventId)?.eventName}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* QUESTIONS LIST */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                            {questions.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center opacity-10">
                                    <Terminal size={120} strokeWidth={1} />
                                    <p className="font-black uppercase tracking-[1em] text-xs mt-4 ml-4">Waiting_for_Payload</p>
                                </div>
                            ) : (
                                questions.map((q, i) => (
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} key={i} className="bg-zinc-950/50 border border-white/5 rounded-3xl p-8 hover:border-red-600/30 transition-all group">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-4">
                                                <span className="text-red-600 font-mono text-[10px] font-black group-hover:scale-125 transition-transform">0{i + 1}</span>
                                                <div className="flex gap-2">
                                                    <span className="text-[9px] text-red-500 bg-red-500/10 px-2 py-0.5 rounded uppercase font-black tracking-widest border border-red-500/20">{q.type || 'MCQ'}</span>
                                                    {q.subject && <span className="text-[9px] text-zinc-400 bg-white/5 px-2 py-0.5 rounded uppercase font-black tracking-widest">{q.subject}</span>}
                                                </div>
                                            </div>
                                            <div className="h-px flex-1 bg-white/5 mx-4" />
                                            <Cpu size={14} className="text-zinc-800 group-hover:text-red-600 transition-colors" />
                                        </div>

                                        <h4 className="text-xl font-[1000] text-white mb-6 italic uppercase tracking-tight leading-tight">{q.question}</h4>

                                        {/* CODE BLOCK PREVIEW */}
                                        {q.type === "code" && q.code && (
                                            <div className="mb-6 rounded-2xl overflow-hidden border border-white/10 bg-black/50">
                                                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border-b border-white/5">
                                                    <div className="w-2 h-2 rounded-full bg-red-500/50" />
                                                    <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">{q.language || 'source'}.bin</span>
                                                </div>
                                                <pre className="p-6 text-[11px] font-mono text-red-400/80 overflow-x-auto">
                                                    <code>{q.code}</code>
                                                </pre>
                                            </div>
                                        )}

                                        {/* OPTIONS GRID */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {(q.options || []).map((opt, idx) => (
                                                <div key={idx} className={`p-4 rounded-xl border text-[10px] font-black uppercase flex items-center gap-3 transition-all ${opt?.startsWith("*") ? "bg-green-600/10 border-green-600/40 text-green-500" : "bg-white/5 border-white/5 text-zinc-600"}`}>
                                                    <ChevronRight size={14} className={opt?.startsWith("*") ? "text-green-500" : "text-zinc-800"} />
                                                    {opt?.replace("*", "")}
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </main>
                </div>
            </div>

            {/* CUSTOM SCROLLBAR CSS */}
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #dc2626; }
            `}</style>
        </div>
    );
}