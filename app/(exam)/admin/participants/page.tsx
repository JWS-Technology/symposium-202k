"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users, ShieldCheck, Search, FileDown, Globe, Database,
    Zap, Fingerprint, CheckCircle2, Clock, ChevronDown,
    FileText, Table as TableIcon, Download, Loader2, Trash2, Check, X, Filter
} from "lucide-react";

// Export Libraries
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

/* ================= TYPES ================= */
interface EventDetail {
    eventName: string;
    eventType: "TECHNICAL" | "NON-TECHNICAL" | "CULTURALS";
}

interface Participant {
    _id: string;
    teamId: string;
    name: string;
    dno: string;
    email: string;
    events: EventDetail[];
    paymentStatus: "PENDING" | "PAID";
    paymentAmount: number;
    paymentVerifiedByAdmin: boolean;
    createdAt: string;
    userDetails?: {
        department: string;
        college: string;
        phone: string;
    };
}

export default function AdminParticipantsPage() {
    const router = useRouter();
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [eventFilter, setEventFilter] = useState("ALL_EVENTS"); // Filter State
    const [isExporting, setIsExporting] = useState(false);
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [terminatingId, setTerminatingId] = useState<string | null>(null);

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

    /* ================= DYNAMIC EVENT LIST ================= */
    const uniqueEvents = useMemo(() => {
        const events = new Set<string>();
        participants.forEach(p => p.events.forEach(e => events.add(e.eventName)));
        return Array.from(events).sort();
    }, [participants]);

    /* ================= FILTER & SORT LOGIC ================= */
    const filteredParticipants = useMemo(() => {
        return participants
            .filter(p => {
                const matchesSearch =
                    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    p.teamId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    p.dno.toLowerCase().includes(searchTerm.toLowerCase());

                const matchesEvent = eventFilter === "ALL_EVENTS" ||
                    p.events.some(e => e.eventName === eventFilter);

                return matchesSearch && matchesEvent;
            })
            .sort((a, b) =>
                a.teamId.localeCompare(b.teamId, undefined, { numeric: true, sensitivity: 'base' })
            );
    }, [participants, searchTerm, eventFilter]);

    const terminateParticipant = async (participantId: string) => {
        const token = localStorage.getItem("adminToken");
        try {
            const res = await fetch("/api/admin/delete-participants", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ participantId }),
            });

            if (!res.ok) throw new Error("UPLINK_REJECTED");

            setParticipants(prev => prev.filter(p => p._id !== participantId));
            setTerminatingId(null);
        } catch (err) {
            console.error("CRITICAL_DELETE_FAILURE:", err);
        }
    };

    /* ================= UPDATED EXPORT METHODS ================= */
    const exportToExcel = () => {
        setIsExporting(true);
        const worksheetData = filteredParticipants.map((p, i) => ({
            "S.No": i + 1,
            "Team ID": p.teamId,
            "Name": p.name,
            "Email": p.email,
            "DNO": p.dno,
            "Filtered_Event": eventFilter,
            "All_Registered_Events": p.events.map(e => e.eventName).join(", "),
            "Status": p.paymentStatus,
            "Amount": p.paymentAmount,
            "Date": new Date(p.createdAt).toLocaleDateString()
        }));

        const ws = XLSX.utils.json_to_sheet(worksheetData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Registry");

        const fileName = `SpiderNet_${eventFilter.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}`;
        XLSX.writeFile(wb, `${fileName}.xlsx`);

        setIsExporting(false);
        setShowExportMenu(false);
    };

    const exportToPDF = () => {
        setIsExporting(true);
        const doc = new jsPDF({ orientation: 'landscape' });

        doc.setFillColor(10, 10, 10);
        doc.rect(0, 0, 297, 35, 'F');
        doc.setTextColor(220, 38, 38);
        doc.setFontSize(22);
        doc.text(`REGISTRY: ${eventFilter.toUpperCase()}`, 14, 22);

        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text(`COUNT: ${filteredParticipants.length} | TS: ${new Date().toLocaleString()}`, 14, 30);

        const tableRows = filteredParticipants.map((p, i) => [
            i + 1,
            p.name.toUpperCase(),
            p.teamId,
            p.dno,
            p.events.map(e => e.eventName).join(", "),
            p.paymentStatus,
            `INR ${p.paymentAmount}`
        ]);

        autoTable(doc, {
            head: [["S.No", "Name", "Team ID", "DNO", "Events", "Status", "Amount"]],
            body: tableRows,
            startY: 40,
            theme: 'grid',
            headStyles: { fillColor: [220, 38, 38], textColor: [255, 255, 255] },
            styles: { fontSize: 8, font: "helvetica" }
        });

        doc.save(`SpiderNet_${eventFilter}_${Date.now()}.pdf`);
        setIsExporting(false);
        setShowExportMenu(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center font-mono">
                <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-4" />
                <p className="text-red-600 tracking-[0.5em] font-black text-[10px] animate-pulse">Syncing_Web_Nodes...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020202] text-zinc-400 font-sans selection:bg-red-600/50 relative overflow-hidden">
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(220,38,38,0.12),transparent_70%)] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
                {/* HEADER SECTION */}
                <header className="mb-12">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
                            <div className="flex items-center gap-3 mb-4 text-red-600 font-mono text-[10px] tracking-[0.5em] uppercase">
                                <Fingerprint size={16} /> Terminal_Access: Root
                            </div>
                            <h1 className="text-7xl font-black italic text-white uppercase tracking-tighter leading-none">
                                WEB_<span className="text-red-600">REGISTRY</span>
                            </h1>
                        </motion.div>

                        <div className="flex flex-wrap items-center gap-4">
                            {/* EVENT FILTER DROPDOWN */}
                            <div className="relative group">
                                <div className="relative bg-zinc-950 border border-white/5 flex items-center px-4 py-3 gap-3 rounded-lg focus-within:border-red-600/50 transition-all">
                                    <Filter size={18} className="text-red-600" />
                                    <select
                                        value={eventFilter}
                                        onChange={(e) => setEventFilter(e.target.value)}
                                        className="bg-transparent border-none outline-none text-[11px] font-mono tracking-widest text-white uppercase cursor-pointer pr-4"
                                    >
                                        <option value="ALL_EVENTS" className="bg-zinc-900">ALL_EVENTS</option>
                                        {uniqueEvents.map(evt => (
                                            <option key={evt} value={evt} className="bg-zinc-900">{evt}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* SEARCH BAR */}
                            <div className="relative bg-zinc-950 border border-white/5 flex items-center px-4 py-3 gap-3 rounded-lg focus-within:border-red-600/50 transition-all">
                                <Search size={18} className="text-red-600" />
                                <input
                                    type="text"
                                    placeholder="TRACE_AGENT..."
                                    className="bg-transparent border-none outline-none text-[11px] font-mono tracking-widest text-white w-48"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* EXPORT DROPDOWN */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowExportMenu(!showExportMenu)}
                                    className="px-6 py-3 bg-red-600 text-white hover:bg-red-700 transition-all skew-x-[-12deg] font-black uppercase text-[10px] tracking-widest flex items-center gap-2"
                                >
                                    <span className="skew-x-[12deg] flex items-center gap-2">
                                        {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                                        EXTRACT <ChevronDown size={14} />
                                    </span>
                                </button>

                                <AnimatePresence>
                                    {showExportMenu && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 mt-4 w-64 bg-[#080808] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 p-2">
                                            <div className="px-4 py-2 mb-2 border-b border-white/5">
                                                <p className="text-[8px] font-mono text-zinc-500 uppercase">Exporting Based On Filter:</p>
                                                <p className="text-[10px] font-bold text-red-600 uppercase truncate">{eventFilter}</p>
                                            </div>
                                            <button onClick={exportToPDF} className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-mono font-bold uppercase text-zinc-400 hover:text-white hover:bg-red-600/10 rounded-lg">
                                                <FileText size={16} className="text-red-600" /> Export PDF (Landscape)
                                            </button>
                                            <button onClick={exportToExcel} className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-mono font-bold uppercase text-zinc-400 hover:text-white hover:bg-red-600/10 rounded-lg">
                                                <TableIcon size={16} className="text-green-600" /> Export Excel (.xlsx)
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* STATS OVERVIEW */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
                        <StatCard label="Filtered_Entries" value={filteredParticipants.length} icon={<Users />} active />
                        <StatCard label="Event_Scope" value={eventFilter === "ALL_EVENTS" ? "GLOBAL" : "SCOPED"} icon={<Database />} />
                        <StatCard label="Filtered_Revenue" value={`₹${filteredParticipants.reduce((acc, curr) => acc + curr.paymentAmount, 0)}`} icon={<Zap />} />
                        <StatCard label="Status" value="OPERATIONAL" icon={<ShieldCheck />} statusColor="text-green-500" />
                    </div>
                </header>

                {/* REGISTRY TABLE */}
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative bg-[#050505] border border-white/5 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 font-black bg-white/[0.01]">
                                <tr>
                                    <th className="p-6 border-b border-white/5">Identity</th>
                                    <th className="p-6 border-b border-white/5">Details</th>
                                    <th className="p-6 border-b border-white/5">Registry_Path</th>
                                    <th className="p-6 border-b border-white/5">Status</th>
                                    <th className="p-6 border-b border-white/5 text-right">Protocol</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.02]">
                                {filteredParticipants.map((p, i) => (
                                    <tr key={p._id} className="group hover:bg-red-600/[0.03] transition-colors">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded bg-zinc-950 border border-zinc-900 flex items-center justify-center font-mono text-[9px] text-zinc-600">
                                                    {String(i + 1).padStart(2, '0')}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white uppercase text-sm">{p.name}</div>
                                                    <div className="text-[9px] font-mono text-zinc-600 uppercase">{p.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="text-[10px] font-mono text-zinc-300 uppercase">{p.userDetails?.department || "N/A"}</div>
                                            <div className="text-[8px] text-zinc-600 uppercase">TID: {p.teamId}</div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex flex-wrap gap-2">
                                                {p.events.map((ev, idx) => (
                                                    <div key={idx} className={`px-2 py-0.5 rounded border text-[8px] font-black uppercase ${ev.eventName === eventFilter ? "border-red-600/50 text-red-600 bg-red-600/5" : "border-zinc-800 text-zinc-500"}`}>
                                                        {ev.eventName}
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className={`inline-flex px-3 py-1 rounded-sm border text-[8px] font-black uppercase ${p.paymentStatus === "PAID" ? "border-green-500/20 text-green-500" : "border-amber-500/20 text-amber-500"}`}>
                                                {p.paymentStatus}
                                            </div>
                                        </td>
                                        <td className="p-6 text-right">
                                            <div className="flex justify-end">
                                                <AnimatePresence mode="wait">
                                                    {terminatingId === p._id ? (
                                                        <motion.div key="confirm" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="flex gap-2">
                                                            <button onClick={() => terminateParticipant(p._id)} className="p-2 bg-red-600 text-white rounded"><Check size={14} /></button>
                                                            <button onClick={() => setTerminatingId(null)} className="p-2 bg-zinc-800 text-zinc-400 rounded"><X size={14} /></button>
                                                        </motion.div>
                                                    ) : (
                                                        <button onClick={() => setTerminatingId(p._id)} className="p-2 text-zinc-600 hover:text-red-600 transition-all"><Trash2 size={16} /></button>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

function StatCard({ label, value, icon, active, statusColor }: { label: string, value: string | number, icon: any, active?: boolean, statusColor?: string }) {
    return (
        <div className="bg-[#050505] border border-white/5 p-6 rounded-xl relative group">
            <div className={`absolute top-4 right-4 opacity-10 group-hover:opacity-30 transition-opacity ${active ? "text-red-600" : "text-white"}`}>
                {icon}
            </div>
            <p className="text-zinc-600 font-mono text-[9px] uppercase tracking-[0.3em] mb-1">{label}</p>
            <p className={`text-4xl font-black italic tracking-tighter ${statusColor || "text-white"}`}>
                {value}
            </p>
        </div>
    );
}