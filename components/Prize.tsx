"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Trophy, Gift, Zap, Sparkles } from "lucide-react";
import React from "react";

export default function PrizePool() {
    return (
        <section className="relative py-20 min-h-screen flex items-center justify-center bg-[#020202] overflow-hidden font-sans">

            {/* 1. ANIMATED FLOOR GRID */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ duration: 2 }}
                className="absolute bottom-0 left-0 right-0 h-[50vh] pointer-events-none"
                style={{
                    background: `
            linear-gradient(to top, rgba(220, 38, 38, 0.2), transparent),
            linear-gradient(to right, #222 1px, transparent 1px),
            linear-gradient(to bottom, #222 1px, transparent 1px)
          `,
                    backgroundSize: "100% 100%, 60px 60px, 60px 60px",
                    transform: "perspective(500px) rotateX(60deg)",
                    transformOrigin: "bottom"
                }}
            />

            {/* 2. BACKGROUND EFFECTS */}
            <div className="absolute inset-0 z-0 flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                    transition={{
                        rotate: { duration: 60, repeat: Infinity, ease: "linear" },
                        scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="w-[800px] h-[800px] opacity-20 border border-red-600/30 rounded-full blur-sm"
                />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">

                {/* HEADER */}
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, letterSpacing: "0.5em" }}
                        whileInView={{ opacity: 1, letterSpacing: "0.2em" }}
                        transition={{ duration: 1 }}
                        className="text-zinc-500 text-xl md:text-3xl font-black uppercase mb-2"
                    >
                        PRIZE POOL
                    </motion.h2>
                    <div className="h-1 w-24 bg-red-600 mx-auto rounded-full shadow-[0_0_10px_#dc2626]" />
                </div>

                {/* PRIZE CONTAINER - Now optimized for 2 Prizes */}
                <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16">

                    {/* 1st PLACE MAIN CARD */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative z-20 group"
                    >
                        {/* Outer Glow */}
                        <motion.div
                            animate={{ opacity: [0.2, 0.4, 0.2] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="absolute -inset-1 bg-white rounded-[2.5rem] blur-xl"
                        />

                        <div className="relative bg-[#080808]/90 border-[3px] border-white rounded-[2.5rem] p-8 md:p-12 w-full max-w-md md:w-[450px] text-center shadow-2xl overflow-hidden">

                            <motion.div
                                animate={{ top: ["-100%", "200%"] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                className="absolute left-0 w-full h-1/2 bg-gradient-to-b from-transparent via-red-600/5 to-transparent skew-y-12 pointer-events-none"
                            />

                            <div className="relative mb-8 flex justify-center">
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="relative z-10 bg-[#080808] p-4 rounded-full border border-zinc-800"
                                >
                                    <Trophy className="text-zinc-400 w-24 h-24 md:w-32 md:h-32" strokeWidth={1} />
                                </motion.div>
                            </div>

                            <h3 className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-xs mb-2">Winner</h3>
                            <h1 className="text-5xl md:text-7xl font-[1000] italic text-white mb-6 tracking-tighter">
                                ARA<span className="text-red-600">ZON</span>
                            </h1>

                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="bg-white text-black py-5 px-8 rounded-2xl inline-block w-full shadow-[0_10px_30px_rgba(255,255,255,0.1)]"
                            >
                                <span className="block text-4xl md:text-6xl font-black tracking-tighter leading-none">₹2,000</span>
                                <span className="block text-[10px] font-black uppercase tracking-[0.2em] mt-2 opacity-60">Cash Prize</span>
                                <div className="mt-3 flex justify-center">
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                        className="bg-red-600 rounded-full p-1"
                                    >
                                        <Zap size={18} fill="white" className="text-white" />
                                    </motion.div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* 2nd PLACE CARD */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, type: "spring" }}
                    >
                        <HolographicCard
                            rank="2nd"
                            amount="₹1,000"
                            title="Runner Up"
                            icon={<Gift size={40} />}
                        />
                    </motion.div>

                </div>
            </div>
        </section>
    );
}

function HolographicCard({ rank, amount, title, icon }: { rank: string, amount: string, title: string, icon: any }) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);
    const rotateX = useTransform(mouseYSpring, [-100, 100], [10, -10]);
    const rotateY = useTransform(mouseXSpring, [-100, 100], [-10, 10]);

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - rect.left - rect.width / 2);
        y.set(e.clientY - rect.top - rect.height / 2);
    };

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={() => { x.set(0); y.set(0); }}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="relative group cursor-pointer w-[300px] h-[320px]"
        >
            <div className="absolute inset-0 border border-white/20 rounded-[2rem] group-hover:border-red-600/50 transition-colors duration-500" />

            <div className="absolute inset-0 bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center overflow-hidden">

                {/* Holographic Sweep */}
                <motion.div
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none"
                />

                <div className="absolute top-6 right-6 opacity-30 group-hover:opacity-100 group-hover:text-red-500 transition-all">
                    <Sparkles size={20} className="animate-pulse" />
                </div>

                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-6">
                    {rank} PLACE
                </span>

                <motion.div
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    className="text-white/80 group-hover:text-red-500 transition-colors mb-6"
                >
                    {icon}
                </motion.div>

                <div className="space-y-1">
                    <h4 className="text-white text-2xl font-black uppercase italic tracking-tight">
                        {title}
                    </h4>
                    <span className="block text-4xl font-black text-cyan-400 tracking-tighter">
                        {amount}
                    </span>
                    <span className="block text-[8px] font-bold text-zinc-500 uppercase tracking-widest pt-2">
                        Cash Award
                    </span>
                </div>
            </div>
        </motion.div>
    );
}