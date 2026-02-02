"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaClock, FaUserShield, FaChevronLeft, FaChevronRight,
    FaCheckCircle, FaExclamationTriangle, FaTerminal, FaLock, FaMicrochip
} from "react-icons/fa";

type Question = { questionId: string; question: string; code?: string; options: string[]; };
type ParticipantInfo = { teamId: string; name: string; college: string; department: string; };

export default function TestPage() {
    const router = useRouter();
    const startedRef = useRef(false);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<number[]>([]);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [participantInfo, setParticipantInfo] = useState<ParticipantInfo | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [violations, setViolations] = useState(0);
    const MAX_VIOLATIONS = 2;

    /* =================================================
       STRICT SECURITY HUD LOGIC
       ================================================= */
    useEffect(() => {
        const el = document.documentElement;
        if (el.requestFullscreen) el.requestFullscreen().catch(() => { });

        const blockSystemKeys = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            const isCtrlOrCmd = e.ctrlKey || e.metaKey;

            // Block all data extraction shortcuts
            if (isCtrlOrCmd && ["c", "v", "x", "a", "s", "f", "u", "p"].includes(key)) {
                e.preventDefault();
                return false;
            }
            // Block DevTools
            if (e.key === "F12" || (isCtrlOrCmd && e.shiftKey && ["i", "j", "c"].includes(key))) {
                e.preventDefault();
                return false;
            }
            // Block Screen Capture
            if (e.key === "PrintScreen" || (e.shiftKey && key === "s" && e.metaKey)) {
                e.preventDefault();
                setViolations(v => v + 1);
                return false;
            }
        };

        const preventDefault = (e: Event) => e.preventDefault();
        const handleVisibility = () => { if (document.hidden) setViolations(v => v + 1); };

        window.addEventListener("keydown", blockSystemKeys);
        window.addEventListener("contextmenu", preventDefault);
        window.addEventListener("copy", preventDefault);
        window.addEventListener("paste", preventDefault);
        window.addEventListener("selectstart", preventDefault);
        document.addEventListener("visibilitychange", handleVisibility);

        return () => {
            window.removeEventListener("keydown", blockSystemKeys);
            window.removeEventListener("contextmenu", preventDefault);
            window.removeEventListener("copy", preventDefault);
            window.removeEventListener("paste", preventDefault);
            window.removeEventListener("selectstart", preventDefault);
            document.removeEventListener("visibilitychange", handleVisibility);
        };
    }, []);

    useEffect(() => {
        if (violations > MAX_VIOLATIONS) submitTest();
    }, [violations]);

    /* =================================================
       DATA SYNC
       ================================================= */
    useEffect(() => {
        if (startedRef.current) return;
        startedRef.current = true;

        const initTest = async () => {
            const token = localStorage.getItem("prelims_token");
            if (!token) { router.push("/prelims-login"); return; }
            try {
                const infoRes = await fetch("/api/tests/participant-info", { headers: { Authorization: `Bearer ${token}` } });
                setParticipantInfo(await infoRes.json());

                const testRes = await fetch("/api/tests/start", { method: "POST", headers: { Authorization: `Bearer ${token}` } });
                const data = await testRes.json();
                if (data.status === "SUBMITTED") { router.push("/test-submitted"); return; }

                setQuestions(data.questions);
                setAnswers(new Array(data.questions.length).fill(-1));
                const startTime = new Date(data.startedAt).getTime();
                const elapsed = Math.floor((Date.now() - startTime) / 1000);
                setTimeLeft(Math.max(data.duration - elapsed, 0));
                setLoading(false);
            } catch (err) {
                setError("CRITICAL_SYSTEM_FAILURE");
                setLoading(false);
            }
        };
        initTest();
    }, [router]);

    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0) { if (timeLeft === 0) submitTest(); return; }
        const timer = setInterval(() => setTimeLeft(t => (t !== null ? t - 1 : t)), 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const selectOption = (idx: number) => {
        const newAnswers = [...answers];
        newAnswers[currentIndex] = idx;
        setAnswers(newAnswers);
    };

    const submitTest = async () => {
        const token = localStorage.getItem("prelims_token");
        await fetch("/api/tests/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ answers }),
        });
        router.push("/test-submitted");
    };

    if (loading) return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center font-mono">
            <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="text-red-600 text-4xl font-black italic mb-4"
            >
                ARAZON 2k26
            </motion.div>
            <div className="w-64 h-1 bg-zinc-900 rounded-full overflow-hidden">
                <motion.div animate={{ x: [-256, 256] }} transition={{ repeat: Infinity, duration: 2 }} className="w-1/2 h-full bg-red-600" />
            </div>
        </div>
    );

    const q = questions[currentIndex];
    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-[#020202] text-white flex flex-col font-sans select-none overflow-hidden">

            {/* TOP HUD NAV */}
            <nav className="border-b border-red-600/20 bg-black/80 backdrop-blur-xl p-5 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-600/10 border border-red-600/30 rounded-lg shadow-[0_0_15px_rgba(220,38,38,0.2)]">
                            <FaMicrochip className="text-red-600 text-xl" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black uppercase italic tracking-tighter leading-none">
                                Mission <span className="text-red-600">Control</span>
                            </h1>
                            <p className="text-[11px] text-zinc-500 font-mono mt-1 tracking-widest">
                                NODE: {participantInfo?.teamId} // {participantInfo?.name}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="hidden md:block text-right">
                            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-[0.2em] mb-1">Security_Alerts</p>
                            <p className={`font-mono text-lg font-black ${violations > 0 ? 'text-red-600 animate-pulse' : 'text-zinc-600'}`}>
                                {violations} / {MAX_VIOLATIONS}
                            </p>
                        </div>
                        <div className="bg-red-600 text-white px-6 py-2 rounded-md shadow-[0_0_20px_rgba(220,38,38,0.4)] flex items-center gap-3 border border-white/20">
                            <FaClock className="animate-pulse" />
                            <span className="font-mono text-2xl font-black">{timeLeft !== null ? formatTime(timeLeft) : "00:00"}</span>
                        </div>
                    </div>
                </div>
            </nav>

            {/* PROGRESS TRACKER */}
            <div className="w-full h-1 bg-zinc-900">
                <motion.div
                    className="h-full bg-red-600 shadow-[0_0_10px_#dc2626]"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
            </div>

            {/* MAIN TEST ENGINE */}
            <main className="flex-grow flex flex-col items-center py-12 px-4 relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />

                <div className="max-w-4xl w-full z-10">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                            transition={{ duration: 0.4 }}
                            className="bg-zinc-900/20 border border-zinc-800 p-8 md:p-12 rounded-3xl backdrop-blur-sm shadow-2xl"
                        >
                            <header className="mb-8">
                                <span className="text-red-600 font-mono font-bold tracking-[0.4em] uppercase text-xs">
                                    Segment_0{currentIndex + 1}
                                </span>
                                <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mt-2">
                                    {q.question}
                                </h2>
                            </header>

                            {q.code && (
                                <div className="mb-8 rounded-2xl overflow-hidden border border-zinc-700 bg-black/90 shadow-inner">
                                    <div className="bg-zinc-800/50 px-6 py-2 flex items-center justify-between border-b border-zinc-700">
                                        <div className="flex gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-600" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                                        </div>
                                        <span className="text-[10px] font-mono uppercase text-zinc-500">Decrypting_Logic...</span>
                                    </div>
                                    <pre className="p-6 text-sm md:text-lg font-mono text-red-400 overflow-x-auto leading-relaxed">
                                        <code>{q.code}</code>
                                    </pre>
                                </div>
                            )}

                            <div className="grid grid-cols-1 gap-4">
                                {q.options.map((opt, i) => (
                                    <motion.button
                                        key={i}
                                        whileHover={{ x: 10 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => selectOption(i)}
                                        className={`group w-full p-6 rounded-2xl border-2 transition-all text-left flex items-center justify-between
                                            ${answers[currentIndex] === i
                                                ? 'border-red-600 bg-red-600/20 text-white shadow-[0_0_30px_rgba(220,38,38,0.1)]'
                                                : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-800/60'}`}
                                    >
                                        <div className="flex items-center gap-6">
                                            <span className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-black border-2 transition-colors
                                                ${answers[currentIndex] === i ? 'bg-red-600 border-red-400 text-white' : 'bg-black border-zinc-700 group-hover:border-zinc-500'}`}>
                                                {String.fromCharCode(65 + i)}
                                            </span>
                                            <span className="text-lg md:text-xl font-bold">{opt}</span>
                                        </div>
                                        {answers[currentIndex] === i && <FaCheckCircle className="text-red-600 text-2xl" />}
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            {/* NAV FOOTER */}
            <footer className="border-t border-zinc-900 p-8 bg-black/90 backdrop-blur-md">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <button
                        disabled={currentIndex === 0}
                        onClick={() => setCurrentIndex(v => v - 1)}
                        className="text-zinc-600 hover:text-white disabled:opacity-0 flex items-center gap-3 uppercase text-xs font-black tracking-widest transition-all"
                    >
                        <FaChevronLeft /> Prev_Node
                    </button>

                    <div className="flex gap-2">
                        {questions.map((_, i) => (
                            <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? 'bg-red-600 w-6' : 'bg-zinc-800'}`} />
                        ))}
                    </div>

                    {currentIndex === questions.length - 1 ? (
                        <button
                            onClick={submitTest}
                            className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-xl font-black uppercase italic tracking-[0.2em] shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:scale-105 transition-all flex items-center gap-3"
                        >
                            Upload_Results <FaLock />
                        </button>
                    ) : (
                        <button
                            onClick={() => setCurrentIndex(v => v + 1)}
                            className="bg-white text-black hover:bg-red-600 hover:text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest transition-all flex items-center gap-2"
                        >
                            Next_Node <FaChevronRight />
                        </button>
                    )}
                </div>
            </footer>

            {/* ALERT SYSTEM */}
            <AnimatePresence>
                {violations > 0 && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[100]"
                    >
                        <div className="bg-red-600 text-white px-8 py-4 rounded-2xl flex items-center gap-4 shadow-[0_0_50px_#dc2626] border-2 border-white/20">
                            <FaExclamationTriangle className="text-2xl animate-bounce" />
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest">Protocol_Violation</p>
                                <p className="text-lg font-bold">WARNING {violations} / {MAX_VIOLATIONS}</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}