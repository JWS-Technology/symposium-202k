"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
    ShieldAlert, Terminal, Cpu, Music, Users, Clock, AlertTriangle,
    FileText, Layout, Bug, Mic2, Trophy, Zap, Radio
} from 'lucide-react';

export default function RulesPage() {
    const { scrollYProgress } = useScroll();
    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

    return (
        <div className="min-h-screen bg-[#020202] text-zinc-300 py-20 px-4 relative overflow-hidden font-sans selection:bg-red-600 selection:text-white">

            {/* --- ADVANCED BACKGROUND ELEMENTS --- */}
            <div className="fixed inset-0 pointer-events-none">
                {/* Comic Halftone Dots */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: `radial-gradient(#fff 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />

                {/* Moving Scanline */}
                <motion.div
                    animate={{ y: ["0%", "100%"] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-600/20 to-transparent z-0"
                />

                {/* Cyber Web Grid */}
                <svg width="100%" height="100%" className="absolute inset-0 opacity-10">
                    <pattern id="cyber-grid" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                        <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#ff0000" strokeWidth="0.5" />
                        <path d="M 0 0 L 100 100" fill="none" stroke="#ff0000" strokeWidth="0.2" opacity="0.3" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#cyber-grid)" />
                </svg>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">

                {/* --- HEADER WITH GLITCH EFFECT --- */}
                <motion.header
                    style={{ opacity }}
                    className="text-center mb-24 relative"
                >
                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="inline-flex items-center gap-3 px-4 py-1 rounded-full border border-red-600/30 bg-red-600/5 mb-6"
                    >
                        <Radio className="text-red-600 animate-pulse" size={14} />
                        <span className="text-red-600 font-mono tracking-[0.3em] text-[10px] uppercase font-bold">
                            Incoming_Data_Stream_v2.6
                        </span>
                    </motion.div>

                    <div className="relative inline-block">
                        <h1 className="text-6xl md:text-9xl font-black italic text-white uppercase tracking-tighter leading-tight">
                            SYSTEM <span className="text-red-600">RULES_</span>
                        </h1>
                        {/* Duplicate for Glitch shadow */}
                        <motion.h1
                            animate={{ x: [-2, 2, -1], opacity: [0.5, 0.2, 0.5] }}
                            transition={{ repeat: Infinity, duration: 0.2 }}
                            className="absolute inset-0 text-6xl md:text-9xl font-black italic text-cyan-400 uppercase tracking-tighter leading-tight mix-blend-screen opacity-30 pointer-events-none translate-x-1"
                        >
                            SYSTEM <span className="text-red-600">RULES_</span>
                        </motion.h1>
                    </div>
                </motion.header>

                {/* --- MAIN CONTENT --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {/* CORE DIRECTIVES */}
                    <div className="lg:col-span-3">
                        <CategoryHeader title="CORE_DIRECTIVES" icon={<ShieldAlert />} />
                    </div>

                    <RuleCard
                        title="General Protocol"
                        icon={<AlertTriangle />}
                        color="red"
                        delay={0.1}
                        rules={[
                            "Valid Institutional ID is mandatory for entry.",
                            "Strict adherence to reporting schedules.",
                            "Command decision by organizers is final.",
                            "Single team entry per department squad."
                        ]}
                    />

                    {/* SECTOR: NON-TECHNICAL */}
                    <div className="lg:col-span-3 mt-12">
                        <CategoryHeader title="SECTOR_01: NON-TECHNICAL" icon={<Zap />} />
                    </div>

                    <RuleCard
                        title="Spider Sense (Quiz)"
                        icon={<Terminal />}
                        teamSize="2 Participants"
                        delay={0.2}
                        rules={[
                            "Multi-stage elimination protocols.",
                            "External comms (mobiles) strictly jammed.",
                            "Quiz Master holds absolute authority."
                        ]}
                    />

                    <RuleCard
                        title="Brand Verse (AdZap)"
                        icon={<Layout />}
                        teamSize="Max 5 Participants"
                        delay={0.3}
                        rules={[
                            "Flash-topic assignment on stage.",
                            "300-second performance window.",
                            "Self-sourced prop-deployment allowed."
                        ]}
                    />

                    <RuleCard
                        title="WebBid League (IPL)"
                        icon={<Trophy />}
                        teamSize="2 Participants"
                        delay={0.4}
                        rules={[
                            "Strategic bidding with assigned points.",
                            "Squad value optimization wins.",
                            "Real-time auction dynamics."
                        ]}
                    />

                    {/* SECTOR: TECHNICAL */}
                    <div className="lg:col-span-3 mt-12">
                        <CategoryHeader title="SECTOR_02: TECHNICAL" icon={<Cpu />} />
                    </div>

                    <RuleCard
                        title="Web of Ideas (Paper)"
                        icon={<FileText />}
                        teamSize="Max 2 Participants"
                        delay={0.5}
                        rules={[
                            "PPT format submission required.",
                            "5m Briefing + Q&A debrief.",
                            "Focus: AI, Quantum, Cyber-Sec, Cloud."
                        ]}
                    />

                    <RuleCard
                        title="Web Verse (Web Design)"
                        icon={<Layout />}
                        teamSize="Max 2 Paricipants"
                        delay={0.6}
                        rules={[
                            "HTML/CSS/JS stack only.",
                            "No template imports. Raw code only.",
                            "Offline environment deployment."
                        ]}
                    />

                    <RuleCard
                        title="Bug Busters (Debug)"
                        icon={<Bug />}
                        teamSize="Max 1 Participants"
                        delay={0.7}
                        rules={[
                            "Multi-language code verification.",
                            "Identification of logic vulnerabilities.",
                            "Time-sensitive repair challenges."
                        ]}
                    />

                    {/* SECTOR: CULTURAL */}
                    <div className="lg:col-span-3 mt-12">
                        <CategoryHeader title="SECTOR_03: CULTURAL" icon={<Music />} />
                    </div>

                    <RuleCard
                        title="Velocity (Dance)"
                        icon={<Users />}
                        teamSize="1 - 6 Participants"
                        delay={0.8}
                        rules={[
                            "Solo or squad deployment allowed.",
                            "Pre-submission of audio tracks.",
                            "Zero-tolerance for content vulgarity."
                        ]}
                    />

                    <RuleCard
                        title="Resonance (Singing)"
                        icon={<Mic2 />}
                        teamSize="1 - 3 Participants"
                        delay={0.9}
                        rules={[
                            "Karaoke/Acoustical support allowed.",
                            "Multilingual vocal expression.",
                            "Focus on pitch and sonic clarity."
                        ]}
                    />
                </div>
            </div>

            {/* Bottom Accent */}
            <div className="h-40" />
        </div>
    );
}

/* ================= HELPER COMPONENTS ================= */

function CategoryHeader({ title, icon }: { title: string, icon: React.ReactNode }) {
    return (
        <motion.div
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-8"
        >
            <div className="flex items-center justify-center w-10 h-10 bg-red-600 text-black skew-x-[-12deg] shadow-[4px_4px_0px_#fff]">
                {icon}
            </div>
            <h2 className="text-white font-black text-2xl md:text-3xl italic uppercase tracking-tighter">{title}</h2>
            <div className="flex-grow h-[2px] bg-gradient-to-r from-red-600 to-transparent" />
        </motion.div>
    );
}

function RuleCard({ title, icon, rules, teamSize, delay }: any) {
    const [rotate, setRotate] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientY - rect.top) / rect.height - 0.5;
        const y = (e.clientX - rect.left) / rect.width - 0.5;
        setRotate({ x: x * 10, y: -y * 10 });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.5 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setRotate({ x: 0, y: 0 })}
            style={{
                transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
                transition: 'transform 0.1s ease-out'
            }}
            className="group relative"
        >
            {/* Holographic Border Effect */}
            <div className="absolute -inset-[1px] bg-gradient-to-br from-red-600 via-transparent to-cyan-500 rounded-2xl opacity-20 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative bg-[#080808] border border-white/5 p-8 rounded-2xl overflow-hidden h-full">

                {/* Comic Skew Decor */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/5 -translate-y-12 translate-x-12 rotate-45 group-hover:bg-red-600/10 transition-colors" />

                <div className="flex items-start justify-between mb-8">
                    <div className="p-4 bg-zinc-900 border border-white/5 rounded-xl text-red-600 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                        {React.cloneElement(icon, { size: 24, strokeWidth: 2.5 })}
                    </div>
                    {teamSize && (
                        <div className="text-[10px] font-black font-mono bg-white text-black px-3 py-1 skew-x-[-12deg] shadow-[3px_3px_0px_#ff0000]">
                            {teamSize}
                        </div>
                    )}
                </div>

                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-6 group-hover:text-red-500 transition-colors">
                    {title}
                </h3>

                <ul className="space-y-4">
                    {rules.map((rule: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-zinc-400 group-hover:text-zinc-100 transition-colors">
                            <motion.span
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
                                className="mt-1.5 w-1.5 h-1.5 shrink-0 bg-red-600 rotate-45 shadow-[0_0_8px_#ff0000]"
                            />
                            <span className="font-medium tracking-tight leading-relaxed">{rule}</span>
                        </li>
                    ))}
                </ul>

                {/* Corner Scan Line */}
                <div className="absolute bottom-2 right-2 flex gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
                    <div className="w-1 h-4 bg-red-600" />
                    <div className="w-1 h-4 bg-red-600/50" />
                    <div className="w-1 h-4 bg-red-600/20" />
                </div>
            </div>
        </motion.div>
    );
}