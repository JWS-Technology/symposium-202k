"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users, ShieldCheck, Search, FileDown, Globe, Database,
    Zap, Fingerprint, CheckCircle2, Clock, ChevronDown,
    FileText, Table as TableIcon, Download, Loader2
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
}

export default function AdminParticipantsPage() {
    const router = useRouter();
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isExporting, setIsExporting] = useState(false);
    const [showExportMenu, setShowExportMenu] = useState(false);

    /* ================= DATA FETCHING ================= */
    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            router.push("/admin/login");
            return;
        }

        const fetchRegistry = async () => {

            try {
                const res = await fetch("/api/participants", { // Ensure this matches your route
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
            p.dno.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.events.some(e => e.eventName.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [participants, searchTerm]);

    /* ================= EXPORT METHODS ================= */

    // 1. EXCEL EXPORT
    const exportToExcel = () => {
        setIsExporting(true);
        const worksheetData = filteredParticipants.map((p, i) => ({
            "S.No": i + 1,
            "Agent Name": p.name,
            "Email": p.email,
            "Team ID": p.teamId,
            "DNO/Access Code": p.dno,
            "Events": p.events.map(e => `${e.eventName} (${e.eventType})`).join(", "),
            "Status": p.paymentStatus,
            "Amount": `INR ${p.paymentAmount}`,
            "Verified": p.paymentVerifiedByAdmin ? "YES" : "NO",
            "Registration Date": new Date(p.createdAt).toLocaleDateString()
        }));

        const ws = XLSX.utils.json_to_sheet(worksheetData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Registry_Data");

        const timestamp = new Date().toISOString().split('T')[0];
        XLSX.writeFile(wb, `SpiderNet_Registry_${timestamp}.xlsx`);

        setIsExporting(false);
        setShowExportMenu(false);
    };

    // 2. PDF EXPORT (Corrected & Dynamic)
    const exportToPDF = () => {
        setIsExporting(true);
        const doc = new jsPDF({ orientation: 'landscape' });

        // Header Decoration
        doc.setFillColor(10, 10, 10);
        doc.rect(0, 0, 297, 35, 'F');
        doc.setTextColor(220, 38, 38);
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.text("SPIDER-NET: DATA EXTRACTION", 14, 22);

        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`GENERATED: ${new Date().toLocaleString()} | TOTAL_ENTRIES: ${filteredParticipants.length}`, 14, 30);

        const tableColumn = ["S.No", "Name", "Team ID", "DNO", "Events Registry", "Status", "Amount"];
        const tableRows = filteredParticipants.map((p, i) => [
            i + 1,
            p.name.toUpperCase(),
            p.teamId,
            p.dno,
            p.events.map(e => `${e.eventName} [${e.eventType}]`).join("\n"),
            p.paymentStatus,
            `INR ${p.paymentAmount}`
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 40,
            theme: 'grid',
            headStyles: { fillColor: [220, 38, 38], textColor: [255, 255, 255], fontStyle: 'bold' },
            styles: { fontSize: 8, cellPadding: 3, valign: 'middle' },
            columnStyles: { 4: { cellWidth: 70 } }
        });

        // Fixed Filename logic
        const timestamp = new Date().getTime();
        doc.save(`SpiderNet_Registry_${timestamp}.pdf`);

        setIsExporting(false);
        setShowExportMenu(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center font-mono">
                <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-4" />
                <p className="text-red-600 tracking-[0.5em] font-black text-[10px] animate-pulse uppercase">
                    Syncing_Web_Nodes...
                </p>
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
                                <Fingerprint size={16} className="animate-pulse" />
                                Terminal_Access: Root
                            </div>
                            <h1 className="text-7xl font-black italic text-white uppercase tracking-tighter leading-none">
                                WEB_<span className="text-red-600">REGISTRY</span>
                            </h1>
                        </motion.div>

                        <div className="flex flex-wrap items-center gap-4">
                            {/* SEARCH BAR */}
                            <div className="relative group">
                                <div className="absolute inset-0 bg-red-600/10 blur opacity-0 group-hover:opacity-100 transition-all" />
                                <div className="relative bg-zinc-950 border border-white/5 flex items-center px-4 py-3 gap-3 focus-within:border-red-600/50 transition-all rounded-lg">
                                    <Search size={18} className="text-red-600" />
                                    <input
                                        type="text"
                                        placeholder="TRACE_AGENT..."
                                        className="bg-transparent border-none outline-none text-[11px] font-mono tracking-widest text-white w-64"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* EXPORT DROPDOWN */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowExportMenu(!showExportMenu)}
                                    className="px-6 py-3 bg-red-600 text-white hover:bg-red-700 transition-all skew-x-[-12deg] font-black uppercase text-[10px] tracking-widest flex items-center gap-2"
                                >
                                    <span className="skew-x-[12deg] flex items-center gap-2">
                                        {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                                        EXTRACT_DATA <ChevronDown size={14} />
                                    </span>
                                </button>

                                <AnimatePresence>
                                    {showExportMenu && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute right-0 mt-4 w-56 bg-[#080808] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 p-2"
                                        >
                                            <button
                                                onClick={exportToPDF}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-mono font-bold uppercase text-zinc-400 hover:text-white hover:bg-red-600/10 rounded-lg transition-all"
                                            >
                                                <FileText size={16} className="text-red-600" /> Export PDF (Landscape)
                                            </button>
                                            <button
                                                onClick={exportToExcel}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-mono font-bold uppercase text-zinc-400 hover:text-white hover:bg-red-600/10 rounded-lg transition-all"
                                            >
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
                        <StatCard label="Live_Agents" value={participants.length} icon={<Users />} active />
                        <StatCard label="Total_Teams" value={[...new Set(participants.map(p => p.teamId))].length} icon={<Database />} />
                        <StatCard label="Revenue" value={`₹${participants.reduce((acc, curr) => acc + curr.paymentAmount, 0)}`} icon={<Zap />} statusColor="text-white" />
                        <StatCard label="System_Status" value="HEALTHY" icon={<ShieldCheck />} statusColor="text-green-500" />
                    </div>
                </header>

                {/* REGISTRY TABLE */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative bg-[#050505] border border-white/5 rounded-2xl overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 font-black bg-white/[0.01]">
                                <tr>
                                    <th className="p-6 border-b border-white/5">Identity</th>
                                    <th className="p-6 border-b border-white/5">Event_Configuration</th>
                                    <th className="p-6 border-b border-white/5">Origin_Unit</th>
                                    <th className="p-6 border-b border-white/5 text-right">Payment</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.02]">
                                {filteredParticipants.map((p, i) => (
                                    <tr key={p._id} className="group hover:bg-red-600/[0.03] transition-colors">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-zinc-950 border border-zinc-900 flex items-center justify-center font-mono text-[10px] text-zinc-600 group-hover:text-red-500 transition-all">
                                                    {String(i + 1).padStart(2, '0')}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white uppercase text-base tracking-tight">{p.name}</div>
                                                    <div className="text-[10px] font-mono text-zinc-600">{p.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex flex-wrap gap-2">
                                                {p.events.map((ev, idx) => (
                                                    <div key={idx} className="flex flex-col bg-zinc-900/50 border border-zinc-800 px-3 py-1 rounded">
                                                        <span className="text-[7px] text-red-500 font-bold uppercase">{ev.eventType}</span>
                                                        <span className="text-[10px] text-zinc-300 font-black uppercase">{ev.eventName}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="text-[10px] font-mono space-y-1">
                                                <p className="text-zinc-500 italic">TEAM: <span className="text-white not-italic font-bold">{p.teamId}</span></p>
                                                <p className="text-zinc-500 italic">DNO: <span className="text-zinc-400 not-italic">{p.dno}</span></p>
                                            </div>
                                        </td>
                                        <td className="p-6 text-right">
                                            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-sm border text-[9px] font-black uppercase tracking-widest ${p.paymentStatus === "PAID"
                                                ? "bg-green-500/10 border-green-500/20 text-green-500"
                                                : "bg-amber-500/10 border-amber-500/20 text-amber-500 pulse"
                                                }`}>
                                                {p.paymentStatus === "PAID" ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                                                {p.paymentStatus}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredParticipants.length === 0 && (
                            <div className="p-20 text-center font-mono text-zinc-600 uppercase tracking-widest text-xs">
                                [!] No agents found in sector scan
                            </div>
                        )}
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