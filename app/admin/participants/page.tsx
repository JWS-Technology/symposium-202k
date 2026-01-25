"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Users,
    ShieldCheck,
    Search,
    FileDown,
    Globe,
    ArrowLeft,
    Database,
    Zap
} from "lucide-react";

interface Participant {
    _id: string;
    teamId: string;
    name: string;
    dno: string;
    email: string;
    event: string;
    eventType: string;
    createdAt: string;
}

export default function AdminParticipantsPage() {
    const router = useRouter();
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            router.push("/admin/login");
            return;
        }

        fetch("/api/admin/participants", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => setParticipants(data.participants || []))
            .catch(err => console.error("Critical System Error:", err))
            .finally(() => setLoading(false));
    }, [router]);

    const filteredParticipants = participants.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.teamId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.event.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center font-mono">
                <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-red-600 tracking-[0.5em] animate-pulse">DECRYPTING_GLOBAL_DATABASE...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020202] text-zinc-300 font-sans selection:bg-red-600 relative overflow-hidden">

            {/* BACKGROUND OVERLAYS */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(185,28,28,0.1),transparent)] pointer-events-none" />
            <div className="fixed inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">

                {/* ADMIN HEADER */}
                <header className="mb-12">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <div className="flex items-center gap-3 mb-2 font-mono text-[10px] text-red-600 tracking-[0.5em] uppercase">
                                <ShieldCheck size={14} className="animate-pulse" /> Global_Admin_Access
                            </div>
                            <h1 className="text-6xl font-[1000] italic text-white uppercase tracking-tighter">
                                Registry_<span className="text-red-600">Omni</span>
                            </h1>
                        </motion.div>

                        <div className="flex gap-4 items-center">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-red-600/20 blur opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative bg-zinc-900 border border-zinc-800 flex items-center px-4 py-2 gap-3 focus-within:border-red-600 transition-colors">
                                    <Search size={16} className="text-zinc-500" />
                                    <input
                                        type="text"
                                        placeholder="SEARCH_AGENT_OR_TEAM..."
                                        className="bg-transparent border-none outline-none text-[11px] font-mono tracking-widest text-white w-48 lg:w-64"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <button className="p-3 bg-red-600 text-white hover:bg-red-700 transition-all skew-x-[-12deg]">
                                <FileDown size={20} className="skew-x-[12deg]" />
                            </button>
                        </div>
                    </div>

                    {/* STATS STRIP */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
                        <StatCard label="Total_Nodes" value={participants.length} icon={<Users />} color="text-white" />
                        <StatCard label="Live_Sectors" value={[...new Set(participants.map(p => p.event))].length} icon={<Globe />} color="text-red-600" />
                        <StatCard label="Team_Units" value={[...new Set(participants.map(p => p.teamId))].length} icon={<Database />} color="text-white" />
                        <StatCard label="System_Load" value="Optimal" icon={<Zap />} color="text-green-500" />
                    </div>
                </header>

                {/* MAIN DATA TABLE */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#050505] border border-zinc-800 rounded-lg overflow-hidden relative"
                >
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-600 to-transparent" />

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-black bg-zinc-900/50">
                                <tr>
                                    <th className="p-5 border-b border-zinc-800">Agent_Info</th>
                                    <th className="p-5 border-b border-zinc-800">Deployment_Sector</th>
                                    <th className="p-5 border-b border-zinc-800">Origin_Team</th>
                                    <th className="p-5 border-b border-zinc-800 text-right">Access_Code</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-900">
                                {filteredParticipants.map((p, i) => (
                                    <motion.tr
                                        key={p._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.02 }}
                                        className="group hover:bg-red-600/[0.03] transition-colors"
                                    >
                                        <td className="p-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center font-mono text-[10px] text-zinc-500 group-hover:border-red-600/50 group-hover:text-red-600 transition-all">
                                                    {i + 1}
                                                </div>
                                                <div>
                                                    <div className="font-black text-white uppercase italic tracking-tight">{p.name}</div>
                                                    <div className="text-[10px] font-mono text-zinc-500 group-hover:text-zinc-400">{p.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-mono text-red-600 uppercase font-black">{p.eventType}</span>
                                                <span className="text-zinc-300 font-bold uppercase tracking-tighter">{p.event}</span>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 bg-red-600 rotate-45" />
                                                <span className="font-mono text-xs text-white bg-zinc-900 px-2 py-0.5 border border-zinc-800">
                                                    {p.teamId}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-5 text-right font-mono text-xs text-zinc-600 group-hover:text-zinc-400">
                                            {p.dno}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredParticipants.length === 0 && (
                            <div className="py-20 text-center font-mono text-zinc-600 uppercase tracking-widest text-xs italic">
                                [!] No entries found in current scan
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* CRT SCANLINE OVERLAY */}
            <div className="fixed inset-0 pointer-events-none z-[100] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%)] bg-[length:100%_4px] opacity-20" />
        </div>
    );
}

function StatCard({ label, value, icon, color }: { label: string, value: string | number, icon: any, color: string }) {
    return (
        <div className="bg-[#050505] border border-zinc-900 p-5 rounded-sm relative overflow-hidden group">
            <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity ${color}`}>
                {icon}
            </div>
            <p className="text-zinc-600 font-mono text-[9px] uppercase tracking-[0.2em] mb-1">{label}</p>
            <p className={`text-2xl font-black italic uppercase ${color}`}>{value}</p>
            <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-red-600 group-hover:w-full transition-all duration-500" />
        </div>
    );
}