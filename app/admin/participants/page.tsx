"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users,
    ShieldCheck,
    Search,
    FileDown,
    Globe,
    Database,
    Zap,
    Fingerprint,
    CheckCircle2,
    Clock
} from "lucide-react";

/* ================= TYPES ================= */
interface Participant {
    _id: string;
    teamId: string;
    name: string;
    dno: string;
    email: string;
    events: { eventName: string; eventType: string }[];
    paymentStatus: string;
    paymentAmount: number;
    createdAt: string;
}

export default function AdminParticipantsPage() {
    const router = useRouter();
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    /* ================= DATA FETCHING ================= */
    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            router.push("/admin/login");
            return;
        }

        const fetchRegistry = async () => {
            try {
                const res = await fetch("/api/participants", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                setParticipants(data.participants || []);
            } catch (err) {
                console.error("WEB_ERROR:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRegistry();
    }, [router]);

    /* ================= FILTER LOGIC ================= */
    const filteredParticipants = useMemo(() => {
        return participants.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.teamId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.events.some(e => e.eventName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            p.dno.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [participants, searchTerm]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center font-mono">
                <div className="relative">
                    <div className="w-20 h-20 border-2 border-red-600/20 rounded-full animate-ping absolute" />
                    <div className="w-20 h-20 border-t-2 border-red-600 rounded-full animate-spin" />
                </div>
                <p className="mt-8 text-red-600 tracking-[0.8em] font-black text-[10px] animate-pulse">
                    SYNCHRONIZING_WEB_NODES...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020202] text-zinc-400 font-sans selection:bg-red-600/50 relative overflow-hidden">

            {/* SPIDER WEB THEME OVERLAYS */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(220,38,38,0.15),transparent_70%)] pointer-events-none" />
            <div className="fixed inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />

            {/* SCANLINES */}
            <div className="fixed inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px]" />

            <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">

                {/* HEADER SECTION */}
                <header className="mb-16">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
                            <div className="flex items-center gap-3 mb-4 text-red-600 font-mono text-[10px] tracking-[0.5em] uppercase">
                                <Fingerprint size={16} className="animate-pulse" />
                                Authority_Level: Overlord
                            </div>
                            <h1 className="text-7xl font-black italic text-white uppercase tracking-tighter leading-none">
                                WEB_<span className="text-red-600">REGISTRY</span>
                            </h1>
                            <p className="text-zinc-600 font-mono text-[10px] mt-2 tracking-widest">v4.0.2 - CENTRAL_COMMAND_INTERFACE</p>
                        </motion.div>

                        <div className="flex flex-wrap gap-4">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-red-600/10 blur group-hover:bg-red-600/20 transition-all" />
                                <div className="relative bg-zinc-950 border border-white/5 flex items-center px-4 py-3 gap-3 focus-within:border-red-600/50 transition-all">
                                    <Search size={18} className="text-red-600" />
                                    <input
                                        type="text"
                                        placeholder="TRACE_NODE (NAME/TEAM/DNO)..."
                                        className="bg-transparent border-none outline-none text-[11px] font-mono tracking-widest text-white w-64 lg:w-80"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <button className="px-6 py-3 bg-red-600 text-white hover:bg-red-700 transition-all skew-x-[-12deg] font-black uppercase text-[10px] tracking-widest flex items-center gap-2">
                                <span className="skew-x-[12deg] flex items-center gap-2"><FileDown size={16} /> EXPORT_DB</span>
                            </button>
                        </div>
                    </div>

                    {/* STATS OVERVIEW */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
                        <StatCard label="Live_Participants" value={participants.length} icon={<Users />} active />
                        <StatCard label="Deployment_Sectors" value={[...new Set(participants.flatMap(p => p.events.map(e => e.eventName)))].length} icon={<Globe />} />
                        <StatCard label="Identified_Teams" value={[...new Set(participants.map(p => p.teamId))].length} icon={<Database />} />
                        <StatCard label="Network_Status" value="SECURE" icon={<Zap />} statusColor="text-green-500" />
                    </div>
                </header>

                {/* REGISTRY TABLE */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#050505]/80 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-black bg-white/[0.02]">
                                <tr>
                                    <th className="p-6 border-b border-white/5">Participant_Node</th>
                                    <th className="p-6 border-b border-white/5">Assigned_Sectors</th>
                                    <th className="p-6 border-b border-white/5">Team_Affiliation</th>
                                    <th className="p-6 border-b border-white/5 text-right">Verification_Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.02]">
                                <AnimatePresence>
                                    {filteredParticipants.map((p, i) => (
                                        <motion.tr
                                            key={p._id}
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="group hover:bg-red-600/[0.04] transition-colors"
                                        >
                                            {/* NAME & EMAIL */}
                                            <td className="p-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded bg-red-600/5 border border-red-600/10 flex items-center justify-center font-mono text-[10px] text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all">
                                                        {String(i + 1).padStart(2, '0')}
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-white uppercase tracking-tighter text-base group-hover:text-red-500 transition-colors">
                                                            {p.name}
                                                        </div>
                                                        <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">{p.email}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* EVENTS ARRAY MAPPING */}
                                            <td className="p-6">
                                                <div className="flex flex-wrap gap-2">
                                                    {p.events.map((ev, idx) => (
                                                        <div key={idx} className="bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-md flex flex-col">
                                                            <span className="text-[7px] text-red-600 font-black uppercase tracking-widest leading-none">{ev.eventType}</span>
                                                            <span className="text-zinc-200 font-bold uppercase text-[10px] mt-1">{ev.eventName}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>

                                            {/* TEAM & DNO */}
                                            <td className="p-6">
                                                <div className="flex flex-col gap-1">
                                                    <div className="text-[10px] font-mono text-zinc-500 uppercase">Unit_ID: <span className="text-white">{p.teamId}</span></div>
                                                    <div className="text-[10px] font-mono text-zinc-500 uppercase">Access_Code: <span className="text-white">{p.dno}</span></div>
                                                </div>
                                            </td>

                                            {/* STATUS */}
                                            <td className="p-6 text-right">
                                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[9px] font-black uppercase tracking-[0.2em] ${p.paymentStatus === "PAID"
                                                    ? "bg-green-500/5 border-green-500/20 text-green-500"
                                                    : "bg-amber-500/5 border-amber-500/20 text-amber-500 animate-pulse"
                                                    }`}>
                                                    {p.paymentStatus === "PAID" ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                                                    {p.paymentStatus}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

/* ================= HELPER COMPONENTS ================= */

function StatCard({ label, value, icon, active, statusColor }: { label: string, value: string | number, icon: any, active?: boolean, statusColor?: string }) {
    return (
        <div className="bg-[#050505] border border-white/5 p-6 rounded-xl relative group overflow-hidden">
            <div className={`absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-opacity ${active ? "text-red-600" : "text-white"}`}>
                {icon}
            </div>
            <p className="text-zinc-600 font-mono text-[9px] uppercase tracking-[0.3em] mb-2">{label}</p>
            <p className={`text-3xl font-black italic tracking-tighter ${statusColor || "text-white"}`}>
                {value}
            </p>
            <div className={`absolute bottom-0 left-0 h-[2px] transition-all duration-700 ${active ? "bg-red-600 w-full" : "bg-zinc-800 w-0 group-hover:w-full"}`} />
        </div>
    );
}