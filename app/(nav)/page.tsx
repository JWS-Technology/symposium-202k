"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import EventCategories from "@/components/EventCategories";
import Prize from "@/components/Prize";

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);
  const [viewCount, setViewCount] = useState<number>(0);

  useEffect(() => {
    setMounted(true);

    // 1. View Counter Logic (Increments only once per session)
    const handleViewCounter = async () => {
      try {
        const hasBeenCounted = sessionStorage.getItem("view_counted");
        const res = await fetch("/api/stats/view-count", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ increment: !hasBeenCounted })
        });
        const data = await res.json();
        setViewCount(data.count);
        if (!hasBeenCounted) sessionStorage.setItem("view_counted", "true");
      } catch (err) {
        console.error("Counter sync failed:", err);
      }
    };

    handleViewCounter();

    // 2. Target Date Countdown: February 10, 2026
    const targetDate = new Date("2026-02-10T00:00:00").getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
    return () => clearInterval(timerInterval);
  }, []);

  if (!mounted) return null;

  return (
    <main className="bg-black text-white min-h-screen selection:bg-red-600 selection:text-white relative overflow-x-hidden">

      <Navbar />

      {/* Background Web Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-10"
        style={{ backgroundImage: `radial-gradient(circle at 2px 2px, red 1px, transparent 0)`, backgroundSize: '40px 40px' }}
      />

      <div id="hero">
        <Hero timeLeft={timeLeft} />
      </div>
      <Prize />
      <EventCategories />

      {/* SPIDER VIEW COUNTER - FIXED BOTTOM RIGHT */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="fixed bottom-8 right-8 z-[100] flex flex-col items-center"
      >
        {/* Animated Silk Thread */}
        <div className="w-[1px] h-12 bg-gradient-to-t from-zinc-500 to-transparent mb-[-4px]" />

        <motion.div
          animate={{ y: [0, 8, 0] }} // Vertical "hanging" movement
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="relative flex flex-col items-center group cursor-pointer"
        >
          {/* Spider Icon Body */}
          <div className="relative h-12 w-12 flex items-center justify-center">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute">
              {/* Legs */}
              <path d="M4 6L8 9M20 6L16 9M3 12H8M16 12H21M4 18L8 15M20 18L16 15" stroke="#444" strokeWidth="1.5" strokeLinecap="round" />
              {/* Body Outer */}
              <circle cx="12" cy="12" r="6" fill="#0a0a0a" stroke="#222" strokeWidth="1" />
            </svg>

            {/* Blinking Core (Yellow/Green) */}
            <motion.div
              animate={{
                backgroundColor: ["#eab308", "#22c55e", "#eab308"],
                boxShadow: [
                  "0 0 8px #eab308",
                  "0 0 15px #22c55e",
                  "0 0 8px #eab308"
                ]
              }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="w-3 h-3 rounded-full z-10"
            />
          </div>

          {/* Counter Display Tag */}
          <div className="mt-2 bg-zinc-950/90 border border-zinc-800 px-3 py-1 rounded-sm backdrop-blur-md shadow-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[8px] font-mono text-zinc-500 tracking-tighter uppercase">Nodes:</span>
              <span className="text-[10px] font-mono font-bold text-white tracking-widest">
                {viewCount.toString().padStart(3, '0')}
              </span>
            </div>
          </div>

          {/* Subtle Glow beneath the spider */}
          <motion.div
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -bottom-4 w-12 h-4 bg-green-500/20 blur-xl rounded-full"
          />
        </motion.div>
      </motion.div>

    </main>
  );
}