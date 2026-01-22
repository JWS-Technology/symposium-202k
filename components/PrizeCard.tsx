"use client";
import { motion } from "framer-motion";
import { FaSpider } from "react-icons/fa6";
import { ReactNode } from "react";

interface PrizeProps {
  rank: string;
  amount: string;
  icon: ReactNode;
  color: string;
  featured?: boolean;
}

export default function PrizeCard({ rank, amount, icon, color, featured }: PrizeProps) {
  // Bold Comic Colors
  const accentColor = color.includes('red') ? '#dc2626' : color.includes('cyan') ? '#06b6d4' : '#d946ef';

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotate: -5 }}
      whileInView={{ opacity: 1, y: 0, rotate: featured ? 0 : -2 }}
      whileHover={{ scale: 1.05, rotate: 0, zIndex: 50 }}
      viewport={{ once: true }}
      className="relative p-2 group cursor-pointer"
    >
      {/* THICK COMIC OUTLINE / OFFSET LAYER */}
      <div className="absolute inset-0 bg-black translate-x-2 translate-y-2 rounded-sm" />

      {/* MAIN CARD BODY */}
      <div className={`relative bg-white border-[6px] border-black p-6 flex flex-col h-full overflow-hidden transition-colors`}>

        {/* HALFTONE OVERLAY (Ben-Day Dots) */}
        <div className="absolute inset-0 opacity-[0.15] pointer-events-none mix-blend-multiply"
          style={{
            backgroundImage: `radial-gradient(circle, #000 1.5px, transparent 0)`,
            backgroundSize: '6px 6px'
          }}
        />

        {/* TOP BADGE: "FEATURED" or "RANK" */}
        <div className="absolute -top-1 -left-1 z-20">
          <div className={`bg-yellow-400 border-4 border-black px-4 py-1 -rotate-12 shadow-[4px_4px_0px_#000] font-black italic uppercase text-xs tracking-tighter`}>
            {featured ? "🚨 WINNER!" : "REWARD"}
          </div>
        </div>

        {/* ACTION STARBURST BACKGROUND (Visible on Hover) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className={`w-64 h-64 bg-[radial-gradient(polygon,...)] opacity-20`}
            style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)', backgroundColor: accentColor }} />
        </div>

        {/* RANK HEADER - "KRAKOW!" STYLE */}
        <div className="relative mb-4 mt-2">
          <h3 className="text-4xl font-[900] uppercase italic tracking-tighter text-black leading-none drop-shadow-[2px_2px_0px_#fff]">
            {rank} PLACE
          </h3>
          <div className="h-2 w-full bg-black -skew-x-12 mt-1" />
        </div>

        {/* ICON CONTAINER */}
        <div className="relative flex justify-center py-4">
          <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:scale-150 transition-transform">
            <FaSpider className="text-8xl text-black" />
          </div>
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-7xl text-black filter drop-shadow-[4px_4px_0px_rgba(0,0,0,0.5)] z-10"
          >
            {icon}
          </motion.div>
        </div>

        {/* PRICE TAG: SPEECH BUBBLE STYLE */}
        <div className="mt-auto relative">
          <div className={`absolute -top-8 -right-2 bg-red-600 text-white font-black px-3 py-1 text-sm border-2 border-black rotate-12 shadow-[3px_3px_0px_#000]`}>
            CASH!
          </div>
          <div className="bg-black text-white p-4 skew-x-[-10deg] border-4 border-white shadow-[6px_6px_0px_#000]">
            <p className="text-5xl md:text-6xl font-black italic tracking-tighter skew-x-[10deg] flex items-center justify-center gap-1 text-yellow-400">
              <span className="text-2xl text-white">₹</span>{amount}
            </p>
          </div>
        </div>

        {/* PANEL FOOTER: "TO BE CONTINUED..." STYLE */}
        <div className="mt-4 flex justify-between items-center font-mono text-[10px] font-black uppercase text-black">
          <span>SEC: {rank.charAt(0)}</span>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-black rounded-full" />
            <div className="w-2 h-2 bg-black rounded-full" />
            <div className="w-2 h-2 bg-black rounded-full" />
          </div>
        </div>

      </div>

      {/* ADDITIONAL SPIDER-VERSE "INK BLEED" BORDER */}
      <div className="absolute -inset-1 border-4 border-cyan-400/30 -z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
      <div className="absolute -inset-1 border-4 border-magenta-500/30 -z-10 group-hover:-translate-x-1 group-hover:translate-y-1 transition-transform" />
    </motion.div>
  );
}