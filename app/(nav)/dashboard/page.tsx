"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast"; // ✅ Import Toast
import {
    User,
    School,
    Phone,
    Mail,
    LogOut,
    ShieldAlert,
    Plus,
    CheckCircle2,
    X,
    Filter,
    Layers,
    Zap,
    Trash2,
    Edit3,
    AlertCircle,
    ShieldCheck
} from "lucide-react";
import PaymentQR from "@/components/PaymentQR";

/* ================= TYPES ================= */
interface UserData {
    teamId: string;
    name: string;
    email: string;
    phone: string;
    college: string;
    department: string;

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
    const [payParticipant, setPayParticipant] = useState<Participant | null>(null);
    const [activeFilter, setActiveFilter] = useState<string>("ALL");

    const [editingId, setEditingId] = useState<string | null>(null);
    const [isEditSwap, setIsEditSwap] = useState(false);
    const [oldEventName, setOldEventName] = useState("");

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
                await Promise.all([fetchParticipants(), fetchEvents()]);
            } catch {
                localStorage.removeItem("token");
                router.push("/login");
                toast.error("Session Expired. Please Re-Login.");
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
        } catch (err) {
            toast.error("Failed to sync roster.");
        } finally { setLoadingParticipants(false); }
    };

    const fetchEvents = async () => {
        try {
            const res = await fetch("/api/events-fetch");
            const data = await res.json();
            setEvents(data.data || []);
        } catch (err) { console.error(err); }
    };

    /* ================= DYNAMIC RESTRICTION LOGIC ================= */

    // 1. Sector Lock: Determine if participant is locked into Culturals or Tech/Non-Tech mix
    const allowedSectors = useMemo(() => {
        if (!editingId) return ["TECHNICAL", "NON-TECHNICAL", "CULTURALS"];

        const p = participants.find(part => part._id === editingId);
        if (!p || p.events.length === 0) return ["TECHNICAL", "NON-TECHNICAL", "CULTURALS"];

        // Look at the event that ISN'T the one we are currently changing
        const anchorEvent = isEditSwap
            ? p.events.find(ev => ev.eventName !== oldEventName)
            : p.events[0];

        if (!anchorEvent) return ["TECHNICAL", "NON-TECHNICAL", "CULTURALS"];

        return anchorEvent.eventType === "CULTURALS"
            ? ["CULTURALS"]
            : ["TECHNICAL", "NON-TECHNICAL"];
    }, [editingId, participants, isEditSwap, oldEventName]);

    // 2. Event Duplicate Filter: Hide events the participant already has
    const filteredEventOptions = useMemo(() => {
        if (!formData.eventType) return [];
        let options = events.filter(ev => ev.eventType === formData.eventType);

        if (editingId) {
            const p = participants.find(part => part._id === editingId);
            const currentEventNames = p?.events.map(e => e.eventName) || [];

            options = options.filter(ev => {
                // If swapping, the current old event is allowed back in
                if (isEditSwap && ev.eventName === oldEventName) return true;
                return !currentEventNames.includes(ev.eventName);
            });
        }
        return options;
    }, [formData.eventType, events, editingId, participants, isEditSwap, oldEventName]);

    const filteredParticipants = useMemo(() => {
        if (activeFilter === "ALL") return participants;
        return participants.filter(p => p.events.some(ev => ev.eventType === activeFilter));
    }, [participants, activeFilter]);

    /* ================= HANDLERS ================= */
    const handleLogout = () => {
        localStorage.removeItem("token");
        toast.success("Disconnected Successfully.");
        router.push("/login");
    };

    const openEditSwapMode = (p: Participant, eventIdx: number) => {
        setEditingId(p._id);
        setIsEditSwap(true);
        const targetEvent = p.events[eventIdx];
        setOldEventName(targetEvent.eventName);

        setFormData({
            name: p.name,
            dno: p.dno,
            email: p.email,
            eventType: targetEvent?.eventType || "",
            eventName: targetEvent?.eventName || "",
        });
        setShowParticipantForm(true);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const tId = toast.loading("SYNCHRONIZING...");
        setSaving(true);
        const token = localStorage.getItem("token");

        const method = (editingId && isEditSwap) ? "PUT" : "POST";
        const payload = editingId
            ? { ...formData, participantId: editingId, oldEventName: isEditSwap ? oldEventName : undefined }
            : formData;

        try {
            const res = await fetch("/api/participants", {
                method,
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Operation failed");

            toast.success(isEditSwap ? "Event Swapped" : "Personnel Added", { id: tId });
            closeForm();
            fetchParticipants();
        } catch (err: any) {
            toast.error(err.message, { id: tId });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        const token = localStorage.getItem("token");
        const tId = toast.loading("REMOVING...");
        try {
            const res = await fetch(`/api/participants?id=${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                toast.success("Record Purged", { id: tId });
                fetchParticipants();
            } else {
                throw new Error("Failed");
            }
        } catch (err) {
            toast.error("Deletion Failed", { id: tId });
        }
    };

    const openAddEventMode = (p: Participant) => {
        setEditingId(p._id);
        setIsEditSwap(false);
        setFormData({
            name: p.name,
            dno: p.dno,
            email: p.email,
            eventType: "",
            eventName: "",
        });
        setShowParticipantForm(true);
    };

    const closeForm = () => {
        setShowParticipantForm(false);
        setEditingId(null);
        setIsEditSwap(false);
        setFormData({ name: "", dno: "", email: "", eventName: "", eventType: "" });
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
        <div className="min-h-screen bg-[#020202] text-zinc-300 relative selection:bg-red-600/30 pt-30">
            <Toaster
                position="bottom-right"
                toastOptions={{
                    style: {
                        background: '#050505', color: '#fff', border: '1px solid #18181b', fontSize: '10px',
                        fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em'
                    }
                }}
            />

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
                            onClick={() => { closeForm(); setShowParticipantForm(true); }}
                            className="px-6 py-3 bg-red-600 text-white font-bold uppercase text-[10px] tracking-widest skew-x-[-12deg] transition-all hover:bg-red-700 shadow-[0_0_15px_rgba(220,38,38,0.3)]"
                        >
                            <span className="inline-block skew-x-[12deg] flex items-center gap-2"><Plus size={14} /> Add Participant</span>
                        </button>
                        <button onClick={handleLogout} className="px-4 py-3 bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-red-500 transition-colors skew-x-[-12deg]">
                            <LogOut size={16} className="skew-x-[12deg]" />
                        </button>
                    </div>
                </header>

                {/* TEAM INFO BOXES */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
                    <div className="md:col-span-1 bg-zinc-900/30 border border-zinc-800 p-6 rounded-2xl flex flex-col items-center justify-center">
                        <User className="text-red-600 mb-3" size={40} />
                        <h2 className="text-lg font-black text-white uppercase italic text-center leading-tight">{user?.name}</h2>
                        <p className="text-red-600 font-mono text-[10px] tracking-tighter mt-1">ID: {user?.teamId}</p>
                    </div>
                    <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <InfoBox
                            label="Academy / Institution"
                            value={user?.college || "N/A"}
                            icon={<School className="w-6 h-6 text-red-600" />}
                        />
                        <InfoBox
                            label="Sector / Department"
                            value={user?.department || "N/A"}
                            icon={<ShieldCheck className="w-6 h-6 text-red-600" />}
                        />
                        <InfoBox
                            label="Comm-Link / Phone"
                            value={user?.phone || "N/A"}
                            icon={<Phone className="w-6 h-6 text-red-600" />}
                        />
                        <InfoBox
                            label="Digital Signature / Email"
                            value={user?.email || "N/A"}
                            icon={<Mail className="w-6 h-6 text-red-600" />}
                        />
                    </div>
                </div>

                {/* ROSTER */}
                <div className="bg-[#050505] border border-zinc-900 rounded-2xl shadow-2xl overflow-hidden mb-20">
                    <div className="px-6 py-6 border-b border-zinc-900 flex justify-between items-center">
                        <h3 className="text-white font-black uppercase tracking-widest text-xs flex items-center gap-2">
                            <Layers size={14} className="text-red-600" /> Crew Roster
                        </h3>
                        <div className="flex gap-4">
                            {["ALL", "TECHNICAL", "NON-TECHNICAL", "CULTURALS"].map((type) => (
                                <button key={type} onClick={() => setActiveFilter(type)} className={`text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === type ? "text-red-500" : "text-zinc-600 hover:text-zinc-400"}`}>
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-6">
                        <AnimatePresence mode="wait">
                            {loadingParticipants ? (
                                <p className="py-12 text-center text-zinc-600 font-mono text-xs animate-pulse">SYNCHRONIZING...</p>
                            ) : filteredParticipants.length === 0 ? (
                                <p className="py-12 text-center text-zinc-500 text-sm italic">No records found.</p>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    {filteredParticipants.map((p, i) => (
                                        <motion.div
                                            key={p._id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                            className="group flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-zinc-950 border border-zinc-900 rounded-xl hover:border-red-600/40 transition-all"
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-red-600/10 flex items-center justify-center text-red-600 font-black text-xs">{i + 1}</div>
                                                    <div>
                                                        <h4 className="text-white font-bold">{p.name}</h4>
                                                        <p className="text-[10px] font-mono text-zinc-500 uppercase">{p.dno}</p>
                                                        <p className="text-[10px] font-mono text-zinc-500 uppercase">{p.email}</p>
                                                    </div>
                                                </div>
                                                <div className="mt-4 flex flex-wrap gap-2">
                                                    {p.events.map((ev, idx) => (
                                                        <div key={idx} className="px-3 py-1 bg-black border border-zinc-800 rounded-md flex items-center gap-3">
                                                            <div className="flex flex-col">
                                                                <span className="text-[7px] text-zinc-600 font-bold uppercase">{ev.eventType}</span>
                                                                <span className="text-[10px] text-red-500 font-black uppercase">{ev.eventName}</span>
                                                            </div>
                                                            {p.paymentStatus !== "PAID" && (
                                                                <button onClick={() => openEditSwapMode(p, idx)} className="text-zinc-600 hover:text-white transition-colors"><Edit3 size={11} /></button>
                                                            )}
                                                        </div>
                                                    ))}
                                                    {p.events.length < 2 && p.paymentStatus !== "PAID" && (
                                                        <button onClick={() => openAddEventMode(p)} className="px-3 py-1 border border-dashed border-zinc-800 hover:border-red-600 text-zinc-600 hover:text-red-500 rounded-md text-[9px] font-black uppercase">+ ADD EVENT</button>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                {p.paymentStatus === "PAID" ? (
                                                    <div className="px-4 py-2 bg-green-500/5 border border-green-500/20 rounded-lg text-green-500 text-[9px] font-black uppercase tracking-widest flex items-center gap-2"><CheckCircle2 size={12} /> VERIFIED</div>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <button onClick={() => { setPayParticipant(p); setShowPaymentModal(true); }} className="px-6 py-2 bg-red-600 text-white font-black text-[10px] rounded-md hover:bg-red-700 transition-all uppercase">PAY ₹{p.paymentAmount}</button>

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

            {/* FORM MODAL */}
            <AnimatePresence>
                {showParticipantForm && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeForm} className="absolute inset-0 bg-black/95 backdrop-blur-md" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-[#050505] border border-red-600/30 rounded-2xl p-8 w-full max-w-lg shadow-[0_0_50px_rgba(220,38,38,0.1)]">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">{isEditSwap ? "SWAP" : "ADD"} <span className="text-red-600">EVENT_</span></h2>
                                    <p className="text-zinc-500 text-[10px] font-mono mt-1">{editingId ? "Updating Existing Roster" : "New Personnel Registry"}</p>
                                </div>
                                <button onClick={closeForm} className="p-2 hover:bg-zinc-900 rounded-full transition-colors"><X size={20} className="text-zinc-600 hover:text-white" /></button>
                            </div>

                            {/* Restriction Info */}
                            {editingId && (
                                <div className="mb-6 p-3 bg-red-600/5 border border-red-600/20 rounded-lg flex items-start gap-3">
                                    <AlertCircle size={16} className="text-red-600 mt-0.5" />
                                    <p className="text-[10px] leading-relaxed text-zinc-400 font-mono uppercase tracking-tighter">
                                        Sector Restricted to <span className="text-red-500">{allowedSectors.join(" & ")}</span> based on existing entry.
                                    </p>
                                </div>
                            )}

                            <form onSubmit={handleFormSubmit} className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-zinc-500 uppercase ml-1">Identity_Name</label>
                                        <input required placeholder="Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} disabled={!!editingId}
                                            className="w-full bg-zinc-900/50 border border-zinc-800 p-3 rounded-xl text-white outline-none focus:border-red-600 disabled:opacity-50" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-zinc-500 uppercase ml-1">Dept_No</label>
                                        <input required placeholder="DNO" value={formData.dno} onChange={e => setFormData({ ...formData, dno: e.target.value })} disabled={!!editingId}
                                            className="w-full bg-zinc-900/50 border border-zinc-800 p-3 rounded-xl text-white outline-none focus:border-red-600 disabled:opacity-50" />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-zinc-500 uppercase ml-1">Comm_Link (Email)</label>
                                    <input required type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} disabled={!!editingId}
                                        className="w-full bg-zinc-900/50 border border-zinc-800 p-3 rounded-xl text-white outline-none focus:border-red-600 disabled:opacity-50" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-zinc-500 uppercase ml-1">Sector</label>
                                        <select required value={formData.eventType} onChange={e => setFormData({ ...formData, eventType: e.target.value as any, eventName: "" })}
                                            className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-white outline-none focus:border-red-600 text-xs">
                                            <option value="">Select_Sector</option>
                                            {allowedSectors.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-zinc-500 uppercase ml-1">Operation</label>
                                        <select required value={formData.eventName} onChange={e => setFormData({ ...formData, eventName: e.target.value })} disabled={!formData.eventType}
                                            className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-white outline-none focus:border-red-600 text-xs disabled:opacity-30">
                                            <option value="">Select_Task</option>
                                            {filteredEventOptions.map(ev => <option key={ev._id} value={ev.eventName}>{ev.eventName}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <button type="submit" disabled={saving} className="w-full py-4 bg-red-600 text-white font-black uppercase text-xs rounded-xl hover:bg-red-700 transition-all shadow-[0_5px_15px_rgba(220,38,38,0.3)]">
                                    {saving ? "SYNCHRONIZING..." : isEditSwap ? "CONFIRM_SWAP" : "CONFIRM_REGISTRATION"}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* PAYMENT MODAL */}
            <AnimatePresence>
                {showPaymentModal && payParticipant && (
                    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPaymentModal(false)} className="absolute inset-0 bg-black/98 backdrop-blur-xl" />
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-[#050505] border border-red-600/20 rounded-3xl p-8 w-full max-w-sm text-center shadow-[0_0_50px_rgba(220,38,38,0.15)]">
                            <h2 className="text-xl font-black text-white uppercase tracking-widest mb-1 italic">SECURE <span className="text-red-600">PAYMENT_</span></h2>
                            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-6">Encrypted_Transaction_Channel</p>
                            <div className="bg-white p-4 rounded-2xl inline-block mb-6"><PaymentQR teamId={user?.teamId || "UNKNOWN"} email={payParticipant.email} amount={payParticipant.paymentAmount} /></div>
                            <div className="space-y-1 mb-8">
                                <p className="text-3xl font-black text-white tracking-tighter">₹{payParticipant.paymentAmount}</p>
                                <p className="text-zinc-500 text-[9px] uppercase font-bold tracking-widest">Payable For: {payParticipant.name}</p>
                            </div>
                            <a href={`upi://pay?pa=YOUR_UPI_ID@okaxis&pn=EVENT&am=${payParticipant.paymentAmount}&tn=REG_${user?.teamId}`} className="w-full py-4 mb-3 bg-white text-black font-black uppercase text-[10px] rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-200"><Zap size={14} fill="black" /> Open UPI Apps</a>
                            <button onClick={() => setShowPaymentModal(false)} className="w-full py-4 bg-zinc-900 text-zinc-400 font-black uppercase text-[10px] rounded-2xl border border-zinc-800">DISMISS_VOID</button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function InfoBox({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
    return (
        <div className="bg-zinc-900/10 border border-zinc-900 p-5 rounded-2xl relative overflow-hidden group hover:border-red-600/20 transition-all">
            <div className="absolute -right-2 -bottom-2 opacity-5 text-white group-hover:opacity-10 transition-opacity">{icon}</div>
            <p className="text-zinc-600 font-bold uppercase text-[9px] tracking-[0.2em] mb-1">{label}</p>
            <p className="text-white font-bold text-sm truncate tracking-tight">{value}</p>
        </div>
    );
}