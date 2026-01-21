"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PrizeCard from "@/components/PrizeCard";
import { FaTrophy, FaMedal, FaAward } from "react-icons/fa6";
import Prize from "@/components/Prize";

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Target Date: February 13, 2026 (Adjust year if needed)
    const targetDate = new Date("2026-02-10T00:00:00").getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        // Event has started
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    // Initialize immediately
    updateTimer();

    // Update every second
    const timerInterval = setInterval(updateTimer, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  return (
    <main className="bg-black text-white min-h-screen selection:bg-red-600 selection:text-white">
      <Navbar />

      {/* Background Web Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-10"
        style={{ backgroundImage: `radial-gradient(circle at 2px 2px, red 1px, transparent 0)`, backgroundSize: '40px 40px' }}>
      </div>

      <div id="hero">
        <Hero timeLeft={timeLeft} />
      </div>

      <Prize />
    </main>
  );
}