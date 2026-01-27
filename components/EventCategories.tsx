"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { FaMicrochip, FaMasksTheater, FaMusic, FaArrowRight, FaSpider } from "react-icons/fa6";

interface EventData {
  eventType: "NON-TECHNICAL" | "TECHNICAL" | "CULTURALS";
}

/* 🕸️ Background Slideshow with Chromatic Aberration & Glitch */
function BackgroundSlideshow({ images, title }: { images: string[], title: string }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={images[index]}
          initial={{ opacity: 0, filter: "brightness(2) contrast(1.5)" }}
          animate={{ opacity: 0.3, filter: "brightness(1) contrast(1)" }}
          exit={{ opacity: 0, x: index % 2 === 0 ? 10 : -10 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={images[index]}
            alt={title}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-transform duration-[2s]"
          />
          <img
            src={images[index]}
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-40 mix-blend-screen translate-x-[3px] scale-110 transition-all duration-[2s]"
            style={{ filter: 'matrix(1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0) brightness(1.5)' }}
          />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
    </div>
  );
}

export default function EventCategories() {
  const [counts, setCounts] = useState<{ [key: string]: number }>({
    TECHNICAL: 0,
    "NON-TECHNICAL": 0,
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
          }, { TECHNICAL: 0, "NON-TECHNICAL": 0, CULTURALS: 0 });
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
      path: "/events/technical",
      icon: <FaMasksTheater />,
      images: ["/images/spider_bg-2.jpg", "/images/spider_man_bg.png", "/images/spider_bg-3.jpg"],
      accent: "text-red-500",
      glow: "shadow-[0_0_30px_rgba(220,38,38,0.2)]",
    },
    {
      id: "NON-TECHNICAL",
      title: "Non Technical",
      description: "Spotlight missions requiring live technical presentation.",
      path: "/events/non-technical",
      icon: <FaMicrochip />,
      images: ["/images/spider_man_bg.png", "/images/spider_bg-3.jpg", "/images/spider_bg-2.jpg"],
      accent: "text-cyan-400",
      glow: "shadow-[0_0_30px_rgba(34,211,238,0.2)]",
    },
    {
      id: "CULTURALS",
      title: "Culturals",
      description: "The artistic weave of technology and performance.",
      path: "/events/culturals",
      icon: <FaMusic />,
      images: ["/images/spider_bg-3.jpg", "/images/spider_bg-2.jpg", "/images/spider_man_bg.png"],
      accent: "text-fuchsia-500",
      glow: "shadow-[0_0_30px_rgba(217,70,239,0.2)]",
    },
  ];

  return (
    <section className="py-24 bg-black relative overflow-hidden">
      {/* HUD Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <header className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between">
          <div className="relative">
            <h2 className="text-6xl md:text-8xl font-black italic text-white uppercase tracking-tighter leading-none select-none">
              SEC<span className="text-red-600">TORS</span>
            </h2>
            <h2 className="absolute top-0 left-1 text-6xl md:text-8xl font-black italic text-cyan-500 opacity-20 uppercase tracking-tighter leading-none -z-10 animate-pulse">
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

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {categories.map((cat, idx) => (
            <Link href={cat.path} key={cat.id} className="block group relative">
              <div className="absolute -inset-[2px] bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0 bg-gradient-to-tr from-transparent via-white to-transparent"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 88%, 88% 100%, 0 100%)' }} />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`relative h-[550px] cursor-pointer bg-zinc-950 border-2 border-zinc-800 transition-all duration-500 ${cat.glow} group-hover:border-white overflow-hidden`}
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 92%, 92% 100%, 0 100%)' }}
              >
                <BackgroundSlideshow images={cat.images} title={cat.title} />

                <div className="absolute top-6 left-6 z-20">
                  <div className="bg-white text-black text-[9px] font-black px-2 py-0.5 uppercase tracking-tighter mb-1 skew-x-[-10deg]">
                    Data_Stream
                  </div>
                  <p className="text-4xl font-black text-white italic group-hover:text-red-600 transition-colors">
                    {loading ? "00" : (counts[cat.id] || 0).toString().padStart(2, '0')}
                  </p>
                </div>

                <div className="absolute inset-0 p-8 flex flex-col justify-end z-20 bg-gradient-to-t from-black via-black/40 to-transparent">
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: -5 }}
                    className={`text-6xl ${cat.accent} mb-6 drop-shadow-[0_0_15px_currentColor]`}
                  >
                    {cat.icon}
                  </motion.div>
                  <h3 className="text-4xl font-black italic uppercase text-white mb-2 leading-none group-hover:tracking-wider transition-all">
                    {cat.title}
                  </h3>
                  <div className="h-1 w-0 group-hover:w-full bg-red-600 transition-all duration-500 mb-4" />
                  <p className="text-zinc-400 text-xs font-medium leading-relaxed mb-8 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    {cat.description}
                  </p>
                  <div className="relative group/btn">
                    <div className="px-6 py-3 bg-white text-black font-black italic text-xs uppercase tracking-widest skew-x-[-15deg] group-hover:bg-red-600 group-hover:text-white transition-all flex items-center justify-between">
                      <span className="skew-x-[15deg]">Enter_Domain</span>
                      <FaArrowRight className="skew-x-[15deg] group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </div>
                <div className="absolute top-4 right-4 text-zinc-800 opacity-20 group-hover:opacity-100 transition-all">
                  <FaSpider className="w-16 h-16 rotate-12 group-hover:rotate-[360deg] transition-all duration-[3s]" />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* 🚀 RESTORED: VIEW ALL EVENTS ACTION BUTTON */}
        <div className="mt-24 flex flex-col items-center justify-center relative">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent -z-10" />

          <Link href="/events" className="group relative">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative z-10"
            >
              <div className="bg-red-600 text-white px-10 py-4 font-black italic uppercase tracking-[0.2em] text-sm skew-x-[-20deg] flex items-center gap-4 group-hover:bg-white group-hover:text-black transition-all duration-300 shadow-[0_0_30px_rgba(220,38,38,0.4)]">
                <span className="skew-x-[20deg]">Access_All_Files</span>
                <FaArrowRight className="skew-x-[20deg] group-hover:translate-x-2 transition-transform" />
              </div>

              {/* Glitch Shadow Effect for Bottom Button */}
              <div className="absolute inset-0 border-2 border-cyan-400 -translate-x-2 translate-y-2 opacity-0 group-hover:opacity-50 transition-all -z-10 skew-x-[-20deg]" />
              <div className="absolute inset-0 border-2 border-red-600 translate-x-1 -translate-y-1 opacity-0 group-hover:opacity-50 transition-all -z-10 skew-x-[-20deg]" />
            </motion.div>
          </Link>

          <p className="mt-6 font-mono text-[10px] text-zinc-600 tracking-widest uppercase animate-pulse">
            [ Click to expand full database ]
          </p>
        </div>

      </div>
    </section>
  );
}