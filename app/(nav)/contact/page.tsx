"use client";
import { motion } from "framer-motion";
import { FaSpider, FaPhone, FaEnvelope, FaLocationDot, FaArrowRight, FaShieldHalved, FaUserSecret, FaCode } from "react-icons/fa6";

export default function ContactPage() {

    const contacts = [
        {
            name: "LOYOL MICHEAL VIPIN",
            role: "General Secretary // ARAZON 2K26",
            phone: "+91 6385266784",
            email: "xlmvipin@gmail.com",
            id: "SEC_ID_2K26",
            icon: <FaUserSecret />,
            level: "LVL_01"
        },
        {
            name: "MARIYA EFRON",
            role: "Tech Support // ARAZON 2K26",
            phone: "+91 8122642246",
            email: "mariyaefrony@gmail.com",
            id: "SYS_ADMIN_01",
            icon: <FaCode />,
            level: "S-ROOT"
        }
    ];

    return (
        <div className="min-h-screen pt-24 md:pt-32 pb-20 px-4 md:px-6 bg-black relative overflow-hidden">
            {/* Background Cyber-Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:3rem_3rem] md:bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />

            {/* Animated Halftone Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header Section */}
                <header className="mb-16 md:mb-24 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative inline-block"
                    >
                        <h1 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter text-white leading-none">
                            HELP_<span className="text-red-600 text-outline">DESK</span>
                        </h1>
                        <div className="h-1.5 md:h-2 w-full bg-red-600 mt-2 md:mt-4 skew-x-[-20deg]" />
                        <p className="text-zinc-500 font-mono text-[10px] md:text-xs mt-4 md:mt-6 tracking-[0.2em] md:tracking-[0.3em] uppercase flex items-center justify-center gap-2 md:gap-3">
                            <FaShieldHalved className="text-red-600 animate-pulse" /> Established_Contact_Protocol // SECURE_LINE
                        </p>
                    </motion.div>
                </header>

                {/* Contacts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                    {contacts.map((person, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.2 }}
                            className="group relative bg-zinc-900/40 border-2 border-zinc-800 p-6 md:p-10 backdrop-blur-2xl overflow-hidden shadow-2xl"
                            style={{ clipPath: 'polygon(0% 0%, 92% 0%, 100% 8%, 100% 100%, 8% 100%, 0% 92%)' }}
                        >
                            {/* Glowing Accent */}
                            <div className="absolute top-0 left-0 w-1 h-full bg-red-600 group-hover:shadow-[0_0_25px_rgba(220,38,38,1)] transition-all duration-500" />

                            <FaSpider className="absolute -right-6 -bottom-6 md:-right-8 md:-bottom-8 text-white/5 text-[10rem] md:text-[14rem] -rotate-12 group-hover:text-red-600/10 transition-all duration-700" />

                            <div className="relative z-10 flex flex-col items-center md:items-start">
                                {/* Top Badging */}
                                <div className="flex justify-between w-full mb-8">
                                    <div className="inline-block bg-white/5 px-3 py-1 border border-white/10">
                                        <span className="text-[10px] font-mono text-red-500 tracking-[0.4em] uppercase font-bold">AUTH: {person.level}</span>
                                    </div>
                                    <div className="bg-red-600 text-black font-black text-[9px] px-2 py-1 uppercase tracking-tighter skew-x-[-15deg]">
                                        {person.id}
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start w-full">
                                    {/* Avatar */}
                                    <div className="w-24 h-24 md:w-32 md:h-32 bg-black border-2 border-zinc-800 flex items-center justify-center relative group-hover:border-red-600 transition-colors duration-500 shadow-inner shrink-0"
                                        style={{ clipPath: 'polygon(20% 0%, 100% 0%, 100% 80%, 80% 100%, 0% 100%, 0% 20%)' }}>
                                        <div className="text-zinc-700 text-5xl md:text-6xl group-hover:text-red-600 transition-colors duration-500">
                                            {person.icon}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 text-center md:text-left">
                                        <h3 className="text-2xl md:text-4xl font-black text-white italic uppercase leading-none mb-2">
                                            {person.name}
                                        </h3>
                                        <p className="text-zinc-500 font-bold text-[10px] md:text-xs uppercase tracking-widest mb-6">
                                            {person.role}
                                        </p>

                                        <div className="space-y-3">
                                            {/* Phone */}
                                            <a href={`tel:${person.phone}`} className="flex items-center gap-4 text-zinc-400 hover:text-white transition-all group/link bg-black/40 p-3 border border-zinc-800 hover:border-red-600/50">
                                                <FaPhone className="text-red-600 text-xs" />
                                                <span className="font-mono text-sm tracking-tighter">{person.phone}</span>
                                            </a>
                                            {/* Email */}
                                            <a href={`mailto:${person.email}`} className="flex items-center gap-4 text-zinc-400 hover:text-white transition-all group/link bg-black/40 p-3 border border-zinc-800 hover:border-red-600/50">
                                                <FaEnvelope className="text-red-600 text-xs" />
                                                <span className="font-mono text-sm tracking-tighter truncate">{person.email}</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom Footer Info */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-20 flex flex-col items-center justify-center gap-4 text-zinc-600"
                >
                    <div className="h-[1px] w-20 bg-zinc-800" />
                    <div className="flex items-center gap-2">
                        <FaLocationDot className="text-red-600/50" />
                        <p className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.3em]">
                            Dept of IT, St. Joseph&apos;s College (Autonomous), Trichy-02
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}