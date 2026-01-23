"use client";
import { FaAward, FaMedal, FaTrophy } from "react-icons/fa6";
import PrizeCard from "./PrizeCard";

export default function Prize() {
    return (
        <section id="prizes" className="py-24 md:py-40 relative z-10 bg-[#050505] overflow-hidden">
            {/* Background Decorative Text - Spider-Verse Style */}
            <div className="absolute top-10 left-[-5%] text-[15rem] font-black text-white/[0.02] italic select-none pointer-events-none uppercase">
                Winner
            </div>

            <div className="max-w-6xl mx-auto px-6 relative">
                <div className="mb-16 md:mb-24 relative">
                    <h2 className="text-5xl md:text-7xl font-black uppercase italic relative z-10 text-white leading-none">
                        RE<span className="text-red-600">WARD</span>S_
                    </h2>
                    {/* Cyberpunk sub-label */}
                    <div className="absolute -bottom-4 left-0 bg-cyan-500 text-black px-2 py-1 text-xs font-mono font-bold tracking-[0.3em]">
                        SYSTEM.UPGRADE_AVAILABLE
                    </div>
                    {/* Red shadow echo */}
                    <h2 className="absolute top-1 left-1 text-5xl md:text-7xl font-black uppercase italic z-0 text-red-600/30">
                        REWARDS_
                    </h2>
                </div>

                {/* Grid with staggered layout for that chaotic comic feel */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6 items-center">
                    <div className="order-2 md:order-1 md:rotate-[-2deg]">
                        <PrizeCard rank="2nd" amount="1000" icon={<FaMedal />} color="border-cyan-400" />
                    </div>
                    <div className="order-1 md:order-2 z-20 md:scale-110">
                        <PrizeCard rank="1st" amount="2000" icon={<FaTrophy />} color="border-red-600" featured />
                    </div>
                    <div className="order-3 md:order-3 md:rotate-[2deg]">
                        <PrizeCard rank="3rd" amount="750" icon={<FaAward />} color="border-magenta-500" />
                    </div>
                </div>
            </div>
        </section>
    );
}