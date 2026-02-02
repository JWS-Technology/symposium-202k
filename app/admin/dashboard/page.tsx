"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Users,
    CreditCard,
    Calendar,
    ShieldAlert,
    Activity,
    ChevronRight,
    Lock
} from "lucide-react";

export default function AdminDashboard() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#020202] text-zinc-300 font-sans selection:bg-red-600 relative overflow-hidden">

            {/* BACKGROUND TECH OVERLAYS */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(185,28,28,0.06),transparent)] pointer-events-none" />
            <div className="fixed inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />

            {/* TOP STATUS BAR (Mobile Responsive) */}
            <div className="w-full bg-zinc-900/50 border-b border-zinc-800 px-6 py-2 flex justify-between items-center relative z-20">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">System_Online</span>
                    </div>
                </div>
                <button
                    onClick={() => { localStorage.removeItem("adminToken"); router.push("/admin/login"); }}
                    className="text-[10px] font-mono uppercase tracking-widest hover:text-red-500 transition-colors flex items-center gap-2"
                >
                    <Lock size={12} /> Secure_Logout
                </button>
            </div>

            <main className="max-w-6xl mx-auto px-6 py-12 md:py-20 relative z-10">

                {/* HERO HEADER */}
                <header className="mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-2"
                    >
                        <div className="flex items-center gap-3 font-mono text-[10px] text-red-600 tracking-[0.5em] uppercase font-black">
                            <ShieldAlert size={16} /> Admin_Level_Authorization
                        </div>
                        <h1 className="text-5xl md:text-7xl font-[1000] italic text-white uppercase tracking-tighter">
                            Control_<span className="text-red-600 text-outline">Panel</span>
                        </h1>
                        <p className="text-zinc-500 font-mono text-xs md:text-sm tracking-widest uppercase">
                            Global Symposium Management Interface v4.0.2
                        </p>
                    </motion.div>
                </header>

                {/* MAIN GRID - Fully Mobile Responsive */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    <AdminButton
                        label="View Participants"
                        desc="Access global database of all registered agents."
                        icon={<Users size={24} />}
                        count="NODE_SCAN"
                        onClick={() => router.push("/admin/participants")}
                    />

                    <AdminButton
                        label="Verify Payments"
                        desc="Monitor and authorize incoming credit transfers."
                        icon={<CreditCard size={24} />}
                        highlight
                        count="SECURE_GATE"
                        onClick={() => router.push("/admin/payments")}
                    />

                    <AdminButton
                        label="Qustions "
                        desc="Monitor and authorize incoming credit transfers."
                        icon={<CreditCard size={24} />}
                        highlight
                        count="SECURE_GATE"
                        onClick={() => router.push("/admin/questions")}
                    />

                    <AdminButton
                        label="Manage Events"
                        desc="Configure sector mission parameters and rules."
                        icon={<Calendar size={24} />}
                        count="SECTOR_CFG"
                        onClick={() => router.push("/admin/events")}
                    />

                    <AdminButton
                        label="Results"
                        desc="Configure sector mission parameters and rules."
                        icon={<Calendar size={24} />}
                        count="SECTOR_CFG"
                        onClick={() => router.push("/admin/results")}
                    />
                </div>

                {/* FOOTER SYSTEM TICKER */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-16 pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6"
                >
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Database_Health</span>
                            <div className="flex gap-1 mt-1">
                                {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="w-4 h-1 bg-red-600/40" />)}
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Uptime</span>
                            <span className="text-white font-mono text-xs">99.998%</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-500 font-mono text-[10px] uppercase">
                        <Activity size={14} className="text-red-600 animate-pulse" /> Live_Syncing_with_Mainframe
                    </div>
                </motion.div>
            </main>

            {/* CRT SCANLINE OVERLAY */}
            <div className="fixed inset-0 pointer-events-none z-[100] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%)] bg-[length:100%_4px] opacity-20" />
        </div>
    );
}

function AdminButton({
    label,
    desc,
    onClick,
    icon,
    count,
    highlight = false,
}: {
    label: string;
    desc: string;
    icon: React.ReactNode;
    count: string;
    onClick: () => void;
    highlight?: boolean;
}) {
    return (
        <motion.button
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`group relative p-8 rounded-sm text-left transition-all border overflow-hidden
                ${highlight
                    ? "bg-red-600/5 border-red-600/50 hover:bg-red-600"
                    : "bg-[#050505] border-zinc-900 hover:border-red-600/50"
                }`}
        >
            {/* HOVER GLOW EFFECT */}
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-600/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all" />

            <div className={`mb-6 p-3 w-fit rounded-lg border transition-colors
                ${highlight
                    ? "bg-red-600 border-red-400 text-white"
                    : "bg-zinc-900 border-zinc-800 text-red-600 group-hover:bg-red-600 group-hover:text-white group-hover:border-red-400"
                }`}
            >
                {icon}
            </div>

            <div className="space-y-2 relative z-10">
                <div className="flex items-center justify-between">
                    <p className={`font-black uppercase tracking-tighter text-xl italic transition-colors
                        ${highlight ? "text-white group-hover:text-black" : "text-white group-hover:text-red-500"}`}
                    >
                        {label}
                    </p>
                    <ChevronRight size={18} className={`transition-transform group-hover:translate-x-1 ${highlight ? 'text-white group-hover:text-black' : 'text-zinc-700'}`} />
                </div>
                <p className={`text-[10px] font-mono uppercase tracking-[0.2em] mb-4
                    ${highlight ? "text-red-300 group-hover:text-black/70" : "text-zinc-600"}`}
                >
                    {count}
                </p>
                <p className={`text-xs leading-relaxed transition-colors
                    ${highlight ? "text-red-100 group-hover:text-black" : "text-zinc-500 group-hover:text-zinc-300"}`}
                >
                    {desc}
                </p>
            </div>

            {/* DECORATIVE CORNER */}
            <div className={`absolute bottom-0 right-0 w-8 h-8 transition-colors
                ${highlight ? "bg-red-400/20" : "bg-zinc-900"} 
                clip-path-triangle group-hover:bg-white/20`}
                style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}
            />
        </motion.button>
    );
}