"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSpider, FaCalendarDay, FaClock } from "react-icons/fa6";

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
    <section className="relative min-h-[100dvh] w-full flex items-center justify-center overflow-hidden bg-black font-sans py-12">

      {/* --- BACKGROUND LAYERS --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black z-10" />
        <video
          autoPlay muted loop playsInline preload="auto"
          className="w-full h-full object-cover grayscale-[0.5] contrast-125"
        >
          <source src="/videos/bg-video.mp4" type="video/mp4" />
        </video>
      </div>

      {/* --- SPIDER-VERSE OVERLAYS --- */}
      <div className="absolute inset-0 z-10 opacity-20 pointer-events-none"
        style={{ backgroundImage: `radial-gradient(#fff 1px, transparent 0)`, backgroundSize: '24px 24px' }} />
      <div className="absolute inset-0 z-10 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />

      <AnimatePresence>
        {showTemplate && (
          <div className="relative z-20 w-full flex flex-col items-center px-4 max-w-[100vw]">

            {/* THE HUD CARD */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="bg-zinc-950/70 border-y-[3px] md:border-y-4 border-red-600 p-6 md:p-10 lg:p-12 w-full max-w-4xl text-center backdrop-blur-lg relative"
              style={{ clipPath: 'polygon(0 40px, 40px 0, 100% 0, 100% calc(100% - 40px), calc(100% - 40px) 100%, 0 100%)' }}
            >
              {/* Institution Header */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <p className="text-cyan-400 font-black tracking-[0.2em] uppercase text-[9px] md:text-xs mb-2">
                  SJC TRICHY // EST. 1844
                </p>
                <div className="inline-block skew-x-[-15deg] bg-red-600 px-3 py-1">
                  <h3 className="text-white font-bold uppercase tracking-tighter text-[10px] sm:text-sm md:text-xl italic">
                    Dept of Information Technology
                  </h3>
                </div>
              </motion.div>

              {/* Animated Spider Badge */}
              <motion.div
                animate={{ rotate: [45, 40, 50, 45], scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="absolute -top-4 md:-top-8 left-1/2 -translate-x-1/2 bg-white p-2 md:p-3 rotate-45 border-2 md:border-4 border-red-600 shadow-[3px_3px_0px_#dc2626]"
              >
                <FaSpider className="-rotate-45 text-black text-xl md:text-4xl" />
              </motion.div>

              {/* Main Title */}
              <motion.div variants={glitchVariant} animate="animate" className="relative mt-8 md:mt-10">
                <h1 className="text-5xl sm:text-7xl md:text-[9rem] font-black uppercase italic tracking-tighter leading-none text-white">
                  ARA<span className="text-red-600">ZON</span>
                </h1>
                <h1 className="absolute inset-0 text-5xl sm:text-7xl md:text-[9rem] font-black uppercase italic tracking-tighter leading-none text-cyan-400/20 -translate-x-1 -z-10">
                  ARAZON
                </h1>
              </motion.div>

              <h2 className="text-sm sm:text-lg md:text-4xl font-black italic tracking-tight text-white/90 mt-2 uppercase bg-black inline-block px-4 py-1">
                Beyond the <span className="text-red-600">Books</span>
              </h2>

              <div className="h-[1px] md:h-[2px] w-full bg-cyan-500 my-6 md:my-8 shadow-[0_0_15px_#06b6d4]" />

              {/* Countdown Grid */}
              <div className="grid grid-cols-4 gap-2 sm:gap-4 md:gap-6 mb-8 md:mb-12">
                {[
                  { label: "DAYS", val: timeLeft.days, color: "bg-red-600 text-white" },
                  { label: "HRS", val: timeLeft.hours, color: "bg-white text-black" },
                  { label: "MIN", val: timeLeft.minutes, color: "bg-red-600 text-white" },
                  { label: "SEC", val: timeLeft.seconds, color: "bg-cyan-500 text-black" },
                ].map((t, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className={`relative w-full py-3 sm:py-6 md:py-8 flex items-center justify-center border-2 md:border-4 border-black shadow-[2px_2px_0px_rgba(255,255,255,0.3)] ${t.color}`}>
                      <span className="text-lg sm:text-3xl md:text-6xl font-black italic tabular-nums leading-none">
                        {formatTime(t.val)}
                      </span>
                      <span className="absolute -bottom-2 left-0 bg-black text-white text-[6px] sm:text-[8px] md:text-xs px-1 font-bold">
                        {t.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* EVENT START DETAILS (Replacing Buttons) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="relative group bg-white/[0.03] border border-white/10 rounded-xl p-4 md:p-8 overflow-hidden"
              >
                {/* Laser Scan Animation */}
                <motion.div
                  animate={{ top: ["-100%", "200%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 w-full h-1/2 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent skew-y-12 pointer-events-none"
                />

                <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
                  {/* Date Block */}
                  <div className="flex items-center gap-4">
                    <div className="bg-red-600 p-3 rounded-lg rotate-3 shadow-[4px_4px_0px_white]">
                      <FaCalendarDay className="text-white text-xl md:text-3xl" />
                    </div>
                    <div className="text-left">
                      <p className="text-cyan-400 text-[10px] font-black tracking-widest uppercase">Commences On</p>
                      <h4 className="text-2xl md:text-4xl font-black text-white italic tracking-tighter">
                        09.02.2026
                      </h4>
                    </div>
                  </div>

                  {/* Vertical Divider (Desktop) */}
                  <div className="hidden md:block h-12 w-[2px] bg-white/20 skew-x-[-15deg]" />

                  {/* Day Block */}
                  <div className="flex items-center gap-4">
                    <div className="bg-cyan-500 p-3 rounded-lg -rotate-3 shadow-[4px_4px_0px_#dc2626]">
                      <FaClock className="text-black text-xl md:text-3xl" />
                    </div>
                    <div className="text-left">
                      <p className="text-red-600 text-[10px] font-black tracking-widest uppercase">The Grand Opener</p>
                      <h4 className="text-2xl md:text-4xl font-black text-white italic tracking-tighter">
                        MONDAY
                      </h4>
                    </div>
                  </div>
                </div>


              </motion.div>

            </motion.div>

            {/* RUNNING MARQUEE */}
            <div className="w-full mt-8 overflow-hidden bg-white/5 backdrop-blur-sm border-y border-white/10 py-2">
              <motion.div
                animate={{ x: ["0%", "-55%"] }}
                transition={{ duration: 11, repeat: Infinity, ease: "linear" }}
                className="flex whitespace-nowrap"
              >
                {[...Array(4)].map((_, i) => (
                  <span key={i} className="text-[10px] md:text-sm font-black italic uppercase text-white/80 tracking-[0.2em] flex items-center shrink-0">
                    <span className="mx-4">REGISTRATIONS CLOSE TODAY 3.30 PM</span>
                    <span className="text-red-600 mr-4">●</span>
                    <span className="mx-4">GRAND CASH WINNER PRIZE ₹2,000</span>
                    <span className="text-cyan-400 mr-4">●</span>
                    <span className="mx-4">GRAND CASH RUNNER PRIZE ₹1,000</span>
                    <span className="text-red-600 mr-4">●</span>
                    {/* <span className="mx-4">REGISTRATIONS OPEN UNTIL 06.02.2026</span>
                    <span className="text-red-600 mr-4">●</span> */}

                  </span>
                ))}
              </motion.div>
            </div>

            {/* Web Accent */}
            <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none opacity-10">
              <FaSpider className="text-red-600 blur-3xl w-full h-full max-w-[500px]" />
            </div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}