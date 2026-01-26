"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
    ShieldCheck, Search, CircleDollarSign, Users, Clock,
    CheckCircle2, Loader2, Fingerprint, Zap
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
            .catch(err => console.error("Initial Fetch error:", err))
            .finally(() => setLoading(false));
    }, [router]);

    const verifyPayment = async (id: string) => {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            console.error("❌ Auth Error: No admin token found in localStorage");
            return;
        }

        console.log(`🚀 TRIGGER: Starting verification for Participant ID: ${id}`);
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

            console.log(`📡 RESPONSE STATUS: ${res.status} ${res.statusText}`);

            // Safety check: if backend crashes, it might not return JSON
            const contentType = res.headers.get("content-type");
            let data;
            if (contentType && contentType.indexOf("application/json") !== -1) {
                data = await res.json();
            } else {
                const text = await res.text();
                console.error("❌ RAW BACKEND ERROR (Non-JSON):", text);
                throw new Error("Backend returned a non-JSON response. Check server terminal.");
            }

            if (res.ok) {
                console.log("✅ SUCCESS: Payment updated and email dispatched.");
                setParticipants(prev => prev.map(p => p._id === id ? { ...p, paymentStatus: "PAID" } : p));
                alert(`SUCCESS: ${data.message}`);
            } else {
                console.error("⚠️ BACKEND LOGIC ERROR:", data);
                alert(`FAILED: ${data.message || "Unknown Error"}`);
            }

        } catch (err: any) {
            console.error("🛑 FATAL CONNECTION ERROR:", err);
            alert(`SYSTEM ERROR: ${err.message}`);
        } finally {
            setVerifyingId(null);
            console.log(`🏁 FINISHED: Verification attempt for ${id} ended.`);
        }
    };

    // ... stats useMemo (Keep your existing stats logic)
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

    if (loading) return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center font-mono">
            <Loader2 className="w-16 h-16 text-red-600 animate-spin mb-4" />
            <p className="text-red-600 tracking-widest text-xs uppercase animate-pulse">Scanning_Registry...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020202] text-zinc-400 font-sans selection:bg-red-600/50 relative overflow-hidden">
            {/* SPIDER THEME OVERLAYS */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(220,38,38,0.12),transparent_70%)] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
                <header className="mb-12">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4 text-red-600 font-mono text-[10px] tracking-[0.5em] uppercase">
                                <Fingerprint size={16} /> Ledger_Access_Granted
                            </div>
                            <h1 className="text-6xl font-black italic text-white uppercase tracking-tighter leading-none">
                                PAYMENT_<span className="text-red-600">VAULT</span>
                            </h1>
                        </div>

                        <div className="relative group w-full lg:w-96">
                            <div className="relative bg-zinc-950 border border-white/10 flex items-center px-4 py-3 gap-3">
                                <Search size={18} className="text-red-600" />
                                <input
                                    type="text"
                                    placeholder="TRACE_PARTICIPANT..."
                                    className="bg-transparent border-none outline-none text-[11px] font-mono tracking-widest text-white w-full uppercase"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
                        <StatBox icon={<Users size={16} />} label="Total_Nodes" value={stats.total} color="text-white" />
                        <StatBox icon={<CheckCircle2 size={16} />} label="Verified" value={stats.paid} color="text-green-500" />
                        <StatBox icon={<Clock size={16} />} label="Pending" value={stats.pending} color="text-amber-500" />
                        <StatBox icon={<Zap size={16} />} label="Revenue" value={`₹${stats.revenue}`} color="text-red-500" />
                    </div>
                </header>

                <div className="bg-[#050505]/80 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 bg-white/[0.02] border-b border-white/5">
                                <tr>
                                    <th className="p-6">Identity</th>
                                    <th className="p-6">Sector</th>
                                    <th className="p-6">Amount</th>
                                    <th className="p-6 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.02]">
                                {filteredParticipants.map(p => (
                                    <tr key={p._id} className="group hover:bg-red-600/[0.03] transition-colors">
                                        <td className="p-6">
                                            <div className="font-bold text-white uppercase tracking-tight">{p.name}</div>
                                            <div className="text-[10px] font-mono opacity-50">{p.email} • {p.teamId}</div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex flex-wrap gap-2">
                                                {p.events.map((ev, i) => (
                                                    <span key={i} className="text-[8px] px-2 py-1 bg-zinc-900 border border-zinc-800 rounded font-mono text-red-500/80">
                                                        {ev.eventName}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-6 font-mono text-white">₹{p.paymentAmount}</td>
                                        <td className="p-6 text-right">
                                            {p.paymentStatus === "PAID" ? (
                                                <div className="inline-flex items-center gap-2 px-4 py-2 text-green-400 text-[10px] font-black uppercase tracking-widest border border-green-500/20 bg-green-500/5 rounded-full">
                                                    <ShieldCheck size={14} /> Verified
                                                </div>
                                            ) : (
                                                <button
                                                    disabled={verifyingId === p._id}
                                                    onClick={() => verifyPayment(p._id)}
                                                    className="relative px-6 py-2 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest skew-x-[-15deg] hover:bg-red-500 transition-all disabled:opacity-50"
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
        <div className="bg-[#050505] border border-white/5 p-6 rounded-xl relative group">
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