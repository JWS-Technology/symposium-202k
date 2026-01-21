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
      whileInView={{ y: [50, 0], opacity: [0, 1] }}
      viewport={{ once: true }}
      className={`relative p-10 border-t-8 ${color} bg-black group overflow-hidden ${featured ? 'md:-translate-y-8 ring-4 ring-red-600/20' : ''}`}
    >
      <div className="text-6xl text-red-600 mb-6">{icon}</div>
      <h3 className="text-xl font-bold uppercase text-gray-500">{rank} Place</h3>
      <p className="text-6xl font-black text-white mt-2 italic">₹{amount}</p>
      
      {/* Decorative Web Corner */}
      <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-red-900/30"></div>
      
      {/* Hidden Spider Silhouette on Hover */}
      <div className="absolute -bottom-6 -right-6 opacity-5 group-hover:opacity-20 transition-opacity">
        <FaSpider size={150} />
      </div>
    </motion.div>
  );
}