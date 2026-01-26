"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
    ShieldCheck,
    Search,
    CircleDollarSign,
    Users,
    Clock,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Fingerprint,
    Zap
} from "lucide-react";

interface Participant {
    _id: string;
    name: string;
    email: string;
    teamId: string;
    events: { eventName: string; eventType: string }[];
    paymentAmount: number;
    paymentStatus: "PENDING" | "PAID";
}

export default function AdminPaymentsPage() {
    const router = useRouter();
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [loading, setLoading] = useState(true);
    const [verifyingId, setVerifyingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            router.push("/admin/login");
            return;
        }

        fetch("/api/participants", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => setParticipants(data.participants || []))
            .catch(err => console.error("Fetch error:", err))
            .finally(() => setLoading(false));
    }, [router]);

    const filteredParticipants = useMemo(() => {
        return participants.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.teamId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [participants, searchTerm]);

    const stats = useMemo(() => ({
        total: participants.length,
        paid: participants.filter(p => p.paymentStatus === "PAID").length,
        pending: participants.filter(p => p.paymentStatus === "PENDING").length,
        revenue: participants.filter(p => p.paymentStatus === "PAID").reduce((acc, curr) => acc + curr.paymentAmount, 0)
    }), [participants]);

    const verifyPayment = async (id: string) => {
        const token = localStorage.getItem("adminToken");
        if (!token) return;
        setVerifyingId(id);

        try {
            const res = await fetch("/api/admin/verify-payment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ participantId: id }),
            });

            if (res.ok) {
                setParticipants(prev => prev.map(p => p._id === id ? { ...p, paymentStatus: "PAID" } : p));
            }
        } catch (err) {
            alert("Connection error");
        } finally {
            setVerifyingId(null);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center font-mono">
            <div className="relative w-24 h-24 mb-4">
                <div className="absolute inset-0 border-2 border-red-600/20 rounded-full animate-ping" />
                <Loader2 className="w-24 h-24 text-red-600 animate-spin" strokeWidth={1} />
            </div>
            <p className="text-red-600 tracking-[0.5em] text-[10px] animate-pulse">DECRYPTING_PAYMENT_LEDGER...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020202] text-zinc-400 font-sans selection:bg-red-600/50 relative overflow-hidden">
            {/* SPIDER THEME OVERLAYS */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(220,38,38,0.12),transparent_70%)] pointer-events-none" />
            <div className="fixed inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />
            <div className="fixed inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px]" />

            <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
                {/* HEADER */}
                <header className="mb-12">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4 text-red-600 font-mono text-[10px] tracking-[0.5em] uppercase">
                                <Fingerprint size={16} /> Secure_Admin_Override
                            </div>
                            <h1 className="text-6xl font-black italic text-white uppercase tracking-tighter leading-none">
                                PAYMENT_<span className="text-red-600">VAULT</span>
                            </h1>
                        </div>

                        {/* SEARCH BAR */}
                        <div className="relative group w-full lg:w-96">
                            <div className="absolute inset-0 bg-red-600/10 blur group-focus-within:bg-red-600/20 transition-all" />
                            <div className="relative bg-zinc-950 border border-white/10 flex items-center px-4 py-3 gap-3 focus-within:border-red-600/50 transition-all">
                                <Search size={18} className="text-red-600" />
                                <input
                                    type="text"
                                    placeholder="TRACE_PARTICIPANT (NAME/TEAM)..."
                                    className="bg-transparent border-none outline-none text-[11px] font-mono tracking-widest text-white w-full"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* STATS CARDS */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
                        <StatBox icon={<Users size={16} />} label="Total_Nodes" value={stats.total} color="text-white" />
                        <StatBox icon={<CheckCircle2 size={16} />} label="Verified" value={stats.paid} color="text-green-500" />
                        <StatBox icon={<Clock size={16} />} label="Pending" value={stats.pending} color="text-amber-500" />
                        <StatBox icon={<Zap size={16} />} label="Total_Revenue" value={`₹${stats.revenue}`} color="text-red-500" />
                    </div>
                </header>

                {/* LEDGER TABLE */}
                <div className="bg-[#050505]/80 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 bg-white/[0.02] border-b border-white/5">
                                <tr>
                                    <th className="p-6">Participant_Identity</th>
                                    <th className="p-6">Sector_Allocation</th>
                                    <th className="p-6">Transaction_Amount</th>
                                    <th className="p-6 text-right">Verification_Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.02]">
                                {filteredParticipants.map(p => (
                                    <tr key={p._id} className="group hover:bg-red-600/[0.03] transition-colors">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-red-600 font-mono text-xs">
                                                    ID
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white uppercase tracking-tight group-hover:text-red-500 transition-colors">
                                                        {p.name}
                                                    </div>
                                                    <div className="text-[10px] font-mono opacity-50 uppercase tracking-widest">
                                                        {p.email} • UNIT_{p.teamId}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex flex-wrap gap-2">
                                                {p.events.map((ev, i) => (
                                                    <span key={i} className="text-[8px] px-2 py-1 bg-zinc-900 border border-zinc-800 rounded font-mono uppercase text-red-500/80">
                                                        {ev.eventName}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-6 font-mono text-white text-sm">
                                            ₹{p.paymentAmount}.00
                                        </td>
                                        <td className="p-6 text-right">
                                            {p.paymentStatus === "PAID" ? (
                                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/20 bg-green-500/5 text-green-400 text-[10px] font-black uppercase tracking-widest">
                                                    <ShieldCheck size={14} /> Verified
                                                </div>
                                            ) : (
                                                <button
                                                    disabled={verifyingId === p._id}
                                                    onClick={() => verifyPayment(p._id)}
                                                    className="relative overflow-hidden group/btn px-6 py-2 bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.2em] skew-x-[-15deg] hover:bg-red-500 transition-all disabled:opacity-50"
                                                >
                                                    <span className="skew-x-[15deg] flex items-center gap-2">
                                                        {verifyingId === p._id ? <Loader2 size={12} className="animate-spin" /> : <CircleDollarSign size={12} />}
                                                        {verifyingId === p._id ? "Verifying..." : "Mark_Paid"}
                                                    </span>
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatBox({ icon, label, value, color }: { icon: any, label: string, value: string | number, color: string }) {
    return (
        <div className="bg-[#050505] border border-white/5 p-6 rounded-xl relative group overflow-hidden">
            <div className="absolute top-0 left-0 w-[2px] h-0 bg-red-600 group-hover:h-full transition-all duration-500" />
            <div className="flex items-center gap-3 mb-2 text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-500">
                {icon} {label}
            </div>
            <div className={`text-2xl font-black italic tracking-tighter ${color}`}>
                {value}
            </div>
        </div>
    );
}