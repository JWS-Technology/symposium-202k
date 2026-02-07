"use client";
import { useEffect, useState } from "react";

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
        const matchesSearch = r.participantName?.toLowerCase().includes(search.toLowerCase()) ||
            r.teamId?.toLowerCase().includes(search.toLowerCase());
        const matchesEvent = filterEvent === "All" || r.eventName === filterEvent;
        return matchesSearch && matchesEvent;
    });

    const events = ["All", ...new Set(results.map((r) => r.eventName))];

    if (loading) return <div className="p-8 text-green-500 font-mono bg-black min-h-screen text-center">ACCESSING DATABASE...</div>;

    return (
        <div className="min-h-screen bg-black text-white font-mono p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8 border-b border-green-900 pb-4 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-green-500 tracking-tighter">ARAZON 2k26 // MASTER_CONTROL</h1>
                        <p className="text-zinc-500 text-xs">GLOBAL_PARTICIPANT_LEADERBOARD</p>
                    </div>
                    <div className="text-right text-xs text-zinc-600">
                        TOTAL_ENTRIES: {results.length}
                    </div>
                </header>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="SEARCH BY NAME OR TEAM_ID..."
                        className="bg-zinc-900 border border-zinc-800 p-2 text-green-400 flex-1 outline-none focus:border-green-500"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select
                        className="bg-zinc-900 border border-zinc-800 p-2 text-green-400 outline-none"
                        onChange={(e) => setFilterEvent(e.target.value)}
                    >
                        {events.map(ev => <option key={ev} value={ev}>{ev}</option>)}
                    </select>
                </div>

                {/* Table */}
                <div className="overflow-x-auto border border-zinc-800">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-900 text-green-500 text-xs uppercase tracking-widest border-b border-zinc-800">
                                <th className="p-4">Agent Name</th>
                                <th className="p-4">Team</th>
                                <th className="p-4">Event</th>
                                <th className="p-4">College / Dept</th>
                                <th className="p-4 text-center">Score</th>
                                <th className="p-4">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {filteredResults.map((row, i) => (
                                <tr key={i} className="border-b border-zinc-900 hover:bg-zinc-950 transition-colors">
                                    <td className="p-4 text-white font-medium">{row.participantName}</td>
                                    <td className="p-4 text-zinc-400">{row.teamId}</td>
                                    <td className="p-4 text-blue-400 text-xs font-bold">{row.eventName}</td>
                                    <td className="p-4">
                                        <div className="text-xs text-white">{row.college}</div>
                                        <div className="text-[10px] text-zinc-600 uppercase">{row.department}</div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className="bg-green-900/30 text-green-400 px-3 py-1 rounded-full border border-green-900 font-bold">
                                            {row.score}
                                        </span>
                                    </td>
                                    <td className="p-4 text-zinc-500 text-[10px]">
                                        {new Date(row.submittedAt).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredResults.length === 0 && (
                        <div className="p-10 text-center text-zinc-700 italic">No matching records found in central node.</div>
                    )}
                </div>
            </div>
        </div>
    );
}