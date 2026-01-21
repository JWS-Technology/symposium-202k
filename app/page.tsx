"use client";

import { useState, useEffect } from "react";
import { LuCalendar, LuUsers } from "react-icons/lu";
import { FaRegClock, FaTrophy, FaAward, FaMedal, FaSpider } from "react-icons/fa6"; // Standardized to FA6
import { MdOutlineLocationOn } from "react-icons/md";
import { IoMailOutline } from "react-icons/io5";
import { BsTelephone } from "react-icons/bs";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// --- Interfaces ---
interface BackgroundElement {
  id: number;
  width: number;
  height: number;
  top: string;
  left: string;
  scale: number[];
  opacity: number[];
  duration: number;
  delay: number;
}

interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  angle: number;
  size: number;
  duration: number;
  delay: number;
  colors: string[];
}

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [expired, setExpired] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [confettiParticles, setConfettiParticles] = useState<ConfettiParticle[]>([]);

  const formatTime = (num: number) => String(num).padStart(2, "0");

  useEffect(() => {
    setIsClient(true);
    const eventDate = new Date("2025-09-16T16:15:00");

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = eventDate.getTime() - now;

      if (distance <= 0) {
        clearInterval(timer);
        setExpired(true);
        const alreadyPlayed = localStorage.getItem("celebrationPlayed");
        if (!alreadyPlayed) {
          setShowCelebration(true);
          const particles: ConfettiParticle[] = Array.from({ length: 100 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            angle: Math.random() * 360,
            size: Math.random() * 10 + 5,
            duration: Math.random() * 3 + 2,
            delay: Math.random() * 0.5,
            colors: ["#E23636", "#111111", "#FFFFFF", "#5078FF"], // Spider-man colors
          }));
          setConfettiParticles(particles);
          localStorage.setItem("celebrationPlayed", "true");
          setTimeout(() => setShowCelebration(false), 5000);
        }
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((distance / (1000 * 60)) % 60),
          seconds: Math.floor((distance / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const rules = [
    "Teams must consist of 1-3 members",
    "Students must bring their laptop",
    "All code must be original and created during the event",
    "Use of external APIs and libraries is allowed",
    "Projects must be submitted before the deadline",
    "Teams must present their solutions to judges",
    "Respect fellow participants and maintain fair play",
    "No pre-built solutions or existing projects",
  ];

  const swingIn = {
    hidden: { opacity: 0, y: -50, rotate: -5 },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotate: 0,
      transition: { type: "spring" as const, damping: 12, stiffness: 100 } 
    }
  };

  return (
    <div className="bg-[#050514] text-white min-h-screen overflow-x-hidden selection:bg-[#E23636]">
      
      {/* Spider Web Background Pattern */}
      <div className="fixed inset-0 opacity-[0.07] pointer-events-none z-0" 
           style={{ 
             backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0), linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)`, 
             backgroundSize: '40px 40px, 200px 200px, 200px 200px' 
           }}>
      </div>

      {/* Celebration Overlay */}
      <AnimatePresence>
        {showCelebration && (
          <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
            {confettiParticles.map((p) => (
              <motion.div
                key={p.id}
                className="absolute"
                style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%`, backgroundColor: p.colors[0], rotate: p.angle }}
                animate={{ y: ["0vh", "100vh"], opacity: [1, 0] }}
                transition={{ duration: p.duration, delay: p.delay }}
              />
            ))}
            <motion.div 
              initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
              className="bg-[#E23636] p-8 rounded-2xl border-4 border-white shadow-2xl text-center z-50"
            >
              <h2 className="text-5xl font-black italic tracking-tighter">THWIP! TIME'S UP!</h2>
              <p className="text-xl font-bold">The Mission is Complete.</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="h-[12vh] flex flex-col justify-center items-center bg-[#E23636] border-b-4 border-black relative z-10 shadow-xl">
        <h1 className="font-black italic uppercase text-lg md:text-xl tracking-tighter">Department of Information Technology</h1>
        <p className="font-bold opacity-90 text-sm md:text-base">St. Joseph's College (Autonomous), Tiruchirappalli</p>
      </header>

      {/* Hero Section */}
      <section className="min-h-[88vh] flex flex-col items-center justify-center relative px-4 text-center">
        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.2 } } }}>
          
          <motion.div variants={swingIn} className="mb-6 flex justify-center">
            <FaSpider className="text-7xl text-[#E23636] filter drop-shadow-[0_0_15px_rgba(226,54,54,0.8)]" />
          </motion.div>

          <motion.h1 variants={swingIn} className="text-6xl md:text-9xl font-black uppercase italic tracking-tighter leading-none">
            HACKATHON <span className="text-[#E23636] outline-text">'25</span>
          </motion.h1>

          <motion.p variants={swingIn} className="text-xl md:text-2xl font-bold text-blue-400 mt-4 tracking-widest uppercase">
            With Great Power, Comes Great Code.
          </motion.p>

          {/* Countdown */}
          <motion.div variants={swingIn} className="my-10">
            {!expired ? (
              <div className="flex flex-wrap justify-center gap-4">
                {[
                  { label: "Days", val: timeLeft.days },
                  { label: "Hrs", val: timeLeft.hours },
                  { label: "Mins", val: timeLeft.minutes },
                  { label: "Secs", val: timeLeft.seconds },
                ].map((item) => (
                  <div key={item.label} className="bg-white p-1 rounded-lg shadow-lg">
                    <div className="bg-[#050514] px-6 py-4 rounded border-2 border-[#E23636] min-w-[100px]">
                      <span className="text-4xl font-black block leading-none">{formatTime(item.val)}</span>
                      <span className="text-[10px] uppercase font-bold text-[#E23636]">{item.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#E23636] text-white px-8 py-4 rounded-full font-black text-2xl border-4 border-white inline-block">
                MISSION ACCOMPLISHED
              </div>
            )}
          </motion.div>

          {/* Buttons */}
          <motion.div variants={swingIn} className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/login">
              <button className="w-full sm:w-64 bg-[#E23636] hover:bg-white hover:text-black text-white font-black py-4 px-8 rounded-full border-b-8 border-black transition-all active:border-b-0 uppercase italic tracking-tighter">
                Leader Login
              </button>
            </Link>
            <Link href="https://docs.google.com/forms/...">
              <button className="w-full sm:w-64 bg-[#1a1a4a] hover:bg-blue-600 text-white font-black py-4 px-8 rounded-full border-b-8 border-black transition-all active:border-b-0 uppercase italic tracking-tighter">
                Submit Code
              </button>
            </Link>
          </motion.div>

          <motion.p variants={swingIn} className="mt-8 text-xs font-bold text-gray-400 uppercase tracking-widest">
            Powered by JWS Technologies
          </motion.p>
        </motion.div>
      </section>

      {/* Prize Section */}
      <section className="py-24 bg-[#050514] relative z-10 border-t-4 border-[#E23636]">
        <h2 className="text-4xl text-center font-black uppercase italic mb-16 tracking-tighter underline decoration-[#E23636]">Prizes & Recognition</h2>
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { pos: "1st Place", val: "₹2000", icon: <FaTrophy />, color: "text-yellow-400" },
            { pos: "2nd Place", val: "₹1000", icon: <FaMedal />, color: "text-gray-300" },
            { pos: "3rd Place", val: "₹750", icon: <FaAward />, color: "text-amber-600" },
          ].map((prize, i) => (
            <motion.div 
              key={i} whileHover={{ y: -10 }}
              className="bg-[#0a0a2a] p-8 rounded-xl border-t-8 border-[#E23636] shadow-2xl relative group overflow-hidden"
            >
              <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:opacity-20 transition-opacity">
                <FaSpider size={120} />
              </div>
              <div className={`text-5xl ${prize.color} mb-4`}>{prize.icon}</div>
              <h3 className="text-2xl font-black uppercase italic">{prize.pos}</h3>
              <p className="text-4xl font-black mt-2 text-[#E23636]">{prize.val}</p>
              <p className="text-sm font-bold text-blue-400 uppercase mt-2">Shield + Certificate</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Rules Section */}
      <section className="py-20 bg-[#E23636]">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-black uppercase italic mb-12 text-center text-black tracking-tighter">The Spider-Code (Rules)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rules.map((rule, i) => (
              <motion.div key={i} whileHover={{ x: 10 }} className="bg-black text-white p-5 rounded border-l-8 border-blue-500 font-bold uppercase text-sm tracking-tight">
                <span className="text-blue-500 mr-2">0{i+1}.</span> {rule}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-16 border-t-8 border-[#E23636]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">
          <FaSpider className="text-6xl text-[#E23636] mb-6 animate-pulse" />
          <h3 className="text-2xl font-black uppercase italic tracking-tighter">Your Friendly Neighborhood Hackathon</h3>
          <div className="mt-8 flex flex-col md:flex-row gap-10 text-center md:text-left text-sm font-bold text-gray-400">
            <div>
              <p className="text-white uppercase mb-2">Contact</p>
              <p className="flex items-center justify-center md:justify-start gap-2"><IoMailOutline color="#E23636"/> hackathon@jwstechnologies.com</p>
              <p className="flex items-center justify-center md:justify-start gap-2"><BsTelephone color="#E23636"/> +91 63852 66784</p>
            </div>
            <div>
              <p className="text-white uppercase mb-2">Location</p>
              <p>St. Joseph's College (Autonomous)</p>
              <p>Tiruchirappalli, Tamil Nadu</p>
            </div>
          </div>
          <p className="mt-12 text-[10px] text-gray-600 uppercase tracking-[0.2em]">© 2025 IT DEPT SJC. All Rights Reserved.</p>
        </div>
      </footer>

      {/* Custom Styles for Spidey outline effect */}
      <style jsx>{`
        .outline-text {
          -webkit-text-stroke: 2px white;
          color: transparent;
        }
      `}</style>
    </div>
  );
}