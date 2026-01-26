"use client";

import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    School,
    Phone,
    Mail,
    LogOut,
    ShieldAlert,
    Plus,
    CheckCircle2,
    Calendar,
    X,
    Filter,
    Layers
} from "lucide-react";
import PaymentQR from "@/components/PaymentQR";

/* ================= TYPES ================= */
interface UserData {
    teamId: string;
    name: string;
    email: string;
    phone: string;
    college: string;
    createdAt: string;
}

interface Participant {
    events: { eventName: string; eventType: string }[];
    paymentStatus: string;
    paymentAmount: number;
    _id: string;
    name: string;
    dno: string;
    email: string;
}

interface EventItem {
    _id: string;
    eventName: string;
    minPlayers: number;
    maxPlayers: number;
    eventType: "TECHNICAL" | "NON-TECHNICAL" | "CULTURALS";
}

export default function DashboardPage() {
    const router = useRouter();

    const [user, setUser] = useState<UserData | null>(null);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [events, setEvents] = useState<EventItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingParticipants, setLoadingParticipants] = useState(true);
    const [showParticipantForm, setShowParticipantForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [payParticipant, setPayParticipant] = useState<any>(null);

    // Filter State
    const [activeFilter, setActiveFilter] = useState<string>("ALL");

    const [formData, setFormData] = useState({
        name: "",
        dno: "",
        email: "",
        eventName: "",
        eventType: "",
    });

    /* ================= INITIALIZATION ================= */
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) { router.push("/login"); return; }

        const init = async () => {
            try {
                const userRes = await fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } });
                if (!userRes.ok) throw new Error();
                const userData = await userRes.json();
                setUser(userData.user);
                await fetchParticipants();
                await fetchEvents();
            } catch {
                localStorage.removeItem("token");
                router.push("/login");
            } finally {
                setLoading(false);
            }
        };
        init();
    }, [router]);

    const fetchParticipants = async () => {
        const token = localStorage.getItem("token");
        setLoadingParticipants(true);
        try {
            const res = await fetch("/api/fetch-participants", { headers: { Authorization: `Bearer ${token}` } });
            const data = await res.json();
            setParticipants(data.participants || []);
        } catch (err) { console.error(err); }
        finally { setLoadingParticipants(false); }
    };

    const fetchEvents = async () => {
        try {
            const res = await fetch("/api/events-fetch");
            const data = await res.json();
            setEvents(data.data || []);
        } catch (err) { console.error(err); }
    };

    /* ================= FILTER LOGIC ================= */
    const filteredParticipants = useMemo(() => {
        if (activeFilter === "ALL") return participants;
        return participants.filter(p =>
            p.events.some(ev => ev.eventType === activeFilter)
        );
    }, [participants, activeFilter]);

    /* ================= HANDLERS ================= */
    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    const handleAddParticipant = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const token = localStorage.getItem("token");

        try {
            const res = await fetch("/api/participants", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to register");

            setFormData({ name: "", dno: "", email: "", eventName: "", eventType: "" });
            setShowParticipantForm(false);
            fetchParticipants();
        } catch (err: any) {
            alert(err.message);
        } finally {
            setSaving(false);
        }
    };

    const openAddEventForExisting = (p: Participant) => {
        setFormData({
            name: p.name,
            dno: p.dno,
            email: p.email,
            eventName: "",
            eventType: "",
        });
        setShowParticipantForm(true);
    };

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-red-600 font-mono text-[10px] tracking-widest animate-pulse">AUTHORIZING_ACCESS...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020202] text-zinc-300 relative selection:bg-red-600/30">
            <div className="max-w-5xl mx-auto px-6 py-12 relative z-10">

                {/* HEADER */}
                <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <ShieldAlert className="text-red-600 w-4 h-4 animate-pulse" />
                            <span className="text-red-600 font-mono text-[10px] tracking-[0.4em] uppercase">Security_Verified</span>
                        </div>
                        <h1 className="text-5xl font-black italic text-white uppercase tracking-tighter">
                            TEAM <span className="text-red-600">DASHBOARD_</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => {
                                setFormData({ name: "", dno: "", email: "", eventName: "", eventType: "" });
                                setShowParticipantForm(true);
                            }}
                            className="px-6 py-3 bg-red-600 text-white font-bold uppercase text-[10px] tracking-widest skew-x-[-12deg] transition-all hover:bg-red-700 hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(220,38,38,0.3)]"
                        >
                            <span className="inline-block skew-x-[12deg] flex items-center gap-2">
                                <Plus size={14} /> Add Participant
                            </span>
                        </button>
                        <button onClick={handleLogout} className="px-4 py-3 bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-red-500 transition-colors skew-x-[-12deg]">
                            <LogOut size={16} className="skew-x-[12deg]" />
                        </button>
                    </div>
                </header>

                {/* TEAM INFO */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
                    <div className="md:col-span-1 bg-zinc-900/30 border border-zinc-800 p-6 rounded-2xl flex flex-col items-center justify-center">
                        <User className="text-red-600 mb-3" size={40} />
                        <h2 className="text-lg font-black text-white uppercase italic text-center leading-tight">{user?.name}</h2>
                        <p className="text-red-600 font-mono text-[10px] tracking-tighter mt-1">ID: {user?.teamId}</p>
                    </div>
                    <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <InfoBox label="Academy" value={user?.college || "N/A"} icon={<School />} />
                        <InfoBox label="Comm-Link" value={user?.phone || "N/A"} icon={<Phone />} />
                        <InfoBox label="Email" value={user?.email || "N/A"} icon={<Mail />} />
                    </div>
                </div>

                {/* CREW ROSTER WITH FILTERS */}
                <div className="bg-[#050505] border border-zinc-900 rounded-2xl shadow-2xl overflow-hidden mb-20">
                    <div className="px-6 py-6 border-b border-zinc-900 space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-white font-black uppercase tracking-widest text-xs flex items-center gap-2">
                                <Layers size={14} className="text-red-600" /> Crew Roster
                            </h3>
                            <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500">
                                <Filter size={10} /> Filtered_By: <span className="text-red-500">{activeFilter}</span>
                            </div>
                        </div>

                        {/* CATEGORY TABS */}
                        <div className="flex flex-wrap gap-2">
                            {["ALL", "TECHNICAL", "NON-TECHNICAL", "CULTURALS"].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setActiveFilter(type)}
                                    className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all border ${activeFilter === type
                                        ? "bg-red-600 border-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.2)]"
                                        : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-6">
                        <AnimatePresence mode="wait">
                            {loadingParticipants ? (
                                <motion.div
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="py-12 text-center text-zinc-600 font-mono text-xs animate-pulse"
                                >
                                    SYNCHRONIZING_PERSONNEL_DATA...
                                </motion.div>
                            ) : filteredParticipants.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="py-12 text-center border border-dashed border-zinc-900 rounded-xl"
                                >
                                    <p className="text-zinc-500 text-sm">No personnel found in <span className="text-red-500">{activeFilter}</span> sector.</p>
                                </motion.div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    {filteredParticipants.map((p, i) => (
                                        <motion.div
                                            key={p._id}
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="group flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-zinc-950 border border-zinc-900 rounded-xl hover:border-red-600/40 transition-all duration-300"
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <div className="w-8 h-8 rounded-full bg-red-600/10 flex items-center justify-center text-red-600 font-black text-xs">
                                                        {i + 1}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-white font-bold tracking-tight">{p.name}</h4>
                                                        <p className="text-[10px] font-mono text-zinc-500 uppercase">{p.dno}</p>
                                                    </div>
                                                </div>

                                                <div className="mt-4 flex flex-wrap gap-2">
                                                    {p.events.map((ev, idx) => (
                                                        <div key={idx} className="flex flex-col px-3 py-1 bg-black border border-zinc-800 rounded-md">
                                                            <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-tighter">{ev.eventType}</span>
                                                            <span className="text-[10px] text-red-500 font-black uppercase tracking-widest leading-none mt-0.5">{ev.eventName}</span>
                                                        </div>
                                                    ))}
                                                    {p.events.length < 2 && (
                                                        <button
                                                            onClick={() => openAddEventForExisting(p)}
                                                            className="px-3 py-1 border border-dashed border-zinc-800 hover:border-red-600/50 text-zinc-600 hover:text-red-500 rounded-md text-[9px] font-black uppercase transition-all"
                                                        >
                                                            + ADD EVENT
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-end gap-3 border-t md:border-t-0 border-zinc-900 pt-4 md:pt-0">
                                                {p.paymentStatus === "PAID" ? (
                                                    <div className="flex items-center gap-2 px-4 py-2 bg-green-500/5 border border-green-500/20 rounded-lg text-green-500 text-[9px] font-black uppercase tracking-widest">
                                                        <CheckCircle2 size={12} /> CLEARANCE: ACTIVE
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-end gap-2">
                                                        <button
                                                            onClick={() => { setPayParticipant(p); setShowPaymentModal(true); }}
                                                            className="px-6 py-2 bg-red-600 text-white font-black text-[10px] rounded-md hover:bg-red-700 transition-all uppercase tracking-widest"
                                                        >
                                                            PAY ₹{p.paymentAmount}
                                                        </button>
                                                        <span className="text-[8px] font-mono text-zinc-600 animate-pulse">AWAITING_PAYMENT_HASH</span>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* MODALS REMAINDER (UNCHANGED BUT UPDATED STYLING) */}
            <AnimatePresence>
                {showParticipantForm && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowParticipantForm(false)} className="absolute inset-0 bg-black/95 backdrop-blur-md" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-[#050505] border border-red-600/30 rounded-2xl p-8 w-full max-w-lg shadow-[0_0_50px_rgba(220,38,38,0.1)]">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">DATA <span className="text-red-600">INPUT_</span></h2>
                                    <p className="text-zinc-500 text-[10px] font-mono mt-1">Personnel_Registry_V2.0</p>
                                </div>
                                <button onClick={() => setShowParticipantForm(false)} className="p-2 hover:bg-zinc-900 rounded-full transition-colors"><X size={20} className="text-zinc-600 hover:text-white" /></button>
                            </div>

                            <form onSubmit={handleAddParticipant} className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-zinc-500 uppercase ml-1">Identity_Name</label>
                                        <input required placeholder="eg. John Doe" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-zinc-900/50 border border-zinc-800 p-3 rounded-xl text-white outline-none focus:border-red-600 transition-colors" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-zinc-500 uppercase ml-1">Department_No</label>
                                        <input required placeholder="eg. 21-CS-001" value={formData.dno} onChange={e => setFormData({ ...formData, dno: e.target.value })} className="w-full bg-zinc-900/50 border border-zinc-800 p-3 rounded-xl text-white outline-none focus:border-red-600 transition-colors" />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-zinc-500 uppercase ml-1">Comm_Address (Email)</label>
                                    <input required type="email" placeholder="john@academy.edu" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-zinc-900/50 border border-zinc-800 p-3 rounded-xl text-white outline-none focus:border-red-600 transition-colors" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-zinc-500 uppercase ml-1">Sector</label>
                                        <select required value={formData.eventType} onChange={e => setFormData({ ...formData, eventType: e.target.value, eventName: "" })} className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-white outline-none focus:border-red-600">
                                            <option value="">Select_Sector</option>
                                            <option value="TECHNICAL">TECHNICAL</option>
                                            <option value="NON-TECHNICAL">NON-TECHNICAL</option>
                                            <option value="CULTURALS">CULTURALS</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-zinc-500 uppercase ml-1">Operation</label>
                                        <select required value={formData.eventName} onChange={e => setFormData({ ...formData, eventName: e.target.value })} disabled={!formData.eventType} className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-white outline-none focus:border-red-600 disabled:opacity-50">
                                            <option value="">Select_Task</option>
                                            {events.filter(ev => ev.eventType === formData.eventType).map(ev => (
                                                <option key={ev._id} value={ev.eventName}>{ev.eventName}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <button type="submit" disabled={saving} className="w-full py-4 bg-red-600 text-white font-black uppercase text-xs rounded-xl hover:bg-red-700 transition-all disabled:opacity-50 tracking-[0.2em] shadow-[0_5px_15px_rgba(220,38,38,0.3)]">
                                    {saving ? "UPLOADING_CREDENTIALS..." : "CONFIRM_REGISTRATION"}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* PAYMENT MODAL (UPDATED UI) */}
            {showPaymentModal && payParticipant && (
                <div className="fixed inset-0 z-[300] bg-black/98 flex items-center justify-center p-4">
                    <div className="bg-[#050505] border border-red-600/20 rounded-3xl p-8 w-full max-w-sm text-center relative overflow-hidden">
                        {/* Background glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-red-600/10 blur-[80px] rounded-full" />

                        <h2 className="text-xl font-black text-white uppercase tracking-widest mb-1 italic">SECURE <span className="text-red-600">TRANSACTION_</span></h2>
                        <p className="text-zinc-600 text-[10px] font-mono mb-8">Node_ID: {payParticipant._id.substring(0, 8)}</p>

                        <div className="bg-white p-3 rounded-2xl inline-block mb-6 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                            <PaymentQR teamId={user?.teamId || ""} email={payParticipant.email} amount={payParticipant.paymentAmount} />
                        </div>

                        <div className="space-y-1 mb-8">
                            <p className="text-3xl font-black text-white tracking-tighter">₹{payParticipant.paymentAmount}</p>
                            <p className="text-zinc-500 text-[9px] uppercase font-bold tracking-widest">Amount_Payable</p>
                        </div>

                        <button
                            onClick={() => { setShowPaymentModal(false); setPayParticipant(null); }}
                            className="w-full py-4 bg-zinc-900 text-zinc-400 hover:text-white font-black uppercase text-[10px] rounded-2xl transition-all border border-zinc-800 hover:border-zinc-700 tracking-widest"
                        >
                            DISMISS_TERMINAL
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ================= HELPER COMPONENTS ================= */

function InfoBox({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
    return (
        <div className="bg-zinc-900/10 border border-zinc-900 p-5 rounded-2xl relative overflow-hidden group hover:border-red-600/20 transition-all">
            <div className="absolute -right-2 -bottom-2 opacity-5 text-white group-hover:opacity-10 transition-opacity">{icon}</div>
            <p className="text-zinc-600 font-bold uppercase text-[9px] tracking-[0.2em] mb-1">{label}</p>
            <p className="text-white font-bold text-sm truncate tracking-tight">{value}</p>
        </div>
    );
}