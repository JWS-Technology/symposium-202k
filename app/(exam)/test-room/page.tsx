"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaChevronLeft, FaChevronRight, FaCheckCircle,
    FaExclamationTriangle, FaLock, FaSkull, FaSpider
} from "react-icons/fa";

type Question = { questionId: string; question: string; code?: string; options: string[]; };
type ParticipantInfo = { teamId: string; name: string; college: string; department: string; };

/* =================================================
   🕸️ CONTENT PARSER
   Extracts code snippets between ``` and ``` blocks
   ================================================= */
const parseSpiderSenseContent = (rawString: string) => {
    // Regex matches content between triple backticks
    const codeRegex = /```(?:[a-zA-Z]*)?\s*([\s\S]*?)```/;
    const match = rawString.match(codeRegex);

    if (match) {
        const text = rawString.replace(codeRegex, "").trim();
        const code = match[1].trim();
        return { text, code };
    }
    return { text: rawString, code: null };
};

export default function SpiderTestRoom() {
    const router = useRouter();
    const startedRef = useRef(false);

    // Core State
    const [questions, setQuestions] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<number[]>([]);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [participantInfo, setParticipantInfo] = useState<ParticipantInfo | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Security State
    const [violations, setViolations] = useState(0);
    const [showWarning, setShowWarning] = useState(false);
    const MAX_VIOLATIONS = 3;

    /* =================================================
       SPIDER-SENSE SECURITY (Strict Monitoring)
       ================================================= */
    useEffect(() => {
        const handleVisibility = () => {
            // Only trigger if test has actually loaded and user isn't on the tab
            if (document.hidden && !loading) {
                setViolations(v => {
                    const newCount = v + 1;
                    if (newCount < MAX_VIOLATIONS) {
                        setShowWarning(true);
                        // Auto-clear notification so it can re-animate later
                        setTimeout(() => setShowWarning(false), 4000);
                    }
                    return newCount;
                });
            }
        };

        const blockKeys = (e: KeyboardEvent) => {
            const isCtrl = e.ctrlKey || e.metaKey;
            if (e.key === "F12" || (isCtrl && ["c", "v", "u", "i"].includes(e.key.toLowerCase()))) {
                e.preventDefault();
                return false;
            }
        };

        window.addEventListener("keydown", blockKeys);
        window.addEventListener("contextmenu", (e) => e.preventDefault());
        document.addEventListener("visibilitychange", handleVisibility);

        return () => {
            window.removeEventListener("keydown", blockKeys);
            document.removeEventListener("visibilitychange", handleVisibility);
        };
    }, [loading]);

    useEffect(() => {
        if (violations >= MAX_VIOLATIONS) submitTest();
    }, [violations]);

    /* =================================================
       DATA FETCHING
       ================================================= */
    useEffect(() => {
        if (startedRef.current) return;
        startedRef.current = true;

        const initMission = async () => {
            const token = localStorage.getItem("prelims_token");
            const activeEvent = localStorage.getItem("active_event");

            try {
                const infoRes = await fetch("/api/tests/participant-info", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setParticipantInfo(await infoRes.json());

                const res = await fetch("/api/tests/start", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ eventName: activeEvent }),
                });

                const data = await res.json();
                if (data.status === "SUBMITTED") router.push("/test-submitted");

                setQuestions(data.questions || []);
                setAnswers(new Array(data.questions?.length || 0).fill(-1));

                const startTime = new Date(data.startedAt).getTime();
                const elapsed = Math.floor((Date.now() - startTime) / 1000);
                setTimeLeft(Math.max(data.duration - elapsed, 0));
                setLoading(false);
            } catch (err) {
                setLoading(false);
            }
        };
        initMission();
    }, [router]);

    /* =================================================
       TIMER LOGIC
       ================================================= */
    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0) {
            if (timeLeft === 0) submitTest();
            return;
        }
        const timer = setInterval(() => setTimeLeft(t => (t !== null ? t - 1 : t)), 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const submitTest = async () => {
        const token = localStorage.getItem("prelims_token");
        const activeEvent = localStorage.getItem("active_event");
        await fetch("/api/tests/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ answers, eventName: activeEvent }),
        });
        router.push("/test-submitted");
    };

    /* =================================================
       RENDER CALCULATIONS (The Crash Protectors)
       ================================================= */
    const rawQ = questions?.length > 0 ? questions[currentIndex] : null;
    const parsed = rawQ ? parseSpiderSenseContent(rawQ.question) : { text: "", code: null };

    // Final guard against "Undefined" errors
    if (loading || !rawQ) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center font-mono">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                    <FaSpider className="text-red-600 text-6xl shadow-[0_0_20px_red]" />
                </motion.div>
                <p className="text-red-600 mt-4 font-black tracking-widest animate-pulse uppercase">
                    ARAZON 2K26...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans select-none overflow-hidden relative">

            {/* 🕸️ PASSIVE HUD WARNING */}
            <AnimatePresence>
                {showWarning && (
                    <motion.div
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -100, opacity: 0 }}
                        className="fixed top-24 left-0 right-0 z-[9999] flex justify-center pointer-events-none"
                    >
                        <div className="bg-zinc-950 border-b-2 border-red-600 px-6 py-3 rounded-2xl shadow-[0_10px_30px_rgba(220,38,38,0.4)] flex items-center gap-4">
                            <FaExclamationTriangle className="text-red-600 animate-pulse" />
                            <div className="text-left">
                                <p className="text-white text-xs font-black uppercase italic leading-none">Integrity Warning</p>
                                <p className="text-red-500 font-mono text-[9px] uppercase tracking-widest mt-1">Strike {violations} / {MAX_VIOLATIONS}</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* TOP HUD NAV */}
            <nav className="border-b-2 border-red-600 bg-zinc-950 p-5 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-600 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                            <FaSpider className="text-white text-2xl" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black uppercase italic tracking-tighter">ARAZON <span className="text-red-600">2K26</span></h1>
                            <p className="text-[10px] text-zinc-500 font-mono tracking-widest">{participantInfo?.teamId} // {participantInfo?.name}</p>
                        </div>
                    </div>

                    <div className="bg-red-600 px-6 py-2 rounded-lg font-mono text-2xl font-black border border-red-400">
                        {timeLeft ? `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}` : "00:00"}
                    </div>
                </div>
            </nav>

            {/* MAIN TEST ENGINE */}
            <main className="flex-grow flex flex-col items-center py-10 px-4 relative min-h-[500px]">
                <div className="max-w-4xl w-full z-10">
                    <AnimatePresence mode="popLayout">
                        <motion.div
                            key={currentIndex}
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -50, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="bg-zinc-900/50 border-2 border-zinc-800 p-8 md:p-12 rounded-[40px] backdrop-blur-md shadow-2xl relative overflow-hidden"
                        >
                            <header className="mb-8">
                                <span className="text-red-500 font-black tracking-widest uppercase text-xs italic">
                                    QUESTION_{currentIndex + 1}
                                </span>
                                <h2 className="text-2xl md:text-3xl font-black text-white leading-tight mt-4">
                                    {parsed.text}
                                </h2>
                            </header>

                            {/* 🟢 DYNAMIC CODE BLOCK */}
                            {(parsed.code || rawQ.code) && (
                                <div className="mb-8 rounded-3xl overflow-hidden border-2 border-zinc-800 bg-black/80">
                                    <div className="bg-red-600/10 px-6 py-2 border-b border-zinc-800 flex justify-between items-center">
                                        <span className="text-[10px] font-black text-red-500 uppercase tracking-widest italic">Source_Segment.exe</span>
                                        <FaSkull className="text-red-900 text-xs" />
                                    </div>
                                    <pre className="p-6 text-sm md:text-lg font-mono text-blue-400 overflow-x-auto leading-relaxed">
                                        <code>{parsed.code || rawQ.code}</code>
                                    </pre>
                                </div>
                            )}

                            <div className="grid grid-cols-1 gap-4">
                                {rawQ.options.map((opt, i) => (
                                    <motion.button
                                        key={i}
                                        whileHover={{ x: 5 }}
                                        onClick={() => {
                                            const newAns = [...answers];
                                            newAns[currentIndex] = i;
                                            setAnswers(newAns);
                                        }}
                                        className={`group w-full p-6 rounded-2xl border-2 transition-all text-left flex items-center justify-between
                                            ${answers[currentIndex] === i
                                                ? 'border-red-600 bg-red-600/10 text-white'
                                                : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700'}`}
                                    >
                                        <div className="flex items-center gap-6">
                                            <span className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-black border-2
                                                ${answers[currentIndex] === i ? 'bg-red-600 border-red-400 text-white' : 'bg-black border-zinc-700 text-zinc-500'}`}>
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
            <footer className="border-t-2 border-zinc-900 p-8 bg-black/95">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <button
                        disabled={currentIndex === 0}
                        onClick={() => setCurrentIndex(v => v - 1)}
                        className="text-zinc-500 hover:text-red-500 disabled:opacity-0 flex items-center gap-3 font-black uppercase italic transition-all"
                    >
                        <FaChevronLeft /> Back
                    </button>

                    <div className="flex gap-1.5">
                        {questions.map((_, i) => (
                            <div key={i} className={`h-1.5 rounded-full transition-all ${i === currentIndex ? 'bg-red-600 w-8' : 'bg-zinc-800 w-3'}`} />
                        ))}
                    </div>

                    {currentIndex === questions.length - 1 ? (
                        <button onClick={submitTest} className="bg-red-600 hover:bg-red-500 text-white px-10 py-4 rounded-full font-black uppercase italic tracking-widest shadow-[0_0_30px_rgba(220,38,38,0.4)] transition-all flex items-center gap-3">
                            Finish Attempt <FaLock />
                        </button>
                    ) : (
                        <button onClick={() => setCurrentIndex(v => v + 1)} className="bg-white text-black hover:bg-red-600 hover:text-white px-10 py-4 rounded-full font-black uppercase italic tracking-widest transition-all flex items-center gap-3">
                            Next Question <FaChevronRight />
                        </button>
                    )}
                </div>
            </footer>
        </div>
    );
}