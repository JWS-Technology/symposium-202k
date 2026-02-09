"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaChevronLeft, FaChevronRight, FaCheckCircle,
  FaExclamationTriangle, FaLock, FaSkull, FaSpider
} from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

type Question = {
  _id?: string;
  id?: string;
  question: string;
  options: string[];
  type: "mcq" | "code";
  marks: number;
  subject?: string;
  eventId: string;
};

// --- HELPER: Parse Cookies ---
const getCookie = (name: string) => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
};

// --- HELPER: Safe ID Extraction ---
const getQId = (q: Question) => q._id || q.id || "unknown_id";

// --- HELPER: Detect Code-Like Text ---
// Checks if the text looks like code to switch font style
const isCodeLike = (text: string) => {
  return /[\{\}\[\]\(\);=]|\b(def|return|import|class|if|for|while|void|int|float)\b/.test(text);
};

const parseSpiderSenseContent = (rawString: string) => {
  if (!rawString) return { text: "", code: null };
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
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState<number>(3600);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Security State
  const [violations, setViolations] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const MAX_VIOLATIONS = 3;

  /* =================================================
     SPIDER-SENSE SECURITY
     ================================================= */
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && !loading) {
        setViolations(v => {
          const newCount = v + 1;
          if (newCount < MAX_VIOLATIONS) {
            setShowWarning(true);
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
      try {
        const sessionToken = getCookie("spider_session");
        if (!sessionToken) {
          toast.error("Protocol Violation: No Identity Found");
          router.push("/");
          return;
        }

        const res = await fetch("/api/final/get-questions");
        const result = await res.json();

        if (res.ok && result.data) {
          setQuestions(result.data);
          setLoading(false);
        } else {
          toast.error("Access Denied: Terminal Offline");
          router.push("/dashboard");
        }
      } catch (err) {
        toast.error("Multiverse Connection Error");
        setLoading(false);
      }
    };
    initMission();
  }, [router]);

  /* =================================================
     TIMER LOGIC
     ================================================= */
  useEffect(() => {
    if (timeLeft <= 0) {
      submitTest();
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  /* =================================================
     🚀 SUBMISSION LOGIC
     ================================================= */
  const submitTest = async () => {
    setLoading(true);

    const sessionToken = getCookie("spider_session");
    if (!sessionToken) {
      toast.error("Session Expired. Re-authenticating...");
      router.push("/");
      return;
    }

    try {
      const user = JSON.parse(atob(sessionToken));

      const formattedAnswers = questions.map(q => {
        const qId = getQId(q);
        const selected = answers[qId] !== undefined ? answers[qId] : -1;
        return {
          questionId: qId,
          selectedOption: selected
        };
      });

      console.log("Submitting Payload:", formattedAnswers);

      const submissionPayload = {
        participantId: user._id || user.id,
        name: user.name,
        email: user.email,
        teamId: user.teamId,
        eventId: questions[0]?.eventId,
        violations: violations,
        answers: formattedAnswers
      };

      const res = await fetch("/api/final/submit-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionPayload),
      });

      if (res.ok) {
        toast.success("Mission Logged. Redirecting...");
        router.push("/test-submitted");
      } else {
        const err = await res.json();
        throw new Error(err.message);
      }
    } catch (err: any) {
      toast.error(err.message || "Critical Submission Failure.");
      setLoading(false);
    }
  };

  /* =================================================
     RENDER
     ================================================= */
  const currentQ = questions[currentIndex];
  const parsed = currentQ ? parseSpiderSenseContent(currentQ.question) : { text: "", code: null };
  const currentQId = currentQ ? getQId(currentQ) : "loading";
  
  // Smart Font: Use monospace if it looks like code, otherwise standard sans
  const isTechnicalQuestion = isCodeLike(parsed.text);

  if (loading || !currentQ) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center font-mono">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
          <FaSpider className="text-red-600 text-6xl shadow-[0_0_20px_rgba(220,38,38,0.5)]" />
        </motion.div>
        <p className="text-red-600 mt-4 tracking-widest uppercase animate-pulse">Initializing System 2099...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans select-none overflow-hidden relative">
      <Toaster position="top-center" />

      {/* INTEGRITY HUD */}
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

      {/* TOP HUD */}
      <nav className="border-b-2 border-red-600 bg-zinc-950 p-5 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-600 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.4)]">
              <FaSpider className="text-white text-2xl" />
            </div>
            <h1 className="text-2xl font-black uppercase italic tracking-tighter">SPIDER <span className="text-red-600">TEST_ROOM</span></h1>
          </div>
          <div className="bg-red-600 px-6 py-2 rounded-lg font-mono text-2xl font-black border border-red-400">
            {`${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`}
          </div>
        </div>
      </nav>

      {/* QUESTION ENGINE */}
      <main className="flex-grow flex flex-col items-center py-10 px-4 relative min-h-[500px]">
        <div className="max-w-4xl w-full z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              className="bg-zinc-900/50 border-2 border-zinc-800 p-8 md:p-12 rounded-[40px] backdrop-blur-md shadow-2xl relative"
            >
              <header className="mb-8">
                <span className="text-red-500 font-black tracking-widest uppercase text-xs italic">
                  PROTOCOL_{currentQ.subject || "GENERAL"} // Q_{currentIndex + 1}
                </span>
                
                {/* DYNAMIC FONT: Switches to font-mono if code is detected in text */}
                <h2 className={`text-xl md:text-3xl font-black text-white leading-relaxed mt-4 whitespace-pre-wrap ${isTechnicalQuestion ? 'font-mono text-cyan-400' : ''}`}>
                  {parsed.text}
                </h2>
              </header>

              {parsed.code && (
                <div className="mb-8 rounded-3xl overflow-hidden border-2 border-zinc-800 bg-black/80">
                  <div className="bg-red-600/10 px-6 py-2 border-b border-zinc-800 flex justify-between items-center text-[10px] font-mono text-red-500">
                    <span>ENCRYPTED_SOURCE.JS</span>
                    <FaSkull />
                  </div>
                  <div className="p-6 overflow-x-auto">
                    <pre className="text-sm md:text-lg font-mono text-cyan-400 whitespace-pre-wrap break-words">
                      <code>{parsed.code}</code>
                    </pre>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4">
                {currentQ.options.map((opt, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ x: 10 }}
                    onClick={() => setAnswers(prev => ({ ...prev, [currentQId]: i }))}
                    className={`group w-full p-6 rounded-2xl border-2 transition-all text-left flex items-center justify-between
                      ${answers[currentQId] === i ? 'border-red-600 bg-red-600/10 text-white' : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700'}`}
                  >
                    <div className="flex items-center gap-6">
                      <span className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-black border-2
                        ${answers[currentQId] === i ? 'bg-red-600 border-red-400 text-white' : 'bg-black border-zinc-700 text-zinc-500'}`}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      {/* Options also get mono font if they look technical */}
                      <span className={`text-lg md:text-xl font-bold ${isCodeLike(opt) ? 'font-mono' : ''}`}>
                        {opt}
                      </span>
                    </div>
                    {answers[currentQId] === i && <FaCheckCircle className="text-red-600 text-2xl shadow-[0_0_10px_red]" />}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* CONTROLS */}
      <footer className="border-t-2 border-zinc-900 p-8 bg-black/95 mt-auto">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex(v => v - 1)}
            className="text-zinc-500 hover:text-red-500 disabled:opacity-0 flex items-center gap-3 font-black uppercase italic transition-all"
          >
            <FaChevronLeft /> Prev
          </button>

          <div className="flex gap-2">
            {questions.map((q, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all ${i === currentIndex ? 'bg-red-600 w-8' : answers[getQId(q)] !== undefined ? 'bg-red-900 w-3' : 'bg-zinc-800 w-3'}`} 
              />
            ))}
          </div>

          {currentIndex === questions.length - 1 ? (
            <button onClick={submitTest} className="bg-red-600 hover:bg-red-500 text-white px-10 py-4 rounded-full font-black uppercase italic tracking-widest shadow-[0_0_30px_rgba(220,38,38,0.4)] flex items-center gap-3">
              Submit Protocol <FaLock />
            </button>
          ) : (
            <button onClick={() => setCurrentIndex(v => v + 1)} className="bg-white text-black hover:bg-red-600 hover:text-white px-10 py-4 rounded-full font-black uppercase italic tracking-widest flex items-center gap-3">
              Next <FaChevronRight />
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}