"use client";

import { FaAward, FaMedal, FaTrophy } from "react-icons/fa6";
import PrizeCard from "./PrizeCard";


export default function Prize() {
    return (
        <section id="prizes" className="py-20 md:py-32 relative z-10 bg-[#050505] border-y-4 border-red-900">
            <div className="max-w-6xl mx-auto px-6">
                <h2 className="text-4xl md:text-5xl font-black uppercase italic mb-12 md:mb-20 border-l-8 border-red-600 pl-6">
                    Rewards
                </h2>

                {/* Grid optimized for mobile (1 col) and desktop (3 cols) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                    {/* Note: I swapped order for mobile logic so 1st place is at the top/center visually */}
                    <div className="order-2 md:order-1">
                        <PrizeCard rank="2nd" amount="1000" icon={<FaMedal />} color="border-gray-500" />
                    </div>
                    <div className="order-1 md:order-2">
                        <PrizeCard rank="1st" amount="2000" icon={<FaTrophy />} color="border-red-600" featured />
                    </div>
                    <div className="order-3 md:order-3">
                        <PrizeCard rank="3rd" amount="750" icon={<FaAward />} color="border-orange-900" />
                    </div>
                </div>
            </div>
        </section>
    );
}