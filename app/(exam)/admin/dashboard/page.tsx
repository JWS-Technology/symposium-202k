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
    Lock,
    BrainCircuit,
    Trophy,
    Database,
    Zap
} from "lucide-react";

export default function AdminDashboard() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#020202] text-zinc-300 font-sans selection:bg-red-600 relative overflow-hidden">
            {/* BACKGROUND TECH OVERLAYS */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(185,28,28,0.06),transparent)] pointer-events-none" />
            <div className="fixed inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />

            {/* TOP STATUS BAR */}
            <div className="w-full bg-zinc-900/50 border-b border-white/5 px-6 py-3 flex justify-between items-center relative z-20 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse shadow-[0_0_8px_#dc2626]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Mainframe_Secure</span>
                    </div>
                </div>
                <button
                    onClick={() => { localStorage.removeItem("adminToken"); router.push("/admin/login"); }}
                    className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-red-500 transition-colors flex items-center gap-2 group"
                >
                    <Lock size={12} className="group-hover:animate-bounce" /> Terminate_Session
                </button>
            </div>

            <main className="max-w-7xl mx-auto px-6 py-12 md:py-20 relative z-10">
                {/* HERO HEADER */}
                <header className="mb-16 border-l-4 border-red-600 pl-8">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <div className="flex items-center gap-3 font-mono text-[10px] text-red-600 tracking-[0.5em] uppercase font-black mb-2">
                            <ShieldAlert size={16} /> Root_Access_Granted
                        </div>
                        <h1 className="text-6xl md:text-8xl font-[1000] italic text-white uppercase tracking-tighter leading-none">
                            CORE_<span className="text-red-600">HUD</span>
                        </h1>
                        <p className="text-zinc-500 font-mono text-xs md:text-sm tracking-[0.3em] uppercase mt-4">
                            Symposium_Operational_Directorate // v4.0.2
                        </p>
                    </motion.div>
                </header>

                {/* MAIN GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AdminButton
                        label="Participants"
                        desc="Monitor global database of all field participants."
                        icon={<Users size={24} />}
                        tag="USER_DB"
                        onClick={() => router.push("/admin/participants")}
                    />

                    <AdminButton
                        label="Payment Status"
                        desc="Authorize and verify incoming credit transfers."
                        icon={<CreditCard size={24} />}
                        tag="FIN_SYNC"
                        highlight
                        onClick={() => router.push("/admin/payments")}
                    />
                    <AdminButton
                        label="view questions all"
                        desc="Authorize and verify incoming credit transfers."
                        icon={<CreditCard size={24} />}
                        tag="FIN_SYNC"
                        highlight
                        onClick={() => router.push("/admin/qustionsviewall")}
                    />

                    <AdminButton
                        label="Qustions Uploading"
                        desc="Configure mission questionnaires and logic tests."
                        icon={<BrainCircuit size={24} />}
                        tag="INTEL_GEN"
                        onClick={() => router.push("/admin/questions")}
                    />

                    <AdminButton
                        label="Events"
                        desc="Manage event scheduling and mission rules."
                        icon={<Calendar size={24} />}
                        tag="TIME_SYNC"
                        onClick={() => router.push("/admin/events")}
                    />

                    <AdminButton
                        label="Result"
                        desc="Calculate and finalize tactical mission scores."
                        icon={<Trophy size={24} />}
                        tag="RANK_OUT"
                        highlight
                        onClick={() => router.push("/admin/results")}
                    />

                    <AdminButton
                        label="Teams"
                        desc="Manage collective team entities and credentials."
                        icon={<Database size={24} />}
                        tag="TEAM_NODES"
                        onClick={() => router.push("/admin/users")}
                    />
                </div>

                {/* FOOTER SYSTEM TICKER */}
                <footer className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-10">
                        <div className="space-y-2">
                            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Network_Stability</span>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <div key={i} className="w-3 h-1.5 bg-red-600/40" />)}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Sync_Rate</span>
                            <span className="text-white font-mono text-xs block italic">0.002ms_LATENCY</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-red-600 font-mono text-[10px] uppercase font-black animate-pulse">
                        <Zap size={14} fill="currentColor" /> Mainframe_Link_Stable
                    </div>
                </footer>
            </main>

            {/* CRT SCANLINE OVERLAY */}
            <div className="fixed inset-0 pointer-events-none z-[100] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%)] bg-[length:100%_4px] opacity-10" />
        </div>
    );
}

function AdminButton({
    label,
    desc,
    onClick,
    icon,
    tag,
    highlight = false,
}: {
    label: string;
    desc: string;
    icon: React.ReactNode;
    tag: string;
    onClick: () => void;
    highlight?: boolean;
}) {
    return (
        <motion.button
            whileHover={{ y: -5, x: 2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`group relative p-8 rounded-xl text-left transition-all border-2 overflow-hidden
                ${highlight
                    ? "bg-zinc-900/50 border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.1)]"
                    : "bg-zinc-950 border-white/5 hover:border-red-600/50"
                }`}
        >
            {/* DESIGN ORNAMENTS */}
            <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-red-600/20 group-hover:border-red-600 transition-colors rounded-tr-xl" />
            <div className="absolute bottom-4 right-4 text-zinc-900 group-hover:text-red-600/10 transition-colors">
                {icon}
            </div>

            <div className={`mb-6 p-4 w-fit rounded-2xl border-2 transition-all
                ${highlight
                    ? "bg-red-600 border-red-400 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]"
                    : "bg-zinc-900 border-zinc-800 text-red-600 group-hover:bg-red-600 group-hover:text-white group-hover:border-red-400"
                }`}
            >
                {icon}
            </div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-1">
                    <p className="font-[1000] uppercase tracking-tighter text-2xl italic text-white">
                        {label}
                    </p>
                    <ChevronRight size={20} className="text-zinc-700 group-hover:text-red-600 transition-all group-hover:translate-x-1" />
                </div>

                <p className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-red-600 mb-4 opacity-70">
                    {tag}
                </p>

                <p className="text-xs leading-relaxed text-zinc-500 group-hover:text-zinc-300 font-medium max-w-[90%]">
                    {desc}
                </p>
            </div>

            {/* GLITCH STRIP */}
            <div className="absolute bottom-0 left-0 h-1 w-0 bg-red-600 group-hover:w-full transition-all duration-500" />
        </motion.button>
    );
}