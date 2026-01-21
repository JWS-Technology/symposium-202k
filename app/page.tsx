"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PrizeCard from "@/components/PrizeCard";
import { FaTrophy, FaMedal, FaAward, FaSpider } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    const eventDate = new Date("2025-09-16T16:15:00").getTime();
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = eventDate - now;

      if (distance < 0) {
        clearInterval(timer);
        if (!localStorage.getItem("spidey_celebrated")) {
          setShowCelebration(true);
          localStorage.setItem("spidey_celebrated", "true");
        }
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <main className="bg-black text-white min-h-screen selection:bg-red-600">
      <Navbar />
      
      {/* Background Web Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-10" 
           style={{ backgroundImage: `radial-gradient(circle at 2px 2px, red 1px, transparent 0)`, backgroundSize: '40px 40px' }}>
      </div>

      <div id="hero">
        <Hero timeLeft={timeLeft} />
      </div>

      <section id="prizes" className="py-32 relative z-10 bg-[#050505] border-y-4 border-red-900">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-5xl font-black uppercase italic mb-20 border-l-8 border-red-600 pl-6">Rewards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <PrizeCard rank="2nd" amount="1000" icon={<FaMedal />} color="border-gray-500" />
            <PrizeCard rank="1st" amount="2000" icon={<FaTrophy />} color="border-red-600" featured />
            <PrizeCard rank="3rd" amount="750" icon={<FaAward />} color="border-orange-900" />
          </div>
        </div>
      </section>

      {/* Celebration Modal */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
                      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-6 backdrop-blur-xl">
            <div className="bg-red-600 text-black p-12 text-center border-8 border-black shadow-[0_0_100px_rgba(220,38,38,0.5)]">
              <FaSpider size={60} className="mx-auto mb-4 animate-bounce" />
              <h2 className="text-7xl font-black italic uppercase leading-none mb-4">MISSION COMPLETE</h2>
              <p className="text-xl font-bold uppercase tracking-widest">Web Development Time Expired.</p>
              <button onClick={() => setShowCelebration(false)} className="mt-8 bg-black text-white px-8 py-3 font-black uppercase italic">Exit Mission</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}