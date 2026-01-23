"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { FaMicrochip, FaMasksTheater, FaMusic, FaArrowRight, FaSpider } from "react-icons/fa6";

interface EventData {
  eventType: "NON-TECHNICAL" | "TECHNICAL" | "CULTURALS";
}

export default function EventCategories() {
  const [counts, setCounts] = useState<{ [key: string]: number }>({
    ON_STAGE: 0,
    OFF_STAGE: 0,
    CULTURALS: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventStats = async () => {
      try {
        const res = await fetch("/api/events-fetch");
        const json = await res.json();
        if (json.data) {
          const newCounts = json.data.reduce((acc: any, event: EventData) => {
            acc[event.eventType] = (acc[event.eventType] || 0) + 1;
            return acc;
          }, { ON_STAGE: 0, OFF_STAGE: 0, CULTURALS: 0 });
          setCounts(newCounts);
        }
      } catch (err) {
        console.error("❌ Stats Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEventStats();
  }, []);

  const categories = [
    {
      id: "TECHNICAL",
      title: "Technical",
      description: "Backend challenges and technical problem solving.",
      path: "/events/off-stage",
      icon: <FaMasksTheater />,
      img: "/images/spider_man_bg.png",
      accent: "text-red-500",
      glow: "shadow-[0_0_20px_rgba(220,38,38,0.3)]",
    },
    {
      id: "NON-TECHNICAL",
      title: "Non Technical",
      description: "Spotlight missions requiring live technical presentation.",
      path: "/events/on-stage",
      icon: <FaMicrochip />,
      img: "/images/spider_man_bg.png",
      accent: "text-cyan-400",
      glow: "shadow-[0_0_20px_rgba(34,211,238,0.3)]",
    },
    {
      id: "CULTURALS",
      title: "Culturals",
      description: "The artistic weave of technology and performance.",
      path: "/events/culturals",
      icon: <FaMusic />,
      img: "/images/spider_man_bg.png",
      accent: "text-fuchsia-500",
      glow: "shadow-[0_0_20px_rgba(217,70,239,0.3)]",
    },
  ];

  return (
    <section className="py-24 bg-black relative overflow-hidden">
      {/* 1. Spider-Verse Halftone Overlay */}
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none"
      />

      {/* 2. Cyberpunk HUD Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <header className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between">
          <div className="relative">
            <h2 className="text-6xl md:text-8xl font-black italic text-white uppercase tracking-tighter leading-none select-none">
              SEC<span className="text-red-600">TORS</span>
            </h2>
            {/* Chromatic Offset for Title */}
            <h2 className="absolute top-0 left-1 text-6xl md:text-8xl font-black italic text-cyan-500 opacity-20 uppercase tracking-tighter leading-none -z-10">
              SECTORS
            </h2>
            <div className="h-2 w-32 bg-red-600 mt-2 skew-x-[-20deg]" />
            <p className="text-zinc-500 font-mono text-[10px] mt-4 tracking-[0.4em] uppercase">
              {loading ? ">>> SEARCHING_MULTIVERSE..." : ">>> DOMAINS_SYNCED"}
            </p>
          </div>

          <div className="hidden md:block text-right font-mono text-zinc-600 text-[10px]">
            <p>COORD: 40.7128° N, 74.0060° W</p>
            <p>EST_TIME: {new Date().toLocaleTimeString()}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {categories.map((cat, idx) => (
            <Link href={cat.path} key={cat.id} className="block group relative">

              {/* Animated Glitch Border (Cyberpunk) */}
              <div className="absolute -inset-[2px] bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-0"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 88%, 88% 100%, 0 100%)' }} />

              <motion.div
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={`relative h-[500px] cursor-pointer bg-zinc-950 border-2 border-zinc-800 transition-all duration-500 ${cat.glow} group-hover:border-white`}
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 92%, 92% 100%, 0 100%)' }}
              >
                {/* BACKGROUND IMAGE WITH CMYK OFFSET */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <motion.img
                    variants={{ hover: { scale: 1.1, x: -5 } }}
                    src={cat.img}
                    alt={cat.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-40 transition-all duration-700"
                  />
                  {/* Cyan Ghost Image for Spider-Verse Look */}
                  <motion.img
                    variants={{ hover: { scale: 1.1, x: 5, opacity: 0.2 } }}
                    src={cat.img}
                    className="absolute inset-0 w-full h-full object-cover opacity-0 mix-blend-screen pointer-events-none"
                    style={{ filter: 'invert(100%) sepia(100%) saturate(500%) hue-rotate(180deg)' }}
                  />
                </div>

                {/* CATEGORY STATS - COMIC BOX */}
                <div className="absolute top-6 left-6 z-20">
                  <div className="bg-white text-black text-[9px] font-black px-2 py-0.5 uppercase tracking-tighter mb-1 skew-x-[-10deg]">
                    Data_Stream
                  </div>
                  <p className="text-4xl font-black text-white italic group-hover:text-red-600 transition-colors">
                    {loading ? "00" : counts[cat.id].toString().padStart(2, '0')}
                  </p>
                </div>

                {/* BOTTOM CONTENT */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end z-20">
                  <motion.div
                    variants={{ hover: { y: -10, scale: 1.1 } }}
                    className={`text-5xl ${cat.accent} mb-6 drop-shadow-[0_0_10px_currentColor]`}
                  >
                    {cat.icon}
                  </motion.div>

                  <h3 className="text-4xl font-black italic uppercase text-white mb-2 leading-none group-hover:tracking-wider transition-all">
                    {cat.title}
                  </h3>

                  <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-red-600 to-transparent transition-all duration-500 mb-4" />

                  <p className="text-zinc-400 text-xs font-medium leading-relaxed mb-8 opacity-80 group-hover:opacity-100">
                    {cat.description}
                  </p>

                  {/* BUTTON: SKEWED PORTAL BOX */}
                  <div className="relative group/btn">
                    <div className="px-6 py-3 bg-white text-black font-black italic text-xs uppercase tracking-widest skew-x-[-15deg] group-hover:bg-red-600 group-hover:text-white transition-all flex items-center justify-between">
                      <span className="skew-x-[15deg]">Enter_Domain</span>
                      <FaArrowRight className="skew-x-[15deg] group-hover:translate-x-2 transition-transform" />
                    </div>
                    {/* Ghost shadow for the button */}
                    <div className="absolute inset-0 border border-white translate-x-1 translate-y-1 -z-10 group-hover:translate-x-2 group-hover:translate-y-2 transition-all opacity-30" />
                  </div>
                </div>

                {/* HUD ACCENT: SPIDER SILHOUETTE */}
                <div className="absolute top-4 right-4 text-zinc-800 opacity-20 group-hover:opacity-100 transition-all">
                  <FaSpider className="w-12 h-12 rotate-12 group-hover:rotate-[360deg] transition-all duration-[2s]" />
                </div>
              </motion.div>

              {/* SECTION ID LABEL */}
              <div className="absolute -bottom-4 left-4 font-mono text-[9px] text-zinc-700 bg-black px-2 z-30">
                0{idx + 1} // ADDR_{cat.id}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}