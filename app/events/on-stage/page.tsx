"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events-fetch?eventType=NON-TECHNICAL");
        const data = await res.json();
        setEvents(data.data);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-[#020202] text-white">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-16 relative">
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter opacity-20 absolute -top-10 -left-2 select-none">
            Events
          </h1>
          
           <h1 className="relative text-5xl md:text-7xl font-black italic uppercase border-l-8 border-red-600 pl-6">
            NON <span className="text-red-600"> TECHNICAL</span>
          </h1>
         
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <SpiderCard key={index} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SpiderCard({ event }: { event: any }) {
  // 3D Parallax Tilt Effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      whileHover={{ scale: 1.02 }}
      className="relative h-[450px] w-full rounded-2xl bg-zinc-900 border border-white/10 group cursor-pointer"
    >
      {/* 1. BACKGROUND PNG CONTAINER */}
      <div className="absolute inset-2 overflow-hidden rounded-xl bg-black">
        <motion.img
          src="/images/spider_man_bg.png"
          style={{
            x: useTransform(mouseXSpring, [-0.5, 0.5], [15, -15]),
            y: useTransform(mouseYSpring, [-0.5, 0.5], [15, -15])
          }}
          className="w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-700"
        />
        {/* Glowing Red Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(220,38,38,0.2)_100%)] opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* 2. SPIDER WEB OVERLAY (Top-Right Anchor) */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-20 group-hover:opacity-80 transition-opacity pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full text-red-600">
          <path d="M100,0 Q80,10 70,30 M100,0 Q90,20 70,30 M100,0 L60,60" stroke="currentColor" fill="none" strokeWidth="0.5" />
          <path d="M100,0 Q50,10 20,40" stroke="currentColor" fill="none" strokeWidth="0.2" />
        </svg>
      </div>

      {/* 3. CARD CONTENT */}
      <div
        style={{ transform: "translateZ(50px)" }} // Makes text "pop" out
        className="absolute inset-0 p-8 flex flex-col justify-end"
      >
        <div className="bg-black/60 backdrop-blur-md p-6 border-l-4 border-red-600 transform group-hover:translate-x-2 transition-transform">
          <p className="text-red-500 font-mono text-[10px] tracking-widest mb-1">{event.eventType}</p>
          <h2 className="text-3xl font-black italic uppercase leading-none mb-4 group-hover:text-red-500 transition-colors">
            {event.eventName}
          </h2>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-mono text-zinc-400 uppercase">{event.minPlayers}{event.maxPlayers === 1 ? "" : " - " + event.maxPlayers} Participants</span>
            </div>
            <motion.div
              whileHover={{ x: 5 }}
              className="text-white bg-red-600 p-2"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Corner Tech Accents */}
      <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-zinc-700" />
      <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-zinc-700" />
    </motion.div>
  );
}




