"use client";

import { motion } from "framer-motion";
import { FaSpider } from "react-icons/fa6";
import Link from "next/link";

interface HeroProps {
  // Make the prop optional in the interface just to be safe, 
  // though the default value below handles it either way.
  timeLeft?: { days: number; hours: number; minutes: number; seconds: number };
}

// FIX APPLIED HERE: Added default value for timeLeft
export default function Hero({ 
  timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 } 
}: HeroProps) {
  
  const formatTime = (num: number) => String(num).padStart(2, "0");

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-black">
      
      {/* --- BACKGROUND LAYER: RADIAL WEBS --- */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-20 pointer-events-none">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="relative w-full max-w-4xl aspect-square"
        >
          <div className="absolute inset-0 flex items-center justify-center">
             <FaSpider size={800} className="text-red-600 blur-[2px] opacity-40" />
          </div>
          
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            <motion.path 
              d="M0,0 L100,100 M100,0 L0,100 M50,0 L50,100 M0,50 L100,50" 
              stroke="red" strokeWidth="0.1" fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </svg>
        </motion.div>
      </div>

      {/* --- FRONT LAYER: UI PANEL --- */}
      <div className="relative z-20 flex flex-col items-center">
        
        {/* The Main HUD Card */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-zinc-950/90 border-x-4 border-zinc-800 p-8 md:p-12 w-[95vw] max-w-3xl text-center backdrop-blur-md relative"
          style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 5%, 100% 95%, 95% 100%, 5% 100%, 0% 95%, 0% 5%)' }}
        >
          {/* Institution Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
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
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-red-600 p-4 rotate-45 border-4 border-black shadow-[0_0_20px_rgba(220,38,38,0.5)]">
             <FaSpider className="-rotate-45 text-black text-3xl" />
          </div>

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
              <div key={i} className="flex flex-col items-center">
                <span className="text-[10px] font-black text-zinc-600 mb-2 tracking-tighter">{t.label}</span>
                <div className="relative w-16 h-20 md:w-24 md:h-28 flex items-center justify-center">
                  <div className="absolute inset-0 bg-zinc-900 border-2 border-red-900/50" 
                        style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }} />
                  <span className="relative text-3xl md:text-5xl font-black text-white italic tabular-nums">
                    {formatTime(t.val)}
                  </span>
                </div>
              </div>
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
      </div>

      <div className="absolute bottom-10 left-0 w-full flex justify-between px-10 opacity-30 pointer-events-none">
        <div className="h-[2px] w-32 bg-red-600 shadow-[0_0_10px_red]" />
        <div className="h-[2px] w-64 bg-red-600 shadow-[0_0_10px_red]" />
        <div className="h-[2px] w-32 bg-red-600 shadow-[0_0_10px_red]" />
      </div>
    </section>
  );
}