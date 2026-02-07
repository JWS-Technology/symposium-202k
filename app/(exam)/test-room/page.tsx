"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaClock, FaChevronLeft, FaChevronRight,
    FaCheckCircle, FaExclamationTriangle, FaLock, FaSkull, FaSpider
} from "react-icons/fa";

type Question = { questionId: string; question: string; code?: string; options: string[]; };
type ParticipantInfo = { teamId: string; name: string; college: string; department: string; };

export default function SpiderTestRoom() {
    const router = useRouter();
    const startedRef = useRef(false);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<number[]>([]);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [participantInfo, setParticipantInfo] = useState<ParticipantInfo | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    // 🕸️ Spider-Sense Strike System
    const [violations, setViolations] = useState(0);
    const [showWarning, setShowWarning] = useState(false);
    const MAX_VIOLATIONS = 3;

    /* =================================================
       SPIDER-SENSE SECURITY (Strict Monitoring)
       ================================================= */
    useEffect(() => {
        const preventDefault = (e: Event) => e.preventDefault();

        const handleVisibility = () => {
            if (document.hidden) {
                setViolations(v => {
                    const newCount = v + 1;
                    if (newCount < MAX_VIOLATIONS) setShowWarning(true);
                    return newCount;
                });
            }
        };

        // Block Keys & Shortcuts
        const blockKeys = (e: KeyboardEvent) => {
            const isCtrl = e.ctrlKey || e.metaKey;
            if (e.key === "F12" || (isCtrl && ["c", "v", "u", "i"].includes(e.key.toLowerCase()))) {
                e.preventDefault();
                return false;
            }
        };

        window.addEventListener("keydown", blockKeys);
        window.addEventListener("contextmenu", preventDefault);
        window.addEventListener("copy", preventDefault);
        document.addEventListener("visibilitychange", handleVisibility);

        return () => {
            window.removeEventListener("keydown", blockKeys);
            window.removeEventListener("contextmenu", preventDefault);
            document.removeEventListener("visibilitychange", handleVisibility);
        };
    }, []);

    // 🔴 AUTO-SUBMIT TRIGGER
    useEffect(() => {
        if (violations >= MAX_VIOLATIONS) {
            submitTest();
        }
    }, [violations]);

    /* =================================================
       DATA HYDRATION
       ================================================= */
    useEffect(() => {
        if (startedRef.current) return;
        startedRef.current = true;

        const initMission = async () => {
            const token = localStorage.getItem("prelims_token");
            const activeEvent = localStorage.getItem("active_event");

            try {
                // Fetch Participant Info
                const infoRes = await fetch("/api/tests/participant-info", { headers: { Authorization: `Bearer ${token}` } });
                setParticipantInfo(await infoRes.json());

                // Fetch Questions
                const res = await fetch("/api/tests/start", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ eventName: activeEvent }),
                });

                const data = await res.json();
                if (data.status === "SUBMITTED") router.push("/test-submitted");

                setQuestions(data.questions);
                setAnswers(new Array(data.questions.length).fill(-1));
                const startTime = new Date(data.startedAt).getTime();
                const elapsed = Math.floor((Date.now() - startTime) / 1000);
                setTimeLeft(Math.max(data.duration - elapsed, 0));
                setLoading(false);
            } catch (err) {
                setError("COMMUNICATION_ERROR");
                setLoading(false);
            }
        };
        initMission();
    }, [router]);

    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0) { if (timeLeft === 0) submitTest(); return; }
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

    if (loading) return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                <FaSpider className="text-red-600 text-6xl shadow-[0_0_20px_red]" />
            </motion.div>
        </div>
    );

    const q = questions[currentIndex];

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans select-none overflow-hidden relative">

            {/* 🕸️ Warning Strike Overlay */}
            <AnimatePresence>
                {showWarning && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-red-950/95 backdrop-blur-2xl flex items-center justify-center p-8"
                    >
                        <div className="text-center max-w-lg border-2 border-red-500 p-12 rounded-[40px] shadow-[0_0_50px_rgba(220,38,38,0.5)]">
                            <FaExclamationTriangle className="text-7xl text-white mx-auto mb-6 animate-bounce" />
                            <h2 className="text-4xl font-black italic mb-4">SPIDER-SENSE TINGLING!</h2>
                            <p className="text-xl font-bold mb-8">TAB SWITCH DETECTED. <br /> <span className="text-red-400">NEXT VIOLATION WILL RESULT IN AUTO-SUBMIT.</span></p>
                            <button onClick={() => setShowWarning(false)} className="bg-white text-red-600 px-12 py-4 rounded-full font-black uppercase tracking-widest hover:scale-105 transition-transform">
                                I ACKNOWLEDGE
                            </button>
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

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-[9px] font-black text-zinc-500 tracking-widest uppercase">Spider-Sense Monitoring</span>
                            <div className="flex gap-1 mt-1">
                                {[...Array(MAX_VIOLATIONS)].map((_, i) => (
                                    <div key={i} className={`w-6 h-2 rounded-full ${i < violations ? 'bg-red-600 shadow-[0_0_10px_red]' : 'bg-zinc-800'}`} />
                                ))}
                            </div>
                        </div>
                        <div className="bg-red-600 px-6 py-2 rounded-lg font-mono text-2xl font-black shadow-[0_0_20px_rgba(220,38,38,0.3)] border border-red-400">
                            {timeLeft ? `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}` : "00:00"}
                        </div>
                    </div>
                </div>
            </nav>

            {/* MAIN TEST ENGINE */}
            <main className="flex-grow flex flex-col items-center py-10 px-4 relative">
                <div className="max-w-4xl w-full z-10">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ x: 100, opacity: 0, rotate: 2 }}
                            animate={{ x: 0, opacity: 1, rotate: 0 }}
                            exit={{ x: -100, opacity: 0, rotate: -2 }}
                            transition={{ type: "spring", stiffness: 100 }}
                            className="bg-zinc-900/50 border-2 border-zinc-800 p-8 md:p-12 rounded-[40px] backdrop-blur-md shadow-2xl relative overflow-hidden"
                        >
                            {/* Decorative Corner */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-bl-full -mr-16 -mt-16" />

                            <header className="mb-8">
                                <span className="text-red-500 font-black tracking-[0.3em] uppercase text-xs italic">
                                    Node_0{currentIndex + 1} // {localStorage.getItem("active_event")}
                                </span>
                                <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mt-4">
                                    {q?.question}
                                </h2>
                            </header>

                            {q?.code && (
                                <div className="mb-8 rounded-3xl overflow-hidden border-2 border-zinc-800 bg-black/80">
                                    <div className="bg-red-600/10 px-6 py-2 border-b border-zinc-800 flex justify-between items-center">
                                        <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Code_Segment.exe</span>
                                        <FaSkull className="text-red-900 text-xs" />
                                    </div>
                                    <pre className="p-6 text-sm md:text-lg font-mono text-blue-400 overflow-x-auto leading-relaxed">
                                        <code>{q.code}</code>
                                    </pre>
                                </div>
                            )}

                            <div className="grid grid-cols-1 gap-4">
                                {q?.options.map((opt, i) => (
                                    <motion.button
                                        key={i}
                                        whileHover={{ x: 10, backgroundColor: "rgba(220, 38, 38, 0.05)" }}
                                        onClick={() => {
                                            const newAns = [...answers];
                                            newAns[currentIndex] = i;
                                            setAnswers(newAns);
                                        }}
                                        className={`group w-full p-6 rounded-2xl border-2 transition-all text-left flex items-center justify-between
                                            ${answers[currentIndex] === i
                                                ? 'border-red-600 bg-red-600/10 text-white shadow-[0_0_30px_rgba(220,38,38,0.2)]'
                                                : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-red-900'}`}
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
                            <div key={i} className={`h-1.5 rounded-full transition-all ${i === currentIndex ? 'bg-red-600 w-8 shadow-[0_0_10px_red]' : 'bg-zinc-800 w-3'}`} />
                        ))}
                    </div>

                    {currentIndex === questions.length - 1 ? (
                        <button onClick={submitTest} className="bg-red-600 hover:bg-red-500 text-white px-10 py-4 rounded-full font-black uppercase italic tracking-widest shadow-[0_0_30px_rgba(220,38,38,0.4)] transition-all flex items-center gap-3">
                            Finish Mission <FaLock />
                        </button>
                    ) : (
                        <button onClick={() => setCurrentIndex(v => v + 1)} className="bg-white text-black hover:bg-red-600 hover:text-white px-10 py-4 rounded-full font-black uppercase italic tracking-widest transition-all flex items-center gap-3">
                            Next Sector <FaChevronRight />
                        </button>
                    )}
                </div>
            </footer>
        </div>
    );
}