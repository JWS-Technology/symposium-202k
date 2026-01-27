"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSpider } from "react-icons/fa6";
import Link from "next/link";

interface HeroProps {
  timeLeft: { days: number; hours: number; minutes: number; seconds: number };
}

export default function Hero({ timeLeft }: HeroProps) {
  const [showTemplate, setShowTemplate] = useState(false);
  const formatTime = (num: number) => String(num).padStart(2, "0");

  useEffect(() => {
    const timer = setTimeout(() => setShowTemplate(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const glitchVariant = {
    animate: {
      x: [0, -2, 2, -1, 0],
      y: [0, 1, -1, 0],
      filter: [
        "drop-shadow(0px 0px 0px #ff0000) drop-shadow(0px 0px 0px #00ffff)",
        "drop-shadow(-3px 0px 0px #ff0000) drop-shadow(3px 0px 0px #00ffff)",
        "drop-shadow(2px 0px 0px #ff0000) drop-shadow(-2px 0px 0px #00ffff)",
        "drop-shadow(0px 0px 0px #ff0000) drop-shadow(0px 0px 0px #00ffff)",
      ],
      transition: {
        duration: 0.2,
        repeat: Infinity,
        repeatType: "mirror" as const,
        repeatDelay: 2
      }
    }
  };

  return (
    // changed min-h-screen to h-screen or min-h-[100dvh] for better mobile support
    <section className="relative h-screen min-h-[600px] w-full flex items-center justify-center overflow-hidden bg-black font-sans">

      {/* --- RESPONSIVE VIDEO LAYER --- */}
      <div className="absolute inset-0 z-0 w-full h-full">
        {/* Dark overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black z-10" />

        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          // object-cover handles the aspect ratio (cropping the sides on mobile, top/bottom on desktop)
          className="w-full h-full object-cover grayscale-[0.5] contrast-125 select-none pointer-events-none"
        >
          <source src="/videos/bg-video.mp4" type="video/mp4" />
        </video>
      </div>

      {/* --- SPIDER-VERSE OVERLAYS --- */}
      {/* 1. Halftone Pattern Overlay */}
      <div className="absolute inset-0 z-10 opacity-20 pointer-events-none"
        style={{ backgroundImage: `radial-gradient(#fff 1px, transparent 0)`, backgroundSize: '24px 24px' }} />

      {/* 2. Scanning Line Effect - Fixed height for mobile */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />

      <AnimatePresence>
        {showTemplate && (
          <div className="relative z-20 flex flex-col items-center px-4">

            {/* The HUD Card */}
            <motion.div
              initial={{ scale: 1.1, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-zinc-950/60 border-y-4 border-red-600 p-6 md:p-12 w-full max-w-3xl text-center backdrop-blur-md relative"
              style={{ clipPath: 'polygon(0 5%, 5% 0, 95% 0, 100% 5%, 100% 85%, 95% 100%, 15% 100%, 0 85%)' }}
            >
              {/* Institution Header */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <p className="text-cyan-400 font-black tracking-[0.2em] uppercase text-[10px] md:text-xs mb-1">
                  SJC TRICHY // EST. 1844
                </p>
                <h3 className="text-white font-bold uppercase tracking-tighter text-[11px] md:text-xl italic bg-red-600 px-3 py-1 inline-block skew-x-[-15deg]">
                  Dept of Information Technology
                </h3>
              </motion.div>

              {/* Animated Spider Badge */}
              <motion.div
                animate={{ rotate: [45, 40, 50, 45], scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="absolute -top-6 md:-top-8 left-1/2 -translate-x-1/2 bg-white p-2 md:p-3 rotate-45 border-2 md:border-4 border-red-600 shadow-[4px_4px_0px_rgba(220,38,38,1)]"
              >
                <FaSpider className="-rotate-45 text-black text-lg md:text-3xl" />
              </motion.div>

              {/* Main Title */}
              <motion.div variants={glitchVariant} animate="animate" className="relative mt-6 md:mt-8">
                <h1 className="text-5xl md:text-[9rem] font-black uppercase italic tracking-tighter leading-none text-white select-none">
                  ARA<span className="text-red-600">ZON</span>
                </h1>
                <h1 className="absolute inset-0 text-5xl md:text-[9rem] font-black uppercase italic tracking-tighter leading-none text-cyan-400/30 -translate-x-1 -z-10">
                  ARAZON
                </h1>
              </motion.div>

              <h2 className="text-base md:text-4xl font-black italic tracking-tight text-white/80 mt-2 uppercase bg-black inline-block px-2">
                Beyond the <span className="text-red-600">Books</span>
              </h2>

              <div className="h-[2px] w-full bg-cyan-500 my-4 md:my-6 shadow-[0_0_10px_#06b6d4]" />

              {/* Countdown - Optimized Grid */}
              <div className="grid grid-cols-4 gap-2 md:gap-4 mb-8 md:mb-10">
                {[
                  { label: "DAYS", val: timeLeft.days, color: "bg-red-600" },
                  { label: "HRS", val: timeLeft.hours, color: "bg-white text-black" },
                  { label: "MIN", val: timeLeft.minutes, color: "bg-red-600" },
                  { label: "SEC", val: timeLeft.seconds, color: "bg-cyan-500" },
                ].map((t, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className={`relative w-full aspect-square flex items-center justify-center border-2 md:border-4 border-black shadow-[2px_2px_0px_rgba(255,255,255,0.2)] ${t.color}`}>
                      <span className="text-xl md:text-5xl font-black italic tabular-nums leading-none">
                        {formatTime(t.val)}
                      </span>
                      <span className="absolute -bottom-2 left-0 bg-black text-white text-[7px] md:text-[10px] px-1 font-bold">
                        {t.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center items-center">
                <Link href="/login" className="w-full md:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    className="w-full md:w-64 bg-red-600 text-white font-black py-3 md:py-4 uppercase italic skew-x-[-10deg] border-2 md:border-4 border-black shadow-[-4px_4px_0px_white] text-sm md:text-lg"
                  >
                    Login
                  </motion.button>
                </Link>

                <Link href="/register" className="w-full md:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    className="w-full md:w-64 bg-cyan-500 text-black font-black py-3 md:py-4 uppercase italic skew-x-[-10deg] border-2 md:border-4 border-black shadow-[-4px_4px_0px_#ef4444] text-sm md:text-lg"
                  >
                    Registeration
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            {/* Web Accent */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none opacity-20"
            >
              <FaSpider className="text-red-600 blur-xl w-[300px] h-[300px] md:w-[800px] md:h-[800px]" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}