"use client";
import { motion } from "framer-motion";
import { FaSpider, FaPhone, FaEnvelope, FaLocationDot, FaDiscord } from "react-icons/fa6";

export default function ContactPage() {
    return (
        <div className="min-h-screen pt-32 pb-20 px-6 bg-black relative overflow-hidden">

            {/* Background Subtle Web Grid */}
            <div className="absolute inset-0 opacity-5 pointer-events-none"
                style={{ backgroundImage: `radial-gradient(circle at 2px 2px, red 1px, transparent 0)`, backgroundSize: '30px 30px' }}
            />

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-16"
                >
                    <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white">
                        ESTABLISH <span className="text-red-600">CONTACT</span>
                    </h1>
                    <p className="text-zinc-500 font-mono text-sm mt-4 tracking-widest uppercase">
            // Secure Channel: IT_SYMPOSIUM_TRANSCEIVER
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                    {/* Left Side: Contact Intelligence */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-12"
                    >
                        <div>
                            <h2 className="text-red-600 font-black uppercase text-xs tracking-[0.4em] mb-8">Intelligence HQ</h2>
                            <div className="space-y-8">

                                <div className="flex items-start gap-6 group">
                                    <div className="p-4 bg-zinc-900 border border-red-600/30 text-red-600 skew-x-[-10deg] group-hover:bg-red-600 group-hover:text-black transition-all">
                                        <FaLocationDot size={20} className="-skew-x-[-10deg]" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold uppercase italic">Location</h4>
                                        <p className="text-zinc-500 text-sm mt-1">St. Joseph&apos;s College (Autonomous), Trichy-02</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6 group">
                                    <div className="p-4 bg-zinc-900 border border-red-600/30 text-red-600 skew-x-[-10deg] group-hover:bg-red-600 group-hover:text-black transition-all">
                                        <FaEnvelope size={20} className="-skew-x-[-10deg]" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold uppercase italic">Secure Mail</h4>
                                        <p className="text-zinc-500 text-sm mt-1">it.sympo2k25@sjc.edu</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6 group">
                                    <div className="p-4 bg-zinc-900 border border-red-600/30 text-red-600 skew-x-[-10deg] group-hover:bg-red-600 group-hover:text-black transition-all">
                                        <FaPhone size={20} className="-skew-x-[-10deg]" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold uppercase italic">Direct Signal</h4>
                                        <p className="text-zinc-500 text-sm mt-1">+91 98765 43210</p>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Decorative Glitch Box */}
                        <div className="p-6 border-l-2 border-red-600 bg-red-600/5 font-mono text-[10px] text-red-500/60 leading-relaxed uppercase">
                            Warning: All transmissions are monitored. Ensure your multidimensional frequency is synced before sending data packets.
                        </div>
                    </motion.div>

                    {/* Right Side: Communication Terminal (Form) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800 p-8 md:p-10 relative overflow-hidden"
                        style={{ clipPath: 'polygon(0% 0%, 92% 0%, 100% 8%, 100% 100%, 8% 100%, 0% 92%)' }}
                    >
                        {/* Corner Accent */}
                        <div className="absolute top-0 right-0 w-12 h-12 bg-red-600 flex items-center justify-center">
                            <FaSpider className="text-black" />
                        </div>

                        <form className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Operator Identity</label>
                                <input
                                    type="text"
                                    placeholder="FULL_NAME"
                                    className="w-full bg-black border border-zinc-800 p-4 text-white text-sm focus:border-red-600 outline-none transition-all placeholder:text-zinc-800 italic"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Frequency Link</label>
                                <input
                                    type="email"
                                    placeholder="EMAIL_ADDRESS"
                                    className="w-full bg-black border border-zinc-800 p-4 text-white text-sm focus:border-red-600 outline-none transition-all placeholder:text-zinc-800 italic"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Packet Data</label>
                                <textarea
                                    rows={4}
                                    placeholder="TYPE_YOUR_MESSAGE_HERE"
                                    className="w-full bg-black border border-zinc-800 p-4 text-white text-sm focus:border-red-600 outline-none transition-all placeholder:text-zinc-800 italic resize-none"
                                />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-red-600 text-black font-black uppercase italic py-4 flex items-center justify-center gap-3 hover:bg-white transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                            >
                                Transmit Signal
                            </motion.button>
                        </form>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}