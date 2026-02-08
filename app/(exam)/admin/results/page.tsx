"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaSpider, FaDownload, FaSearch, FaFilter,
    FaDatabase, FaUserShield, FaGraduationCap
} from "react-icons/fa";

export default function AdminResults() {
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterEvent, setFilterEvent] = useState("All");

    useEffect(() => {
        fetch("/api/admin/results")
            .then((res) => res.json())
            .then((res) => {
                if (res.success) setResults(res.data);
                setLoading(false);
            });
    }, []);

    const filteredResults = results.filter((r) => {
        const matchesSearch =
            r.participantName?.toLowerCase().includes(search.toLowerCase()) ||
            r.teamId?.toLowerCase().includes(search.toLowerCase()) ||
            r.college?.toLowerCase().includes(search.toLowerCase());
        const matchesEvent = filterEvent === "All" || r.eventName === filterEvent;
        return matchesSearch && matchesEvent;
    });

    const events = ["All", ...Array.from(new Set(results.map((r) => r.eventName)))];

    // 🟢 CSV EXPORT LOGIC
    const exportToCSV = () => {
        const headers = ["Agent Name,Team ID,Event,College,Department,Score,Timestamp\n"];
        const rows = filteredResults.map(r =>
            `${r.participantName},${r.teamId},${r.eventName},"${r.college}",${r.department},${r.score},${new Date(r.submittedAt).toLocaleString()}`
        ).join("\n");

        const blob = new Blob([headers + rows], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.setAttribute("hidden", "");
        a.setAttribute("href", url);
        a.setAttribute("download", `ARAZON_2K26_${filterEvent}_Results.csv`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    if (loading) return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center font-mono text-red-600">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                <FaSpider className="text-6xl shadow-[0_0_20px_red]" />
            </motion.div>
            <p className="mt-4 tracking-[0.5em] animate-pulse font-black uppercase text-xs">Accessing_Central_Node...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans p-4 md:p-8 relative overflow-hidden">
            {/* Background Decorative Element */}
            <FaSpider className="fixed -bottom-20 -left-20 text-zinc-900/40 text-[25rem] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <header className="mb-10 border-b-2 border-red-600 pb-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="bg-red-600 p-4 rounded-2xl shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                            <FaUserShield className="text-2xl text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black uppercase italic tracking-tighter">ARAZON <span className="text-red-600">2K26</span></h1>
                            <p className="text-zinc-500 font-mono text-[10px] tracking-widest uppercase">Master_Control // Result_Intelligence</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-[10px] text-zinc-500 uppercase font-bold">Total Logs Found</p>
                            <p className="text-xl font-mono font-black text-red-600">{results.length}</p>
                        </div>
                        <button
                            onClick={exportToCSV}
                            className="bg-white text-black hover:bg-red-600 hover:text-white px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest transition-all flex items-center gap-3 shadow-lg"
                        >
                            <FaDownload /> Export CSV
                        </button>
                    </div>
                </header>

                {/* Filters Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="relative col-span-2">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
                        <input
                            type="text"
                            placeholder="SEARCH AGENT OR TEAM_ID..."
                            className="w-full bg-zinc-900/50 border-2 border-zinc-800 p-4 pl-12 rounded-2xl text-red-500 outline-none focus:border-red-600 transition-all font-mono text-sm"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
                        <select
                            className="w-full bg-zinc-900/50 border-2 border-zinc-800 p-4 pl-12 rounded-2xl text-white outline-none focus:border-red-600 appearance-none font-bold text-sm"
                            onChange={(e) => setFilterEvent(e.target.value)}
                        >
                            {events.map(ev => <option key={ev} value={ev} className="bg-zinc-900">{ev}</option>)}
                        </select>
                    </div>
                </div>

                {/* Main Table HUD */}
                <div className="bg-zinc-900/30 border-2 border-zinc-800 rounded-[2.5rem] overflow-hidden backdrop-blur-md shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-zinc-950/50 text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-black border-b border-zinc-800">
                                    <th className="p-6">Node Agent</th>
                                    <th className="p-6">Event Context</th>
                                    <th className="p-6">Institution</th>
                                    <th className="p-6 text-center">Neural Score</th>
                                    <th className="p-6">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                <AnimatePresence>
                                    {filteredResults.map((row, i) => (
                                        <motion.tr
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.03 }}
                                            key={row._id || i}
                                            className="border-b border-zinc-900/50 hover:bg-red-600/5 transition-colors group"
                                        >
                                            <td className="p-6">
                                                <div className="flex flex-col">
                                                    <span className="text-white font-black uppercase italic group-hover:text-red-500 transition-colors">{row.participantName}</span>
                                                    <span className="text-[10px] font-mono text-zinc-600">{row.teamId}</span>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <span className="bg-blue-600/10 text-blue-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter border border-blue-600/20">
                                                    {row.eventName}
                                                </span>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex items-start gap-2">
                                                    <FaGraduationCap className="text-zinc-700 mt-1" />
                                                    <div>
                                                        <div className="text-xs text-zinc-300 font-bold uppercase">{row.college}</div>
                                                        <div className="text-[9px] text-zinc-600 font-mono">{row.department}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6 text-center">
                                                <div className="inline-block relative">
                                                    <span className="text-xl font-black text-white font-mono">{row.score}</span>
                                                    <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-red-600 shadow-[0_0_10px_red]"></div>
                                                </div>
                                            </td>
                                            <td className="p-6 font-mono text-[10px] text-zinc-500">
                                                {new Date(row.submittedAt).toLocaleDateString()} <br />
                                                <span className="text-zinc-700">{new Date(row.submittedAt).toLocaleTimeString()}</span>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                    {filteredResults.length === 0 && (
                        <div className="p-20 text-center">
                            <FaDatabase className="mx-auto text-4xl text-zinc-800 mb-4" />
                            <p className="text-zinc-600 font-mono text-xs uppercase tracking-widest">No data matching current search parameters.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}