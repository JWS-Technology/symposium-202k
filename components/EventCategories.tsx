"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaMicrochip, FaMasksTheater, FaMusic, FaArrowRight } from "react-icons/fa6";

interface EventData {
  eventType: "ON_STAGE" | "OFF_STAGE" | "CULTURALS";
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
          // Dynamic calculation of event counts per category
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
      id: "ON_STAGE",
      title: "On Stage",
      description: "Spotlight missions requiring live technical presentation.",
      path: "/events/on-stage", // Redirection path
      icon: <FaMasksTheater />,
      img: "/images/spider_man_bg.png",
      color: "from-red-600/20",
    },
    {
      id: "OFF_STAGE",
      title: "Off Stage",
      description: "Backend challenges and technical problem solving.",
      path: "/events/off-stage", // Redirection path
      icon: <FaMicrochip />,
      img: "/images/spider_man_bg.png",
      color: "from-blue-600/20",
    },
    {
      id: "CULTURALS",
      title: "Culturals",
      description: "The artistic weave of technology and performance.",
      path: "/events/culturals", // Redirection path
      icon: <FaMusic />,
      img: "/images/spider_man_bg.png",
      color: "from-purple-600/20",
    },
  ];

  return (
    <section className="py-24 bg-[#050505] relative overflow-hidden">
      {/* HUD Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <header className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-4xl md:text-6xl font-black italic text-white uppercase tracking-tighter">
              Event <span className="text-red-600">Sectors_</span>
            </h2>
            <p className="text-zinc-500 font-mono text-[10px] mt-2 tracking-[0.3em]">
              {loading ? "INITIALIZING_SCAN..." : "CATEGORIES_STABILIZED"}
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, idx) => (
            <Link href={cat.path} key={cat.id} className="block group">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover="hover"
                className="relative h-[480px] cursor-pointer overflow-hidden border border-zinc-800 bg-zinc-950 transition-colors group-hover:border-red-600/50"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 90%, 90% 100%, 0 100%)' }}
              >
                {/* 1. BACKGROUND LAYER: PNG Visual */}
                <div className="absolute inset-0 z-0">
                  <motion.img
                    variants={{ hover: { scale: 1.1, opacity: 0.5 } }}
                    src={cat.img}
                    alt={cat.title}
                    className="w-full h-full object-cover opacity-20 grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} via-transparent to-black opacity-80`} />
                </div>

                {/* 2. STATS LAYER: Live Event Count */}
                <div className="absolute top-8 left-8 z-20">
                    <p className="text-[10px] font-mono text-red-600 tracking-widest uppercase">Nodes_Detected</p>
                    <p className="text-3xl font-black text-white italic">
                        {loading ? "--" : counts[cat.id].toString().padStart(2, '0')}
                    </p>
                </div>

                {/* 3. CONTENT LAYER */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end z-20">
                  <div className="text-4xl text-red-600 mb-4 group-hover:drop-shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-all">
                    {cat.icon}
                  </div>
                  
                  <h3 className="text-3xl font-black italic uppercase text-white mb-2 leading-none">
                    {cat.title}
                  </h3>
                  
                  <p className="text-zinc-500 text-sm leading-tight mb-8 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                    {cat.description}
                  </p>
                  
                  {/* SKEWED RED BUTTON */}
                  <div className="relative inline-flex self-start">
                    <motion.div
                      variants={{
                        hover: { backgroundColor: "#dc2626", color: "#000000", scale: 1.05 }
                      }}
                      className="flex items-center gap-3 px-6 py-3 bg-zinc-900 border border-zinc-700 text-white font-black italic text-[10px] uppercase tracking-[0.2em] skew-x-[-15deg] transition-all"
                    >
                      <span className="skew-x-[15deg]">View_Events</span>
                      <FaArrowRight className="skew-x-[15deg] group-hover:translate-x-1 transition-transform" />
                    </motion.div>
                    
                    {/* Shadow Accent */}
                    <div className="absolute -bottom-1 -right-1 w-full h-full border-b border-r border-red-600/50 -z-10 group-hover:border-red-600 transition-colors" />
                  </div>
                </div>

                {/* TOP RIGHT DECOR */}
                <div className="absolute top-4 right-4 text-zinc-800 font-mono text-[10px] group-hover:text-red-600 transition-colors">
                  SEC_0{idx + 1}
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}