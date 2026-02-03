"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    FaDownload, FaSearch, FaDatabase, FaUsers,
    FaTrophy, FaCalendarAlt, FaFileCsv, FaShieldAlt
} from "react-icons/fa";

type AdminResultRow = {
    participantId: string;
    teamId: string;
    name: string;
    participantEmail: string;
    college: string;
    department: string;
    score: number;
    submittedAt: string;
};

export default function AdminResultsPage() {
    const [data, setData] = useState<AdminResultRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetch("/api/admin/results")
            .then((res) => {
                if (!res.ok) throw new Error();
                return res.json();
            })
            .then((res) => {
                setData(res.results || []);
                setLoading(false);
            })
            .catch(() => {
                setError("INTELLIGENCE_LINK_FAILURE: Could not retrieve secure data.");
                setLoading(false);
            });
    }, []);

    // --- EXPORT TO CSV FUNCTION ---
    const exportToCSV = () => {
        const headers = ["Rank,Team ID,Name,College,Department,Email,Score,Submitted At\n"];
        const rows = data.map((row, i) =>
            `${i + 1},${row.teamId},${row.name},${row.college},${row.department},${row.participantEmail},${row.score},${new Date(row.submittedAt).toLocaleString()}`
        ).join("\n");

        const blob = new Blob([headers + rows], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.setAttribute("hidden", "");
        a.setAttribute("href", url);
        a.setAttribute("download", `Arazon_Prelims_Results_${new Date().toLocaleDateString()}.csv`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const filteredData = data.filter(row =>
        row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.teamId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.college.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center font-mono">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-10 h-10 border-2 border-red-600 border-t-transparent rounded-full mb-4" />
            <p className="text-red-600 tracking-widest text-xs animate-pulse uppercase">Accessing_Central_Database...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020202] text-zinc-300 font-sans p-4 md:p-8">

            {/* HUD HEADER */}
            <div className="max-w-7xl mx-auto mb-8">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-zinc-950 border border-zinc-800 p-6 rounded-2xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-5">
                        <FaShieldAlt size={80} className="text-red-600" />
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-red-600/10 border border-red-600/20 rounded-xl">
                            <FaDatabase className="text-red-600 text-2xl" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black uppercase italic tracking-tighter text-white leading-none">Intelligence_Hub</h1>
                            <p className="text-[10px] text-zinc-500 font-mono mt-1 tracking-widest uppercase">Node: Admin_Superuser // ARAZON_2026</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-lg flex items-center gap-3">
                            <FaUsers className="text-red-600" />
                            <span className="text-sm font-bold text-white">{data.length} Participants</span>
                        </div>
                        <button
                            onClick={exportToCSV}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(220,38,38,0.3)]"
                        >
                            <FaFileCsv /> Export_CSV
                        </button>
                    </div>
                </header>
            </div>

            {/* SEARCH & FILTER AREA */}
            <div className="max-w-7xl mx-auto mb-6">
                <div className="relative">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
                    <input
                        type="text"
                        placeholder="Search by Name, Team ID, or College..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-4 pl-12 pr-4 focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all outline-none font-mono text-xs uppercase tracking-widest"
                    />
                </div>
            </div>

            {/* MAIN RESULTS TABLE */}
            <div className="max-w-7xl mx-auto">
                <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="bg-zinc-900/50 border-b border-zinc-800">
                                    <th className="p-4 font-mono text-[10px] uppercase text-zinc-500 tracking-widest">Rank</th>
                                    <th className="p-4 font-mono text-[10px] uppercase text-zinc-500 tracking-widest">Team Identity</th>
                                    <th className="p-4 font-mono text-[10px] uppercase text-zinc-500 tracking-widest">Institution</th>
                                    <th className="p-4 font-mono text-[10px] uppercase text-zinc-500 tracking-widest text-center">Final Score</th>
                                    <th className="p-4 font-mono text-[10px] uppercase text-zinc-500 tracking-widest">Submission Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-900">
                                {filteredData.length > 0 ? filteredData.map((row, i) => (
                                    <motion.tr
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        key={row.participantId}
                                        className="hover:bg-red-600/5 transition-colors group"
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <span className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-black border ${i < 3 ? 'bg-red-600 border-red-500 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}>
                                                    {i + 1}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="text-white font-bold tracking-tight">{row.name}</span>
                                                <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-tighter">{row.teamId} // {row.participantEmail}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm text-zinc-300">{row.college}</span>
                                                <span className="text-[10px] text-zinc-500 uppercase">{row.department}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full group-hover:border-red-600/50 transition-all">
                                                <FaTrophy className={i === 0 ? "text-yellow-500" : "text-zinc-600"} />
                                                <span className="text-white font-black font-mono">{row.score}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-zinc-500 font-mono text-[10px]">
                                                <FaCalendarAlt size={10} />
                                                {new Date(row.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                            </div>
                                        </td>
                                    </motion.tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="p-20 text-center">
                                            <div className="flex flex-col items-center gap-4 opacity-20">
                                                <FaDatabase size={40} />
                                                <p className="font-mono text-xs uppercase tracking-[0.5em]">No_Data_Detected</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* SYSTEM FOOTER */}
            <div className="max-w-7xl mx-auto mt-6 flex justify-between items-center text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                <p>Data_Refresh: Auto (1m)</p>
                <p>Secure_Protocol: ARAZON_TLS_1.3</p>
            </div>
        </div>
    );
}