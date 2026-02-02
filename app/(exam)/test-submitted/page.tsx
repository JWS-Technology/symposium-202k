"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaCheckCircle, FaMapMarkerAlt, FaInfoCircle, FaSpider, FaCube } from "react-icons/fa";

export default function TestSubmittedPage() {
    const router = useRouter();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.3,
                staggerChildren: 0.1
            }
        }
    };

    const webVariants = {
        hidden: { opacity: 0, scale: 0 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring" as const,
                stiffness: 80,
                damping: 20
            }
        },
    };

    const textVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#020202] text-white font-sans relative overflow-hidden">

            {/* DYNAMIC SPIDER WEB BACKGROUND */}
            <motion.div
                className="absolute inset-0 z-0 pointer-events-none"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-red-900/10 via-transparent to-transparent opacity-50"
                    variants={webVariants}
                />
                <motion.div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(circle at 20% 80%, #ff003c 1px, transparent 0), 
                                          radial-gradient(circle at 80% 20%, #ff003c 1px, transparent 0)`,
                        backgroundSize: '40px 40px',
                        opacity: 0.1
                    }}
                    variants={webVariants}
                />
                <motion.div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(circle at 50% 50%, #ff003c 1px, transparent 0)`,
                        backgroundSize: '80px 80px',
                        opacity: 0.05
                    }}
                    variants={webVariants}
                />
            </motion.div>


            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="max-w-xl w-full z-10 p-6"
            >
                <div className="relative bg-zinc-950/90 border border-red-600/30 p-8 md:p-12 rounded-3xl shadow-2xl text-center backdrop-blur-sm">

                    {/* TOP DECORATIVE ICON */}
                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                        className="flex justify-center mb-6 relative"
                    >
                        <FaCheckCircle className="text-red-600 text-7xl shadow-[0_0_40px_rgba(220,38,38,0.6)]" />
                        <motion.div
                            animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
                            transition={{ repeat: Infinity, duration: 2.5 }}
                            className="absolute inset-0 bg-red-600 rounded-full blur-xl -z-10"
                        />
                    </motion.div>

                    {/* MAIN TEXT */}
                    <motion.h1
                        variants={textVariants}
                        initial="hidden"
                        animate="visible"
                        className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter mb-4"
                    >
                        Mission <span className="text-red-600">Accomplished</span>
                    </motion.h1>

                    <motion.p
                        variants={textVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.2 }}
                        className="text-zinc-400 font-mono text-sm leading-relaxed mb-8 uppercase tracking-widest"
                    >
                        Your data has been successfully encrypted and uploaded to the Arazon central node.
                        Your participation in the prelims is officially recorded.
                    </motion.p>

                    {/* VENUE NOTICE BOX */}
                    <motion.div
                        variants={textVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.4 }}
                        className="bg-red-600/10 border border-red-600/30 rounded-2xl p-6 mb-8 relative overflow-hidden group"
                    >
                        <div className="flex items-center justify-center gap-3 text-red-500 mb-2">
                            <FaMapMarkerAlt />
                            <span className="font-black uppercase tracking-tighter italic">Result Announcement</span>
                        </div>
                        <p className="text-white text-lg font-bold uppercase leading-tight">
                            Results will be shown at the <br />
                            <span className="text-red-600">Inauguration Venue</span>
                        </p>

                        {/* Subtle Spider Decor */}
                        <FaCube className="absolute -top-4 -left-4 text-red-600/20 text-5xl rotate-45 transition-transform group-hover:rotate-0" />
                        <FaSpider className="absolute -bottom-2 -right-2 text-red-600/20 text-5xl rotate-12 transition-transform group-hover:rotate-0" />
                    </motion.div>

                    {/* ACTION BUTTON */}
                    <motion.div
                        variants={textVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.6 }}
                        className="space-y-4"
                    >
                        <button
                            onClick={() => router.push("/")}
                            className="w-full bg-white text-black py-4 rounded-xl font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-xl flex items-center justify-center gap-2 group"
                        >
                            Return to HQ
                            <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity }}>→</motion.span>
                        </button>

                        <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.3em]">
                            <FaInfoCircle />
                            System_Status: Secure
                        </div>
                    </motion.div>
                </div>

                {/* BOTTOM BRANDING */}
                <motion.div
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.8 }}
                    className="mt-8 text-center"
                >
                    <p className="text-[10px] font-mono text-zinc-700 tracking-[0.5em] uppercase">
                        ARAZON // PROJECT_2026
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
}