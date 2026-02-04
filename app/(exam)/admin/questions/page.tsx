"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    UploadCloud, CheckCircle2, AlertTriangle,
    Database, Cpu, Code2, Loader2, Brackets,
    Trash2, Eye, ShieldCheck, BarChart3, Layers, ChevronRight
} from "lucide-react";

type Question = {
    type?: "mcq" | "code";
    question: string;
    code?: string;
    language?: string;
    options: string[];
    subject?: string;
    difficulty?: string;
};

export default function ImportQuestionsPage() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError("");
        setSuccess("");
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            try {
                const parsed = JSON.parse(reader.result as string);
                if (!Array.isArray(parsed)) throw new Error("INVALID_PROTOCOL: Payload must be an Array.");

                // 🛡️ CRITICAL FIX: Ensure 'options' exists before setting state
                const validated = parsed.filter((q: any) =>
                    q.question && Array.isArray(q.options)
                );

                if (validated.length !== parsed.length) {
                    setError(`${parsed.length - validated.length} MALFORMED_UNITS_REJECTED`);
                }

                setQuestions(validated);
                setSuccess(`STAGED: ${validated.length} units ready for injection.`);
            } catch (err: any) {
                setError("DECRYPTION_FAILED: CHECK_JSON_STRUCTURE");
            }
        };
        reader.readAsText(file);
    };

    const handleImport = async () => {
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const res = await fetch("/api/admin/questions/import", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(questions),
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "UPLINK_FAILURE");

            setSuccess(`INJECTION_COMPLETE: ${data.count} units integrated.`);
            setQuestions([]);
        } catch (err: any) {
            setError(err.message.toUpperCase());
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020202] text-zinc-300 p-4 md:p-10 font-sans selection:bg-red-600">
            <div className="max-w-7xl mx-auto">

                {/* 1. HEADER HUD */}
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
                                onClick={() => setQuestions([])}
                                className="px-6 py-5 bg-zinc-900 border border-white/5 text-zinc-500 hover:text-red-500 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                            >
                                <Trash2 size={16} /> Wipe_Buffer
                            </button>
                        )}
                        <button
                            onClick={handleImport}
                            disabled={loading || questions.length === 0}
                            className={`px-10 py-5 font-[1000] uppercase text-xs tracking-[0.3em] rounded-xl transition-all flex items-center gap-4 shadow-2xl
                                ${questions.length > 0
                                    ? "bg-red-600 text-white hover:bg-white hover:text-black shadow-red-600/20"
                                    : "bg-zinc-800 text-zinc-600 cursor-not-allowed"}`}
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <Database size={20} />}
                            {loading ? "INJECTING..." : "EXECUTE_INJECTION"}
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* 2. UPLOAD SECTOR */}
                    <aside className="lg:col-span-4 space-y-6">
                        <div className="relative group bg-zinc-900/10 border-2 border-dashed border-white/5 rounded-[2rem] p-10 transition-all hover:border-red-600/30 hover:bg-zinc-900/30">
                            <input
                                type="file" accept=".json" onChange={handleFileUpload}
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            />
                            <div className="flex flex-col items-center text-center">
                                <div className="p-5 bg-zinc-800 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                                    <UploadCloud size={32} className="text-red-600" />
                                </div>
                                <h3 className="text-white font-black uppercase italic tracking-tighter mb-1">Load_JSON</h3>
                                <p className="text-zinc-600 font-mono text-[9px] tracking-widest uppercase">Select Intelligence Payload</p>
                            </div>
                        </div>

                        {/* ALERTS */}
                        <AnimatePresence>
                            {error && (
                                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="p-4 bg-red-600/10 border-l-4 border-red-600 rounded-r-lg flex items-center gap-3">
                                    <AlertTriangle className="text-red-600" size={18} />
                                    <p className="text-red-500 font-black uppercase text-[10px] tracking-widest">{error}</p>
                                </motion.div>
                            )}
                            {success && (
                                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="p-4 bg-green-600/10 border-l-4 border-green-600 rounded-r-lg flex items-center gap-3">
                                    <CheckCircle2 className="text-green-500" size={18} />
                                    <p className="text-green-500 font-black uppercase text-[10px] tracking-widest">{success}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </aside>

                    {/* 3. PREVIEW HUD */}
                    <main className="lg:col-span-8 bg-zinc-900/20 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-3xl flex flex-col h-[650px] shadow-2xl relative">
                        <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-zinc-900/60 sticky top-0 z-20">
                            <div className="flex items-center gap-4">
                                <Eye className="text-red-600" size={18} />
                                <span className="font-black uppercase tracking-[0.3em] text-[10px] text-white italic">Pre_Injection_Review</span>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                            {questions.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center opacity-10">
                                    <Brackets size={120} strokeWidth={1} />
                                    <p className="font-black uppercase tracking-[1em] text-xs mt-4">Buffer_Empty</p>
                                </div>
                            ) : (
                                questions.map((q, i) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                        key={i} className="relative bg-zinc-950/50 border border-white/5 rounded-3xl p-8 hover:border-red-600/20 transition-all"
                                    >
                                        <div className="flex items-center gap-4 mb-4">
                                            <span className="text-red-600 font-mono text-[10px] font-black">0{i + 1}</span>
                                            <div className="flex gap-2">
                                                {q.subject && <span className="text-[9px] bg-white/5 px-2 py-0.5 rounded uppercase font-black tracking-widest">{q.subject}</span>}
                                                <span className="text-[9px] text-red-500 bg-red-500/10 px-2 py-0.5 rounded uppercase font-black tracking-widest">{q.type || 'MCQ'}</span>
                                            </div>
                                        </div>

                                        <h4 className="text-xl font-[1000] text-white mb-6 italic tracking-tight leading-tight uppercase">
                                            {q.question}
                                        </h4>

                                        {q.type === "code" && q.code && (
                                            <div className="mb-6 rounded-2xl overflow-hidden border border-white/10 bg-black">
                                                <pre className="p-6 text-xs font-mono text-zinc-400 overflow-x-auto">
                                                    <code>{q.code}</code>
                                                </pre>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {/* 🛡️ DEFENSIVE FIX: Check if options exists before mapping */}
                                            {(q.options || []).map((opt, idx) => (
                                                <div key={idx} className={`p-4 rounded-xl border text-[11px] font-black uppercase flex items-center gap-3
                                                    ${opt?.startsWith("*")
                                                        ? "bg-green-600/10 border-green-600/40 text-green-500"
                                                        : "bg-white/5 border-white/5 text-zinc-500"}`}>
                                                    <ChevronRight size={14} className={opt?.startsWith("*") ? "text-green-500" : "text-zinc-700"} />
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
        </div>
    );
}