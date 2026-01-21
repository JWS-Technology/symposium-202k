"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PrizeCard from "@/components/PrizeCard";
import { FaTrophy, FaMedal, FaAward, FaSpider } from "react-icons/fa6";

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [showCelebration, setShowCelebration] = useState(false);

  // ... (Keep the timer useEffect from the previous step)

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

      {/* ... (Celebration Modal) */}
    </main>
  );
}