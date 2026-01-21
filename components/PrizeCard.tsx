"use client";
import { motion } from "framer-motion";
import { FaSpider } from "react-icons/fa6";
import { ReactNode } from "react";

interface PrizeProps {
  rank: string;
  amount: string;
  icon: ReactNode;
  color: string;
  featured?: boolean;
}

export default function PrizeCard({ rank, amount, icon, color, featured }: PrizeProps) {
  return (
    <motion.div
      whileInView={{ y: [30, 0], opacity: [0, 1] }}
      viewport={{ once: true }}
      className={`relative p-6 md:p-10 border-t-8 ${color} bg-black group overflow-hidden 
        ${featured ? 'md:-translate-y-8 ring-4 ring-red-600/20' : 'mt-4 md:mt-0'}`}
    >
      {/* Prize Icon - Scaled for Mobile */}
      <div className="text-4xl md:text-6xl text-red-600 mb-4 md:mb-6">
        {icon}
      </div>

      {/* Rank Label - Scaled for Mobile */}
      <h3 className="text-sm md:text-xl font-bold uppercase text-gray-500 tracking-wider">
        {rank} Place
      </h3>

      {/* Amount - Significantly reduced on mobile to prevent overflow */}
      <p className="text-4xl md:text-6xl font-black text-white mt-2 italic tabular-nums">
        ₹{amount}
      </p>

      {/* Decorative Web Corner (Smaller on Mobile) */}
      <div className="absolute top-0 right-0 w-10 h-10 md:w-16 md:h-16 border-t border-r border-red-900/30"></div>

      {/* Hidden Spider Silhouette on Hover */}
      <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 opacity-5 group-hover:opacity-20 transition-opacity">
        <FaSpider className="w-24 h-24 md:w-36 md:h-36" />
      </div>

      {/* Mobile Glitch Line (Optional decorative touch) */}
      <div className={`absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 ${color.replace('border-', 'bg-')}`} />
    </motion.div>
  );
}