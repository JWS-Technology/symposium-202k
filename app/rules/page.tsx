"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    ShieldAlert,
    Terminal,
    Cpu,
    Music,
    Users,
    Clock,
    AlertTriangle,
    FileText,
    Layout,
    Bug,
    Mic2,
    Trophy
} from 'lucide-react';

export default function RulesPage() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="min-h-screen bg-[#020202] text-zinc-300 py-12 px-4 relative overflow-hidden font-sans">

            {/* ANIMATED WEB BACKGROUND */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <svg width="100%" height="100%" className="absolute inset-0">
                    <pattern id="web-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                        <path d="M 100 0 L 0 0 0 100" fill="none" stroke="red" strokeWidth="0.5" />
                        <circle cx="0" cy="0" r="1" fill="red" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#web-pattern)" />
                </svg>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">

                {/* HEADER */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center mb-16"
                >
                    <div className="flex justify-center items-center gap-2 mb-4">
                        <div className="h-[2px] w-12 bg-red-600 hidden md:block" />
                        <ShieldAlert className="text-red-600 animate-pulse" size={24} />
                        <span className="text-red-600 font-mono tracking-[0.5em] text-[10px] uppercase">Official_Protocol_v2.6</span>
                        <div className="h-[2px] w-12 bg-red-600 hidden md:block" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black italic text-white uppercase tracking-tighter">
                        RULES & <span className="text-red-600">REGULATIONS_</span>
                    </h1>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {/* GENERAL RULES */}
                    <RuleCard
                        title="General Rules"
                        icon={<AlertTriangle className="text-white" />}
                        color="border-red-600"
                        rules={[
                            "Valid college ID mandatory",
                            "Reporting time must be followed",
                            "Organizers reserve rights to modify rules",
                            "Only one team per department"
                        ]}
                    />

                    {/* NON-TECHNICAL SECTOR */}
                    <CategoryHeader title="NON-TECHNICAL SECTOR" />

                    <RuleCard
                        title="Spider Sense (Quiz)"
                        icon={<Terminal />}
                        teamSize="2 Members"
                        rules={[
                            "Prelims + Multiple rounds",
                            "Mobile phones strictly prohibited",
                            "Quiz master’s decision is final"
                        ]}
                    />

                    <RuleCard
                        title="Brand Verse (AdZap)"
                        icon={<Layout />}
                        teamSize="5 Members"
                        rules={[
                            "Topic given on the spot",
                            "5 mins performance time",
                            "Props allowed (self-responsibility)"
                        ]}
                    />

                    <RuleCard
                        title="WebBid League (IPL Auction)"
                        icon={<Trophy />}
                        teamSize="2 Members"
                        rules={[
                            "Each player carries grading points",
                            "Highest total points ranks higher",
                            "Organizers’ decision is final"
                        ]}
                    />

                    {/* TECHNICAL SECTOR */}
                    <CategoryHeader title="TECHNICAL SECTOR" />

                    <RuleCard
                        title="Web of Ideas (Paper)"
                        icon={<FileText />}
                        teamSize="Max 2 Members"
                        rules={[
                            "PPT format only",
                            "5 mins + Q&A",
                            "Topics: Quantum, AI, Cloud, Big Data, Cyber Security"
                        ]}
                    />

                    <RuleCard
                        title="Web Craft (Web Design)"
                        icon={<Cpu />}
                        teamSize="Max 2 Members"
                        rules={[
                            "HTML, CSS, JS only",
                            "No internet access / No templates",
                            "Prelims will be conducted"
                        ]}
                    />

                    <RuleCard
                        title="Bug Busters (Debugging)"
                        icon={<Bug />}
                        teamSize="Max 2 Members"
                        rules={[
                            "C, Python, Java, C++ questions",
                            "Internet usage prohibited",
                            "Code will be provided"
                        ]}
                    />

                    {/* CULTURAL SECTOR */}
                    <CategoryHeader title="CULTURAL SECTOR" />

                    <RuleCard
                        title="Velocity (Dance)"
                        icon={<Users />}
                        teamSize="1 - 6 Members"
                        rules={[
                            "Solo / Group allowed",
                            "Vulgarity = Instant Disqualification",
                            "Submit songs before event"
                        ]}
                    />

                    <RuleCard
                        title="Resonance (Singing)"
                        icon={<Mic2 />}
                        teamSize="1 - 3 Members"
                        rules={[
                            "Karaoke allowed",
                            "Any language allowed",
                            "Strictly no vulgarity"
                        ]}
                    />

                </motion.div>

                {/* FOOTER ACTION */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-20 text-center bg-red-600/10 border border-red-600/20 p-8 rounded-3xl backdrop-blur-md"
                >
                    <h3 className="text-white font-black text-xl mb-4 italic">READY TO ENTER THE MULTIVERSE?</h3>
                    <button className="px-10 py-4 bg-red-600 text-white font-black uppercase text-xs tracking-widest skew-x-[-15deg] hover:bg-red-500 transition-all">
                        <span className="skew-x-[15deg] inline-block">REGISTER_NOW</span>
                    </button>
                </motion.div>
            </div>
        </div>
    );
}

/* ================= HELPER COMPONENTS ================= */

function CategoryHeader({ title }: { title: string }) {
    return (
        <div className="col-span-1 md:col-span-2 lg:col-span-3 mt-10 mb-4">
            <div className="flex items-center gap-4">
                <h2 className="text-red-600 font-mono text-xs font-black tracking-[0.3em] whitespace-nowrap">{title}</h2>
                <div className="h-[1px] w-full bg-red-600/20 shadow-[0_0_10px_rgba(220,38,38,0.5)]" />
            </div>
        </div>
    );
}

function RuleCard({ title, icon, rules, teamSize, color = "border-zinc-800" }: any) {
    return (
        <motion.div
            variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1 }
            }}
            whileHover={{ scale: 1.02, rotate: 1 }}
            className={`bg-[#050505] border ${color} p-6 rounded-2xl relative group overflow-hidden shadow-2xl`}
        >
            {/* Web Line Decor */}
            <div className="absolute top-0 right-0 w-16 h-16 opacity-10 group-hover:opacity-30 transition-opacity">
                <svg viewBox="0 0 100 100" className="rotate-90">
                    <path d="M0 0 L100 100 M20 0 L100 80 M40 0 L100 60" stroke="red" strokeWidth="2" />
                </svg>
            </div>

            <div className="flex items-start justify-between mb-6">
                <div className="p-3 bg-zinc-900 rounded-xl text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors duration-500">
                    {React.cloneElement(icon, { size: 20 })}
                </div>
                {teamSize && (
                    <span className="text-[9px] font-mono bg-red-600/10 text-red-500 px-3 py-1 rounded-full border border-red-600/20 uppercase tracking-widest">
                        {teamSize}
                    </span>
                )}
            </div>

            <h3 className="text-white font-black text-lg uppercase italic tracking-tighter mb-4">{title}</h3>

            <ul className="space-y-3">
                {rules.map((rule: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-xs text-zinc-500 group-hover:text-zinc-300 transition-colors">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-600 shadow-[0_0_5px_red]" />
                        {rule}
                    </li>
                ))}
            </ul>
        </motion.div>
    );
}