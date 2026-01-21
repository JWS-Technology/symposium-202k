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
    // Delay the appearance of the UI to let the video intro play
    // 2000ms = 2 seconds. Adjust this to match your video's "reveal" moment.
    const timer = setTimeout(() => setShowTemplate(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-black">
      
      {/* --- VIDEO LAYER (Always Present) --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/40 z-10" /> 
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          {/* Note: In Next.js, remove "public" from the string path */}
          <source src="/videos/spider-man-main.mp4" type="video/mp4" />
        </video>
      </div>

      {/* --- SEQUENCED UI ENTRANCE --- */}
      <AnimatePresence>
        {showTemplate && (
          <div className="relative z-20 flex flex-col items-center">
            
            {/* The Main HUD Card */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0, y: 100, rotateX: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 120, 
                damping: 20 
              }}
              className="bg-zinc-950/80 border-x-4 border-zinc-800 p-8 md:p-12 w-[95vw] max-w-3xl text-center backdrop-blur-md relative"
              style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 5%, 100% 95%, 95% 100%, 5% 100%, 0% 95%, 0% 5%)' }}
            >
              {/* Institution Header */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-red-600 font-black tracking-[0.3em] uppercase text-xs md:text-sm mb-2">
                  St. Joseph&apos;s College (Autonomous) • Trichy
                </p>
                <h3 className="text-zinc-400 font-bold uppercase tracking-widest text-sm md:text-base border-b border-zinc-800 pb-4 inline-block px-10">
                  Department of Information Technology
                </h3>
              </motion.div>

              {/* Top Spider Badge */}
              <motion.div 
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, type: "spring", bounce: 0.6 }}
                className="absolute -top-10 left-1/2 -translate-x-1/2 bg-red-600 p-4 rotate-45 border-4 border-black shadow-[0_0_20px_rgba(220,38,38,0.5)]"
              >
                 <FaSpider className="-rotate-45 text-black text-3xl" />
              </motion.div>

              {/* Main Title */}
              <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-none text-white mt-8">
                SYMPO<span className="text-red-600">SIUM</span>
              </h1>
              <h2 className="text-3xl md:text-5xl font-light italic tracking-[0.1em] text-zinc-500 mt-2 uppercase">
                National Level Technical Meet
              </h2>
              
              <div className="h-1 w-full bg-gradient-to-r from-transparent via-red-600 to-transparent my-8" />

              {/* Tagline */}
              <p className="text-red-500 font-bold uppercase tracking-widest text-sm italic mb-10">
                &quot;Responsible for weaving the future of technology&quot;
              </p>

              {/* Countdown Hexagons */}
              <div className="grid grid-cols-4 gap-2 md:gap-4 mb-12">
                {[
                  { label: "DAYS", val: timeLeft.days },
                  { label: "HRS", val: timeLeft.hours },
                  { label: "MIN", val: timeLeft.minutes },
                  { label: "SEC", val: timeLeft.seconds },
                ].map((t, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 + (i * 0.1) }}
                    className="flex flex-col items-center"
                  >
                    <span className="text-[10px] font-black text-zinc-600 mb-2 tracking-tighter">{t.label}</span>
                    <div className="relative w-16 h-20 md:w-24 md:h-28 flex items-center justify-center">
                      <div className="absolute inset-0 bg-zinc-900 border-2 border-red-900/50" 
                           style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }} />
                      <span className="relative text-3xl md:text-5xl font-black text-white italic tabular-nums">
                        {formatTime(t.val)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                <Link href="/login" className="w-full md:w-auto">
                  <motion.button 
                    whileHover={{ scale: 1.05, x: -5 }}
                    className="w-full md:w-64 bg-red-600 text-black font-black py-4 uppercase italic skew-x-[-20deg] border-r-8 border-white hover:bg-white transition-all shadow-[0_10px_20px_rgba(220,38,38,0.3)]"
                  >
                    <span className="inline-block skew-x-[20deg]">Join Symposium</span>
                  </motion.button>
                </Link>

                <Link href="/events" className="w-full md:w-auto">
                  <motion.button 
                    whileHover={{ scale: 1.05, x: 5 }}
                    className="w-full md:w-64 border-2 border-red-600 text-red-600 font-black py-4 uppercase italic skew-x-[-20deg] hover:bg-red-600 hover:text-black transition-all"
                  >
                    <span className="inline-block skew-x-[20deg]">Explore Events</span>
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            {/* Background Web Accents (Inside the reveal) */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none"
            >
              <FaSpider size={600} className="text-red-900/40 blur-sm" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Static Decorative Glitch Accents (Optional) */}
      <div className="absolute bottom-10 left-0 w-full flex justify-between px-10 opacity-30 pointer-events-none z-30">
        <div className="h-[2px] w-32 bg-red-600 shadow-[0_0_10px_red]" />
        <div className="h-[2px] w-32 bg-red-600 shadow-[0_0_10px_red]" />
      </div>
    </section>
  );
}