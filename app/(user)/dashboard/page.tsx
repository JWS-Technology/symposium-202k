"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
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
    ShieldCheck,
    Info,
    HelpCircle,
    Sun,
    Moon
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

interface FormInputProps {
    label: string;
    value: string;
    onChange: (val: string) => void;
    theme: "dark" | "light";
    type?: string;
    disabled?: boolean;
}

export default function DashboardPage() {
    const router = useRouter();

    /* ================= STATES ================= */
    const [theme, setTheme] = useState<"dark" | "light">("dark");
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

    /* ================= THEME TOGGLE ================= */
    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        document.documentElement.classList.toggle("dark", newTheme === "dark");
    };

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
    const allowedSectors = useMemo(() => {
        const p = participants.find(part => part._id === editingId);

        // If brand new participant, allow everything
        if (!editingId || !p || p.events.length === 0) {
            return ["TECHNICAL", "NON-TECHNICAL", "CULTURALS"];
        }

        // Identify the "Anchor" event (the one they are NOT currently changing)
        const anchorEvent = isEditSwap
            ? p.events.find(ev => ev.eventName !== oldEventName)
            : p.events[0];

        if (!anchorEvent) return ["TECHNICAL", "NON-TECHNICAL", "CULTURALS"];

        // 1. Cultural Firewall
        if (anchorEvent.eventType === "CULTURALS") {
            return ["CULTURALS"];
        }

        // 2. Technical vs Non-Technical Toggle Logic
        // If Slot 1 is Technical -> Slot 2 must be Non-Technical
        // If Slot 1 is Non-Technical -> Slot 2 must be Technical
        return anchorEvent.eventType === "TECHNICAL" ? ["NON-TECHNICAL"] : ["TECHNICAL"];
    }, [editingId, participants, isEditSwap, oldEventName]);

    const filteredEventOptions = useMemo(() => {
        if (!formData.eventType) return [];
        let options = events.filter(ev => ev.eventType === formData.eventType);
        if (editingId) {
            const p = participants.find(part => part._id === editingId);
            const currentEventNames = p?.events.map(e => e.eventName) || [];
            options = options.filter(ev => {
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
        const payload = editingId ? { ...formData, participantId: editingId, oldEventName: isEditSwap ? oldEventName : undefined } : formData;

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

    const openAddEventMode = (p: Participant) => {
        setEditingId(p._id);
        setIsEditSwap(false);
        setFormData({ name: p.name, dno: p.dno, email: p.email, eventType: "", eventName: "" });
        setShowParticipantForm(true);
    };

    const closeForm = () => {
        setShowParticipantForm(false);
        setEditingId(null);
        setIsEditSwap(false);
        setFormData({ name: "", dno: "", email: "", eventName: "", eventType: "" });
    };

    if (loading) return (
        <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${theme === 'dark' ? 'bg-black' : 'bg-zinc-50'}`}>
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-red-600 font-mono text-[10px] tracking-widest animate-pulse">AUTHORIZING_ACCESS...</p>
            </div>
        </div>
    );

    return (
        <div className={`min-h-screen transition-colors duration-500 selection:bg-red-600/30 pt-10 ${theme === 'dark' ? 'bg-[#020202] text-zinc-300' : 'bg-white text-zinc-800'}`}>
            <Toaster
                position="bottom-right"
                toastOptions={{
                    style: {
                        background: theme === 'dark' ? '#050505' : '#fff',
                        color: theme === 'dark' ? '#fff' : '#000',
                        border: `1px solid ${theme === 'dark' ? '#18181b' : '#e4e4e7'}`,
                        fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em'
                    }
                }}
            />

            <button
                onClick={toggleTheme}
                className={`fixed top-6 right-6 z-[100] flex items-center gap-2 p-3 rounded-full border transition-all shadow-lg active:scale-95 ${theme === 'dark'
                    ? 'bg-zinc-900 border-zinc-800 text-yellow-500 hover:bg-zinc-800'
                    : 'bg-white border-zinc-200 text-indigo-600 hover:bg-zinc-50'
                    }`}
            >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                <span className="hidden md:inline text-[10px] font-black uppercase tracking-widest">
                    {theme === 'dark' ? "Light Mode" : "Dark Mode"}
                </span>
            </button>
            <div className="max-w-5xl mx-auto px-6 py-12 relative z-10">
                <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <ShieldAlert className="text-red-600 w-4 h-4 animate-pulse" />
                            <span className="text-red-600 font-mono text-[10px] tracking-[0.4em] uppercase">Powered by JWS Technologies</span>
                        </div>
                        <h1 className={`text-5xl font-black italic uppercase tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
                            TEAM <span className="text-red-600">DASHBOARD_</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => { closeForm(); setShowParticipantForm(true); }}
                            className="px-6 py-3 bg-red-600 text-white font-bold uppercase text-[10px] tracking-widest skew-x-[-12deg] transition-all hover:bg-red-700 shadow-[0_0_15px_rgba(220,38,38,0.3)]"
                        >
                            <span className="flex items-center gap-2"><Plus size={14} /> Add Participant</span>
                        </button>
                        <button onClick={handleLogout} className={`px-5 py-3 flex gap-2 items-center border transition-colors skew-x-[-12deg] ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-red-500' : 'bg-zinc-100 border-zinc-200 text-zinc-600 hover:text-red-600'}`}>
                            <LogOut size={16} className="skew-x-[12deg]" /> Logout
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
                    <div className={`md:col-span-1 border p-6 rounded-2xl flex flex-col items-center justify-center ${theme === 'dark' ? 'bg-zinc-900/30 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                        <User className="text-red-600 mb-3" size={40} />
                        <h2 className={`text-lg font-black uppercase italic text-center leading-tight ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>{user?.name}</h2>
                        <p className="text-red-600 font-mono text-[10px] tracking-tighter mt-1">ID: {user?.teamId}</p>
                    </div>
                    <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <InfoBox theme={theme} label="Institution" value={user?.college || "N/A"} icon={<School className="w-6 h-6 text-red-600" />} />
                        <InfoBox theme={theme} label="Department" value={user?.department || "N/A"} icon={<ShieldCheck className="w-6 h-6 text-red-600" />} />
                        <InfoBox theme={theme} label="Phone" value={"+91 " + (user?.phone || "N/A")} icon={<Phone className="w-6 h-6 text-red-600" />} />
                        <InfoBox theme={theme} label="Email" value={user?.email || "N/A"} icon={<Mail className="w-6 h-6 text-red-600" />} />
                    </div>
                </div>

                <div className={`border rounded-2xl shadow-2xl overflow-hidden mb-20 ${theme === 'dark' ? 'bg-[#050505] border-zinc-900' : 'bg-white border-zinc-200'}`}>
                    <div className={`px-6 py-6 border-b flex justify-between items-center ${theme === 'dark' ? 'border-zinc-900' : 'border-zinc-100'}`}>
                        <h3 className={`font-black uppercase tracking-widest text-xs flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
                            <Layers size={14} className="text-red-600" /> Participants View
                        </h3>
                        <div className="flex gap-4">
                            {["ALL", "TECHNICAL", "NON-TECHNICAL", "CULTURALS"].map((type) => (
                                <button key={type} onClick={() => setActiveFilter(type)} className={`text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === type ? "text-red-500" : "text-zinc-400 hover:text-zinc-600"}`}>
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
                                            className={`group flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 border rounded-xl transition-all ${theme === 'dark' ? 'bg-zinc-950 border-zinc-900 hover:border-red-600/40' : 'bg-zinc-50/50 border-zinc-100 hover:border-red-600/40'}`}
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-red-600/10 flex items-center justify-center text-red-600 font-black text-xs">{i + 1}</div>
                                                    <div>
                                                        <h4 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>{p.name}</h4>
                                                        <p className="text-[10px] font-mono text-zinc-500 uppercase">{p.dno}</p>
                                                        <p className="text-[10px] font-mono text-zinc-500 uppercase">{p.email}</p>
                                                    </div>
                                                </div>
                                                <div className="mt-4 flex flex-wrap gap-2">
                                                    {p.events.map((ev, idx) => (
                                                        <div key={idx} className={`px-3 py-1 border rounded-md flex items-center gap-3 ${theme === 'dark' ? 'bg-black border-zinc-800' : 'bg-white border-zinc-200'}`}>
                                                            <div className="flex flex-col">
                                                                <span className="text-[7px] text-zinc-600 font-bold uppercase">{ev.eventType}</span>
                                                                <span className="text-[10px] text-red-500 font-black uppercase">{ev.eventName}</span>
                                                            </div>
                                                            {p.paymentStatus !== "PAID" && (
                                                                <button onClick={() => openEditSwapMode(p, idx)} className="text-zinc-600 hover:text-red-500 transition-colors"><Edit3 size={10} /></button>
                                                            )}
                                                        </div>
                                                    ))}
                                                    {p.events.length < 2 && p.paymentStatus !== "PAID" && (
                                                        <button onClick={() => openAddEventMode(p)} className="px-3 py-1 border border-dashed border-zinc-300 hover:border-red-600 text-zinc-600 hover:text-red-500 rounded-md text-[9px] font-black uppercase">+ Assign Event</button>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                {p.paymentStatus === "PAID" ? (
                                                    <div className="px-4 py-2 bg-green-500/5 border border-green-500/20 rounded-lg text-green-500 text-[9px] font-black uppercase tracking-widest flex items-center gap-2"><CheckCircle2 size={12} /> VERIFIED</div>
                                                ) : (
                                                    <button onClick={() => { setPayParticipant(p); setShowPaymentModal(true); }} className="px-6 py-2 bg-red-600 text-white font-black text-[10px] rounded-md hover:bg-red-700 transition-all uppercase">PAY ₹{p.paymentAmount}</button>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <section className={`mt-20 mb-10 border-t pt-10 ${theme === 'dark' ? 'border-zinc-900' : 'border-zinc-100'}`}>
                    <div className="flex items-center gap-2 mb-6">
                        <HelpCircle size={16} className="text-red-600" />
                        <h3 className={`font-black uppercase tracking-[0.2em] text-[10px] ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>Registration_Guide</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <GuideCard theme={theme} step="01" title="Deployment" text="Press the 'Add Participant' button to initialize a new record." />
                        <GuideCard theme={theme} step="02" title="Verification" text="Trigger the 'Pay' button to generate a secure QR code for verification." />
                    </div>
                </section>
            </div>

            <AnimatePresence>
                {showParticipantForm && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeForm} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className={`relative border rounded-2xl p-8 w-full max-w-lg shadow-2xl ${theme === 'dark' ? 'bg-[#050505] border-red-600/30' : 'bg-white border-zinc-200'}`}>
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className={`text-2xl font-black uppercase italic tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>{isEditSwap ? "SWAP" : "ADD"} <span className="text-red-600">PARTICIPANT_</span></h2>
                                </div>
                                <button onClick={closeForm} className="p-2 hover:bg-zinc-100 rounded-full transition-colors"><X size={20} className="text-zinc-400 hover:text-red-600" /></button>
                            </div>

                            <form onSubmit={handleFormSubmit} className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <FormInput
                                        label="Participant_Name"
                                        value={formData.name}
                                        onChange={(v: string) => setFormData({ ...formData, name: v })}
                                        theme={theme}
                                        disabled={!!editingId}
                                    />
                                    <FormInput
                                        label="Roll_No"
                                        value={formData.dno}
                                        onChange={(v: string) => setFormData({ ...formData, dno: v })}
                                        theme={theme}
                                        disabled={!!editingId}
                                    />
                                </div>
                                <FormInput
                                    label="Email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(v: string) => setFormData({ ...formData, email: v })}
                                    theme={theme}
                                    disabled={!!editingId}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-zinc-500 uppercase ml-1">Event Category</label>
                                        <select required value={formData.eventType} onChange={e => setFormData({ ...formData, eventType: e.target.value as any, eventName: "" })}
                                            className={`w-full border p-3 rounded-xl outline-none focus:border-red-600 text-xs ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'}`}>
                                            <option value="">Select_Category</option>
                                            {allowedSectors.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-zinc-500 uppercase ml-1">Events</label>
                                        <select required value={formData.eventName} onChange={e => setFormData({ ...formData, eventName: e.target.value })} disabled={!formData.eventType}
                                            className={`w-full border p-3 rounded-xl outline-none focus:border-red-600 text-xs disabled:opacity-30 ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'}`}>
                                            <option value="">Select_Events</option>
                                            {filteredEventOptions.map(ev => <option key={ev._id} value={ev.eventName}>{ev.eventName}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <button type="submit" disabled={saving} className="w-full py-4 bg-red-600 text-white font-black uppercase text-xs rounded-xl hover:bg-red-700 transition-all">
                                    {saving ? "SYNCHRONIZING..." : isEditSwap ? "CONFIRM_SWAP" : "CONFIRM_REGISTRATION"}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showPaymentModal && payParticipant && (
                    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPaymentModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9 }}
                            className={`relative border rounded-3xl p-8 w-full max-w-sm text-center ${theme === 'dark' ? 'bg-[#050505] border-red-600/20' : 'bg-white border-zinc-200'}`}>
                            <h2 className={`text-xl font-black uppercase mb-1 italic ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>SCAN <span className="text-red-600">QR Code_</span></h2>
                            <div className="bg-white p-4 rounded-2xl inline-block my-6 shadow-xl">
                                <PaymentQR teamId={user?.teamId || "UNKNOWN"} email={payParticipant.email} amount={payParticipant.paymentAmount} />
                            </div>
                            <p className={`text-3xl font-black mb-8 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>₹{payParticipant.paymentAmount}</p>
                            <a href={`upi://pay?pa=YOUR_UPI_ID@okaxis&pn=EVENT&am=${payParticipant.paymentAmount}`} className="w-full py-4 bg-red-600 text-white font-black uppercase text-[10px] rounded-2xl flex items-center justify-center gap-2 hover:bg-red-700 transition-colors">
                                <Zap size={14} fill="white" /> Open UPI Apps
                            </a>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

/* ================= HELPER COMPONENTS ================= */

function InfoBox({ label, value, icon, theme }: { label: string; value: string; icon: React.ReactNode; theme: string }) {
    return (
        <div className={`border p-5 rounded-2xl relative overflow-hidden group transition-all ${theme === 'dark' ? 'bg-zinc-900/10 border-zinc-900 hover:border-red-600/20' : 'bg-zinc-50 border-zinc-200 hover:border-red-600/20'}`}>
            <div className="absolute -right-2 -bottom-2 opacity-5 text-white group-hover:opacity-10 transition-opacity">{icon}</div>
            <p className="text-zinc-500 font-bold uppercase text-[9px] tracking-[0.2em] mb-1">{label}</p>
            <p className={`font-bold text-sm tracking-tight ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>{value}</p>
        </div>
    );
}

function GuideCard({ step, title, text, theme }: { step: string; title: string; text: string; theme: string }) {
    return (
        <div className={`border p-5 rounded-2xl group transition-colors ${theme === 'dark' ? 'bg-zinc-950 border-zinc-900' : 'bg-zinc-50 border-zinc-200'}`}>
            <div className="flex items-center gap-3 mb-3">
                <div className="w-6 h-6 rounded bg-red-600/10 flex items-center justify-center text-red-600 text-[10px] font-black">{step}</div>
                <h4 className={`font-bold text-xs uppercase tracking-wider ${theme === 'dark' ? 'text-zinc-200' : 'text-zinc-800'}`}>{title}</h4>
            </div>
            <p className="text-zinc-500 text-[11px] leading-relaxed font-mono uppercase">{text}</p>
        </div>
    );
}

function FormInput({ label, value, onChange, theme, type = "text", disabled = false }: FormInputProps) {
    return (
        <div className="space-y-1">
            <label className="text-[9px] font-black text-zinc-500 uppercase ml-1">{label}</label>
            <input
                required
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                disabled={disabled}
                className={`w-full border p-3 rounded-xl outline-none focus:border-red-600 disabled:opacity-50 ${theme === 'dark' ? 'bg-zinc-900/50 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'}`}
            />
        </div>
    );
}