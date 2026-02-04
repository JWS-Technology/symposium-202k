"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Trophy, Gift, Star, Zap, Sparkles } from "lucide-react";
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

            {/* 2. THE BACKGROUND WEB ENGINE (Smooth Slow Rotation) */}
            <div className="absolute inset-0 z-0 flex items-center justify-center">
                <motion.div
                    animate={{
                        rotate: 360,
                        scale: [1, 1.1, 1]
                    }}
                    transition={{
                        rotate: { duration: 60, repeat: Infinity, ease: "linear" },
                        scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="w-[800px] h-[800px] opacity-20 border border-red-600/30 rounded-full blur-sm"
                />
                <motion.div
                    animate={{ opacity: [0.05, 0.15, 0.05] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute w-[400px] h-[400px] bg-red-600/10 blur-[120px] rounded-full"
                />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">

                {/* HEADER - Staggered Text Reveal */}
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, letterSpacing: "0.5em" }}
                        whileInView={{ opacity: 1, letterSpacing: "0.2em" }}
                        transition={{ duration: 1 }}
                        className="text-zinc-500 text-xl md:text-3xl font-black uppercase mb-2"
                    >
                        PRIZE
                    </motion.h2>
                </div>

                {/* PRIZE CONTAINER */}
                <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-4">

                    {/* 2nd PLACE CARD - Advanced Tilt */}
                    <motion.div
                        initial={{ opacity: 0, x: -100, rotateY: 30 }}
                        whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, type: "spring" }}
                        className="order-2 lg:order-1"
                    >
                        <HolographicCard rank="2nd" title="Exciting Prizes" icon={<Gift size={32} />} />
                    </motion.div>

                    {/* 1st PLACE MAIN CARD - Floating & Glow Pulse */}
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="order-1 lg:order-2 relative z-20 group"
                    >
                        <motion.div
                            animate={{ opacity: [0.2, 0.4, 0.2] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="absolute -inset-1 bg-white rounded-[2.5rem] blur-xl"
                        />

                        <div className="relative bg-[#080808]/90 border-[3px] border-white rounded-[2.5rem] p-8 md:p-12 w-full max-w-md md:w-[450px] text-center shadow-2xl overflow-hidden">

                            {/* Inner Laser Scan Animation */}
                            <motion.div
                                animate={{ top: ["-100%", "200%"] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                className="absolute left-0 w-full h-1/2 bg-gradient-to-b from-transparent via-red-600/5 to-transparent skew-y-12 pointer-events-none"
                            />

                            {/* Trophy & Web Overlay */}
                            <div className="relative mb-8 flex justify-center">
                                <motion.div
                                    animate={{ width: ["0%", "100%", "0%"], opacity: [0, 1, 0] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="absolute inset-0 flex items-center justify-center"
                                >
                                    <div className="w-full h-[1px] bg-red-600 shadow-[0_0_15px_red]" />
                                </motion.div>
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="relative z-10 bg-[#080808] p-4 rounded-full border border-zinc-800"
                                >
                                    <Trophy className="text-zinc-400 w-24 h-24 md:w-32 md:h-32" strokeWidth={1} />
                                </motion.div>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-[1000] italic text-white mb-6 tracking-tighter">
                                ARAZON<span className="text-red-600">.</span>
                            </h1>

                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="bg-white text-black py-4 px-8 rounded-2xl inline-block w-full shadow-[0_10px_30px_rgba(255,255,255,0.1)]"
                            >
                                <span className="block text-4xl md:text-5xl font-black tracking-tighter leading-none">₹2,000</span>
                                <span className="block text-[10px] font-bold uppercase tracking-[0.2em] mt-1 opacity-60">Cash Prize</span>
                                <div className="mt-2 flex justify-center">
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                        className="bg-red-600 rounded-full p-1 shadow-lg shadow-red-600/50"
                                    >
                                        <Zap size={16} fill="white" className="text-white" />
                                    </motion.div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* 3rd PLACE CARD - Advanced Tilt */}
                    <motion.div
                        initial={{ opacity: 0, x: 100, rotateY: -30 }}
                        whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, type: "spring" }}
                        className="order-3 lg:order-3"
                    >
                        <HolographicCard rank="3rd" title="Exciting Prizes" icon={<Star size={32} />} />
                    </motion.div>

                </div>
            </div>
        </section>
    );
}

function HolographicCard({ rank, title, icon }: { rank: string, title: string, icon: any }) {
    // Advanced Mouse Parallax Spring Physics
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);
    const rotateX = useTransform(mouseYSpring, [-100, 100], [10, -10]);
    const rotateY = useTransform(mouseXSpring, [-100, 100], [-10, 10]);

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        x.set(mouseX - width / 2);
        y.set(mouseY - height / 2);
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
            className="relative group cursor-pointer w-[280px] h-[180px] md:h-[220px]"
        >
            {/* Holographic Border Glow */}
            <div className="absolute inset-0 border border-white opacity-20 rounded-3xl group-hover:opacity-100 group-hover:border-red-600 transition-all duration-500" />

            <div className="absolute inset-0 bg-white/5 backdrop-blur-sm border border-white/40 rounded-3xl p-6 flex flex-col items-center justify-center text-center overflow-hidden">

                {/* Advanced Light Streak */}
                <motion.div
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 pointer-events-none"
                />

                <div className="absolute top-2 right-2 opacity-40 group-hover:opacity-100 group-hover:text-red-500 transition-colors">
                    <Sparkles size={16} className="animate-pulse" />
                </div>

                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4 group-hover:text-red-500 transition-colors">
                    {rank} PLACE
                </span>

                <motion.div
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    className="text-white mb-4"
                >
                    {icon}
                </motion.div>

                <h4 className="text-white text-xl font-black uppercase tracking-tight leading-none group-hover:scale-105 transition-transform">
                    {title.split(' ')[0]} <br /> {title.split(' ')[1]}
                </h4>
            </div>
        </motion.div>
    );
}