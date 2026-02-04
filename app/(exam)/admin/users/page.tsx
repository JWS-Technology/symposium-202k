"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Loader2, Users, Mail, Phone, Download, Search,
    Database, Trash2, X, Check, AlertTriangle, Cpu, Hash
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
    const [terminatingId, setTerminatingId] = useState<string | null>(null);

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

    const terminateEntity = async (userId: string) => {
        try {
            const res = await fetch("/api/admin/delete-users", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });
            const data = await res.json();
            if (data.success) {
                setUsers(users.filter((u) => u._id !== userId));
                setTerminatingId(null);
            }
        } catch (err) {
            console.error("TERMINATION_CRITICAL_FAILURE");
        }
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.teamId.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                <Loader2 className="w-16 h-16 text-red-600 animate-spin" />
                <p className="text-red-500 font-mono text-[10px] tracking-[0.6em] uppercase mt-6 animate-pulse">Synchronizing_Nodes...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020202] text-white p-6 md:p-12 font-sans selection:bg-red-600">
            <div className="max-w-7xl mx-auto">

                {/* HEADER SECTION - Synchronized with Import Page */}
                <header className="mb-12 border-l-4 border-red-600 pl-6">
                    <div className="flex items-center gap-3 text-red-600 font-mono text-[10px] tracking-[0.5em] uppercase font-black mb-2">
                        <Cpu size={16} /> Admin_Intelligence_Access
                    </div>
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                        <h1 className="text-5xl md:text-7xl font-[1000] italic uppercase tracking-tighter leading-none">
                            ENTITY_<span className="text-red-600">REGISTRY</span>
                        </h1>
                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                            <div className="relative w-full sm:w-80">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                                <input
                                    type="text"
                                    placeholder="FILTER_ENTITIES..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-zinc-900/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-[10px] font-black text-white uppercase tracking-widest focus:border-red-600 transition-all outline-none"
                                />
                            </div>
                            <button
                                onClick={exportToCSV}
                                className="w-full sm:w-auto px-8 py-4 bg-red-600 text-white font-[1000] uppercase text-xs tracking-[0.3em] rounded-xl hover:bg-white hover:text-black transition-all shadow-[0_0_25px_rgba(220,38,38,0.2)] flex items-center justify-center gap-3"
                            >
                                <Download size={16} /> EXPORT_LOG
                            </button>
                        </div>
                    </div>
                </header>

                {/* REGISTRY HUD PANEL */}
                <div className="bg-zinc-900/20 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-3xl shadow-2xl flex flex-col h-[700px]">
                    <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-zinc-900/40">
                        <div className="flex items-center gap-3">
                            <Users className="text-red-600" size={18} />
                            <span className="font-black uppercase tracking-[0.2em] text-[10px] text-zinc-400">Database_Payload</span>
                        </div>
                        <span className="text-zinc-500 font-mono text-[9px] bg-black px-3 py-1 rounded-full border border-white/10 uppercase font-bold">
                            {filteredUsers.length} Units_Detected
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[1000px]">
                            <thead className="sticky top-0 z-10 bg-zinc-900/80 backdrop-blur-md">
                                <tr className="border-b border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                                    <th className="px-8 py-5">Unit_ID</th>
                                    <th className="px-8 py-5">Identity_Alias</th>
                                    <th className="px-8 py-5">Origin_Sector</th>
                                    <th className="px-8 py-5">Contact_Uplink</th>
                                    <th className="px-8 py-5 text-right">Protocol</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-mono text-xs">
                                {filteredUsers.map((user, i) => (
                                    <motion.tr
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.02 }}
                                        key={user._id}
                                        className="hover:bg-white/[0.03] transition-all group"
                                    >
                                        <td className="px-8 py-6 text-red-600 font-black tracking-widest text-[11px]">#{user.teamId}</td>
                                        <td className="px-8 py-6">
                                            <div className="font-[1000] text-white italic text-lg uppercase group-hover:text-red-500 transition-colors tracking-tighter">
                                                {user.name}
                                            </div>
                                            <div className="text-[9px] text-zinc-600 uppercase font-black tracking-widest">{user.department}</div>
                                        </td>
                                        <td className="px-8 py-6 text-zinc-500 uppercase font-bold text-[10px] leading-tight max-w-[200px] truncate">
                                            {user.college}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-zinc-300 font-bold mb-1 flex items-center gap-2 group-hover:text-white">
                                                <Mail size={10} className="text-red-600" /> {user.email}
                                            </div>
                                            <div className="text-zinc-600 text-[10px] flex items-center gap-2 tracking-widest font-black">
                                                <Phone size={10} /> {user.phone}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <AnimatePresence mode="wait">
                                                {terminatingId === user._id ? (
                                                    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex justify-end items-center gap-2">
                                                        <button
                                                            onClick={() => terminateEntity(user._id)}
                                                            className="p-2 bg-red-600 text-white rounded-lg hover:bg-white hover:text-red-600 transition-all shadow-[0_0_15px_rgba(220,38,38,0.4)]"
                                                        >
                                                            <Check size={14} strokeWidth={3} />
                                                        </button>
                                                        <button
                                                            onClick={() => setTerminatingId(null)}
                                                            className="p-2 bg-zinc-800 text-zinc-400 rounded-lg hover:text-white transition-all"
                                                        >
                                                            <X size={14} strokeWidth={3} />
                                                        </button>
                                                    </motion.div>
                                                ) : (
                                                    <button
                                                        onClick={() => setTerminatingId(user._id)}
                                                        className="opacity-0 group-hover:opacity-100 p-3 text-zinc-600 hover:text-red-600 hover:bg-red-600/10 rounded-xl transition-all"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                            </AnimatePresence>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredUsers.length === 0 && (
                            <div className="py-32 text-center">
                                <AlertTriangle className="mx-auto text-zinc-800 mb-4" size={40} />
                                <p className="text-zinc-600 font-mono text-[10px] uppercase tracking-[0.5em]">No_Entities_Detected_In_Buffer</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* AMBIENT CRT SCANLINE OVERLAY */}
            <div className="fixed inset-0 pointer-events-none z-[100] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%)] bg-[length:100%_4px] opacity-[0.05]" />
        </div>
    );
}