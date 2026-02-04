"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Loader2, Users, ShieldCheck, Mail, School, Hash,
    Phone, Download, ArrowRight, Search, Database
} from "lucide-react";

interface User {
    _id: string;
    teamId: string;
    name: string;
    email: string;
    phone: string;
    college: string;
    department: string;
}

export default function UserRegistry() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch("/api/admin/fetch-users");
                const json = await res.json();
                if (json.success) setUsers(json.data);
            } catch (err) {
                console.error("Uplink Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    // Filter Logic
    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.teamId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Tactical Export Function
    const exportToCSV = () => {
        const headers = ["TeamID,Name,Email,Phone,College,Department\n"];
        const rows = users.map(u => `${u.teamId},${u.name},${u.email},${u.phone},${u.college},${u.department}\n`);
        const blob = new Blob([headers + rows.join("")], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `ARAZON_REGISTRY_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center">
                <div className="relative">
                    <Loader2 className="w-16 h-16 text-red-600 animate-spin" />
                    <div className="absolute inset-0 blur-xl bg-red-600/20 animate-pulse" />
                </div>
                <p className="text-red-500 font-mono text-[10px] tracking-[0.6em] uppercase mt-6 animate-pulse">
                    Synchronizing_Database_Nodes...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020202] text-white p-4 md:p-12 font-sans selection:bg-red-600">
            <div className="max-w-[1400px] mx-auto">

                {/* HEADER SECTION */}
                <header className="mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-white/10 pb-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Database className="text-red-600 w-5 h-5" />
                            <span className="text-red-500 font-mono text-[10px] tracking-[0.5em] uppercase font-black">Admin_Access_Level_01</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-[1000] italic tracking-tighter uppercase leading-none">
                            ENTITY <span className="text-red-600">REGISTRY_</span>
                        </h1>
                        <p className="text-zinc-500 font-mono text-xs tracking-widest uppercase">
                            Total_Units_Detected: <span className="text-white font-bold">{users.length}</span>
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        {/* Search Bar */}
                        <div className="relative w-full sm:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                            <input
                                type="text"
                                placeholder="SEARCH_BY_ID_OR_NAME..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-[10px] font-bold text-white uppercase tracking-widest focus:border-red-600 transition-all outline-none"
                            />
                        </div>
                        {/* Export Button */}
                        <button
                            onClick={exportToCSV}
                            className="w-full sm:w-auto px-8 py-4 bg-white text-black font-black uppercase text-[10px] tracking-[0.2em] hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                        >
                            <Download size={16} strokeWidth={3} /> Export_CSV
                        </button>
                    </div>
                </header>

                {/* TABLE VIEW (SCROLLABLE ON MOBILE) */}
                <div className="overflow-x-auto rounded-3xl border border-white/5 bg-zinc-950/50 backdrop-blur-3xl shadow-2xl">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="bg-zinc-900/80 border-b border-white/10 text-[11px] font-[1000] uppercase tracking-[0.3em] text-zinc-500">
                                <th className="px-8 py-6 flex items-center gap-2"><Hash size={14} className="text-red-600" /> ID</th>
                                <th className="px-8 py-6">Team_Name</th>
                                <th className="px-8 py-6">College</th>
                                <th className="px-8 py-6">Department</th>
                                <th className="px-8 py-6 text-red-600"><Mail size={14} className="inline mr-2" /> Email</th>
                                <th className="px-8 py-6 text-red-600"><Phone size={14} className="inline mr-2" />Phone</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-mono">
                            {filteredUsers.map((user: any) => (
                                <motion.tr
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    key={user._id}
                                    className="hover:bg-white/[0.03] transition-all group"
                                >
                                    <td className="px-8 py-6 text-red-500 text-xs font-black">#{user.teamId}</td>
                                    <td className="px-8 py-6">
                                        <div className="font-[1000] text-white italic text-lg uppercase tracking-tighter group-hover:text-red-500 transition-colors">
                                            {user.name}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-zinc-400 text-[11px] font-bold uppercase tracking-tight max-w-[200px] truncate">
                                        {user.college}
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="bg-zinc-900 text-white px-3 py-1.5 rounded-lg text-[10px] font-black border border-white/10 group-hover:border-red-600/50 transition-colors">
                                            {user.department}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-zinc-300 text-xs font-bold lowercase tracking-normal">
                                        {user.email}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-white text-xs font-black tracking-widest">{user.phone}</div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* NO RESULTS HUD */}
                {filteredUsers.length === 0 && (
                    <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl mt-4">
                        <Users className="mx-auto text-zinc-800 mb-4" size={48} />
                        <p className="text-zinc-600 font-mono text-xs uppercase tracking-[0.5em]">No_Entities_Detected_In_Sector</p>
                    </div>
                )}

            </div>

            {/* AMBIENCE DECOR */}
            <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-20" />
        </div>
    );
}