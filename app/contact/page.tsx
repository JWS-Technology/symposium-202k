"use client";
import { motion } from "framer-motion";
import { FaSpider, FaPhone, FaEnvelope, FaLocationDot, FaArrowRight, FaShieldHalved, FaUserSecret } from "react-icons/fa6";

export default function ContactPage() {

    const secretary = {
        name: "LOYOL MICHEAL VIPIN",
        role: "General Secretary // ARAZON 2K26",
        phone: "+91 6385266784",
        email: "xlmvipin@gmail.com",
    };

    return (
        <div className="min-h-screen pt-24 md:pt-32 pb-20 px-4 md:px-6 bg-black relative overflow-hidden">
            {/* Background Cyber-Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:3rem_3rem] md:bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />

            {/* Animated Halftone Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header Section */}
                <header className="mb-12 md:mb-16 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative inline-block"
                    >
                        <h1 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter text-white leading-none">
                            SEC<span className="text-red-600">RETARY</span>
                        </h1>
                        <div className="h-1.5 md:h-2 w-full bg-red-600 mt-2 md:mt-4 skew-x-[-20deg]" />
                        <p className="text-zinc-500 font-mono text-[10px] md:text-xs mt-4 md:mt-6 tracking-[0.2em] md:tracking-[0.3em] uppercase flex items-center justify-center gap-2 md:gap-3">
                            <FaShieldHalved className="text-red-600 animate-pulse" /> Authentication Required // SECURE_CHANNEL
                        </p>
                    </motion.div>
                </header>

                {/* Single Secretary Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="group relative bg-zinc-900/40 md:bg-zinc-900/60 border-2 border-zinc-800 p-6 md:p-12 backdrop-blur-2xl overflow-hidden mx-auto shadow-2xl"
                    style={{ clipPath: 'polygon(0% 0%, 92% 0%, 100% 8%, 100% 100%, 8% 100%, 0% 92%)' }}
                >
                    {/* Glowing Accent */}
                    <div className="absolute top-0 left-0 w-1 h-full bg-red-600 group-hover:shadow-[0_0_25px_rgba(220,38,38,1)] transition-all duration-500" />

                    {/* Ghost Spider Logo - Scaled for mobile */}
                    <FaSpider className="absolute -right-6 -bottom-6 md:-right-8 md:-bottom-8 text-white/5 text-[12rem] md:text-[18rem] -rotate-12 group-hover:text-red-600/10 transition-all duration-700" />

                    <div className="relative z-10 flex flex-col md:flex-row gap-8 md:gap-12 items-center">

                        {/* Avatar Section */}
                        <div className="relative shrink-0">
                            <div className="w-32 h-32 md:w-40 md:h-40 bg-black border-2 border-zinc-800 flex items-center justify-center relative group-hover:border-red-600 transition-colors duration-500 shadow-inner"
                                style={{ clipPath: 'polygon(20% 0%, 100% 0%, 100% 80%, 80% 100%, 0% 100%, 0% 20%)' }}>
                                <FaUserSecret className="text-zinc-700 text-6xl md:text-7xl group-hover:text-red-600 transition-colors duration-500" />
                            </div>
                            <div className="absolute -bottom-2 -left-2 bg-red-600 text-black font-black text-[9px] md:text-[10px] px-2 md:px-3 py-1 uppercase tracking-tighter skew-x-[-15deg] shadow-lg">
                                SEC_ID_2K26
                            </div>
                        </div>

                        {/* Secretary Content */}
                        <div className="flex-1 text-center md:text-left w-full">
                            <div className="inline-block bg-white/5 px-3 py-1 mb-4 border border-white/10">
                                <span className="text-[10px] font-mono text-red-500 tracking-[0.4em] uppercase font-bold">Auth: LVL_01</span>
                            </div>

                            <h3 className="text-3xl md:text-6xl font-black text-white italic uppercase leading-none mb-3 break-words">
                                {secretary.name}
                            </h3>
                            <p className="text-zinc-500 font-bold text-xs md:text-sm uppercase tracking-[0.15em] md:tracking-[0.2em] mb-8 md:mb-10">{secretary.role}</p>

                            <div className="grid grid-cols-1 gap-3 md:gap-4">
                                {/* Mobile Direct Link */}
                                <a
                                    href={`tel:${secretary.phone}`}
                                    className="flex items-center gap-4 md:gap-6 text-zinc-300 hover:text-white transition-all group/link bg-black/40 p-4 md:p-5 border border-zinc-800 hover:border-red-600/50 hover:bg-black/80"
                                >
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-zinc-900 border border-zinc-700 flex items-center justify-center group-hover/link:bg-red-600 transition-all shrink-0">
                                        <FaPhone className="text-sm md:text-base group-hover/link:text-black group-hover/link:scale-110 transition-transform" />
                                    </div>
                                    <div className="text-left overflow-hidden">
                                        <p className="text-[8px] md:text-[9px] font-black text-red-600 uppercase tracking-widest mb-0.5">Secure_Voice</p>
                                        <span className="font-mono text-base md:text-lg tracking-tight block truncate">{secretary.phone}</span>
                                    </div>
                                    <FaArrowRight className="ml-auto opacity-0 group-hover/link:opacity-100 group-hover/link:translate-x-1 transition-all text-red-600 hidden md:block" />
                                </a>

                                {/* Email Direct Link */}
                                <a
                                    href={`mailto:${secretary.email}`}
                                    className="flex items-center gap-4 md:gap-6 text-zinc-300 hover:text-white transition-all group/link bg-black/40 p-4 md:p-5 border border-zinc-800 hover:border-red-600/50 hover:bg-black/80"
                                >
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-zinc-900 border border-zinc-700 flex items-center justify-center group-hover/link:bg-red-600 transition-all shrink-0">
                                        <FaEnvelope className="text-sm md:text-base group-hover/link:text-black group-hover/link:scale-110 transition-transform" />
                                    </div>
                                    <div className="text-left overflow-hidden">
                                        <p className="text-[8px] md:text-[9px] font-black text-red-600 uppercase tracking-widest mb-0.5">Packet_Mail</p>
                                        <span className="font-mono text-base md:text-lg tracking-tight block truncate">{secretary.email}</span>
                                    </div>
                                    <FaArrowRight className="ml-auto opacity-0 group-hover/link:opacity-100 group-hover/link:translate-x-1 transition-all text-red-600 hidden md:block" />
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Bottom Address Link */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-12 flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4 text-zinc-600 text-center"
                >
                    <div className="flex items-center gap-2">
                        <FaLocationDot className="text-red-600/50" />
                        <p className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] md:tracking-[0.3em]">
                            Dept of IT, St. Joseph&apos;s College, Trichy-02
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}