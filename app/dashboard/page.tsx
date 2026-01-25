"use client";

import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    User,
    School,
    BookOpen,
    Phone,
    Mail,
    LogOut,
    ShieldAlert,
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
    events: any;
    paymentStatus: string;
    paymentAmount: ReactNode;
    _id: string;
    name: string;
    dno: string;
    email: string;
    event: string;
    eventType: string;
    createdAt: string;
}

interface EventItem {
    _id: string;
    eventName: string;
    minPlayers: number;
    maxPlayers: number;
    eventType: "TECHNICAL" | "NON-TECHNICAL" | "CULTURALS";
}

/* ================= COMPONENT ================= */

export default function DashboardPage() {
    const router = useRouter();

    const [user, setUser] = useState<UserData | null>(null);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [events, setEvents] = useState<EventItem[]>([]);

    const [loading, setLoading] = useState(true);
    const [loadingParticipants, setLoadingParticipants] = useState(true);
    const [loadingEvents, setLoadingEvents] = useState(true);

    const [showParticipantForm, setShowParticipantForm] = useState(false);
    const [saving, setSaving] = useState(false);
    // payment modal states
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [payParticipant, setPayParticipant] = useState<any>(null);


    const [participant, setParticipant] = useState({
        name: "",
        dno: "",
        email: "",
        event: "",
        eventType: "",
    });

    const groupedEvents = {
        TECHNICAL: events.filter(e => e.eventType === "TECHNICAL"),
        "NON-TECHNICAL": events.filter(e => e.eventType === "NON-TECHNICAL"),
        CULTURALS: events.filter(e => e.eventType === "CULTURALS"),
    };


    /* ================= AUTH + FETCH ================= */

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        const init = async () => {
            try {
                // Fetch user
                const userRes = await fetch("/api/auth/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });
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
        if (!token) return;

        try {
            const res = await fetch("/api/fetch-participants", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error();

            const data = await res.json();
            setParticipants(data.participants);
        } catch {
            console.error("Failed to fetch participants");
        } finally {
            setLoadingParticipants(false);
        }
    };

    const fetchEvents = async () => {
        try {
            const res = await fetch("/api/events-fetch");
            if (!res.ok) throw new Error();

            const data = await res.json();
            setEvents(data.data);
        } catch {
            console.error("Failed to fetch events");
        } finally {
            setLoadingEvents(false);
        }
    };

    /* ================= ACTIONS ================= */

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    const handleAddParticipant = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !participant.name ||
            !participant.dno ||
            !participant.email ||
            !participant.eventType ||
            !participant.event
        ) {
            alert("Please fill all participant fields");
            return;
        }


        setSaving(true);
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("/api/participants", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(participant),
        });

        let data: any = null;
        try {
            data = await res.json();
        } catch { }

        setSaving(false);

        if (!res.ok) {
            alert(data?.message || "Failed to add participant");
            return;
        }

        setParticipant({
            name: "",
            dno: "",
            email: "",
            event: "",
            eventType: "",
        });

        // setShowParticipantForm(false);
        fetchParticipants();
        // ✅ MOVE TO PAYMENT STEP
        // setCreatedParticipant(data.participant);
        // setPaymentStep("PAYMENT");
    };

    /* ================= LOADING ================= */

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-red-600 font-mono text-xs tracking-[0.5em] animate-pulse">
                        SYNCHRONIZING_DNA...
                    </p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    /* ================= UI ================= */

    return (
        <div className="min-h-screen bg-[#020202] text-zinc-300 overflow-hidden relative">
            <div className="max-w-5xl mx-auto px-6 py-12 relative z-10">

                {/* HEADER */}
                <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <div className="flex items-center gap-3 mb-2">
                            <ShieldAlert className="text-red-600 w-5 h-5 animate-pulse" />
                            <span className="text-red-600 font-mono text-[10px] tracking-[0.4em] uppercase">
                                Security_Level: Authorized
                            </span>
                        </div>
                        <h1 className="text-5xl font-black italic text-white uppercase tracking-tighter">
                            Team <span className="text-red-600">Dashboard_</span>
                        </h1>
                    </motion.div>

                    <div className="flex items-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowParticipantForm(true)}
                            className="px-6 py-3 bg-red-600/10 border border-red-600/40 text-red-500 hover:bg-red-600 hover:text-white transition-all font-bold uppercase text-[10px] tracking-widest skew-x-[-12deg]"
                        >
                            <span className="skew-x-[12deg]">+ Add Participant</span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-6 py-3 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-red-500 hover:border-red-600/50 transition-all font-bold uppercase text-[10px] tracking-widest skew-x-[-12deg]"
                        >
                            <LogOut size={14} className="skew-x-[12deg]" />
                            <span className="skew-x-[12deg]">Logout</span>
                        </motion.button>
                    </div>
                </header>

                {/* INFO */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="bg-[#050505] rounded-2xl p-8 flex flex-col items-center text-center">
                            <User size={64} className="text-zinc-700 mb-4" />
                            <h2 className="text-2xl font-black text-white italic uppercase mb-1">
                                {user.name}
                            </h2>
                            <p className="text-red-600 font-mono text-[11px] tracking-[0.4em] uppercase">
                                Team_ID : {user.teamId}
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                        <InfoBox label="Email Address" value={user.email} icon={<Mail />} />
                        <InfoBox label="Comm-Link" value={user.phone} icon={<Phone />} />
                        <InfoBox label="Academy" value={user.college} icon={<School />} />
                        <InfoBox
                            label="Registered On"
                            value={new Date(user.createdAt).toLocaleDateString()}
                            icon={<BookOpen />}
                        />
                    </motion.div>
                </div>

                {/* PAYMENT MODAL */}
                {showPaymentModal && payParticipant && (
                    <div className="fixed inset-0 z-[300] bg-black/80 flex items-center justify-center">
                        <div className="bg-[#050505] border border-red-600/30 rounded-2xl p-8 w-full max-w-md">

                            <h2 className="text-white font-black uppercase tracking-widest mb-4 text-sm">
                                Complete Payment
                            </h2>

                            <PaymentQR
                                teamId={user.teamId}
                                email={payParticipant.email}
                                amount={payParticipant.paymentAmount}
                            />

                            <p className="text-xs text-zinc-400 text-center mt-4">
                                After payment, admin will verify and confirmation will be sent by email.
                            </p>

                            <div className="flex justify-center mt-6">
                                <button
                                    onClick={() => {
                                        setShowPaymentModal(false);
                                        setPayParticipant(null);
                                    }}
                                    className="px-6 py-2 bg-red-600 text-white font-bold rounded"
                                >
                                    Close
                                </button>
                            </div>

                        </div>
                    </div>
                )}


                {/* PARTICIPANTS */}
                <div className="mt-12 bg-[#050505] border border-zinc-900 rounded-2xl p-6">
                    <h3 className="text-red-600 font-black uppercase tracking-[0.3em] text-xs mb-6">
                        Registered Participants
                    </h3>

                    {loadingParticipants ? (
                        <p className="text-zinc-500 text-sm">Loading participants...</p>
                    ) : participants.length === 0 ? (
                        <p className="text-zinc-500 text-sm">No participants added yet.</p>
                    ) : (
                        <div className="space-y-4">
                            {participants.map((p, i) => (
                                <div
                                    key={p._id}
                                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border border-zinc-800 rounded-xl p-4 hover:border-red-600/40 transition-all"
                                >
                                    <div>
                                        <p className="text-white font-bold">
                                            {i + 1}. {p.name}
                                        </p>
                                        <p className="text-xs text-zinc-500">
                                            {p.email} • {p.dno}
                                        </p>

                                        <div className="mt-1 space-y-1">
                                            {p.events.map((ev: { eventName: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; eventType: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }, idx: Key | null | undefined) => (
                                                <p key={idx} className="text-[10px] font-mono uppercase tracking-widest text-red-500">
                                                    {ev.eventName} ({ev.eventType})
                                                </p>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="text-right space-y-2">
                                        {p.paymentStatus === "PAID" ? (
                                            <span className="px-3 py-1 text-xs font-bold rounded bg-green-600/20 text-green-400">
                                                PAID
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    setPayParticipant(p);
                                                    setShowPaymentModal(true);
                                                }}
                                                className="px-4 py-1 text-xs bg-red-600 text-white rounded font-bold"
                                            >
                                                Pay ₹{p.paymentAmount}
                                            </button>

                                        )}

                                    </div>
                                </div>
                            ))}

                        </div>
                    )}
                </div>
            </div>

            {/* ADD PARTICIPANT MODAL */}
            {showParticipantForm && (
                <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center">
                    <div className="bg-[#050505] border border-red-600/30 rounded-2xl p-8 w-full max-w-md">
                        <h2 className="text-white font-black uppercase tracking-widest mb-6 text-sm">
                            Add Participant
                        </h2>

                        <form onSubmit={handleAddParticipant} className="space-y-4">
                            {/* Name */}
                            <input
                                placeholder="Name"
                                value={participant.name}
                                onChange={e => setParticipant({ ...participant, name: e.target.value })}
                                className="w-full bg-black border border-zinc-800 p-3 rounded text-white"
                            />

                            {/* D.No */}
                            <input
                                placeholder="D.No"
                                value={participant.dno}
                                onChange={e => setParticipant({ ...participant, dno: e.target.value })}
                                className="w-full bg-black border border-zinc-800 p-3 rounded text-white"
                            />

                            {/* Email */}
                            <input
                                placeholder="Email"
                                value={participant.email}
                                onChange={e => setParticipant({ ...participant, email: e.target.value })}
                                className="w-full bg-black border border-zinc-800 p-3 rounded text-white"
                            />

                            {/* Event Type */}
                            <select
                                value={participant.eventType}
                                onChange={e =>
                                    setParticipant({
                                        ...participant,
                                        eventType: e.target.value,
                                        event: "",
                                    })
                                }
                                className="w-full bg-black border border-zinc-800 p-3 rounded text-white"
                            >
                                <option value="">Select Event Type</option>
                                <option value="TECHNICAL">TECHNICAL</option>
                                <option value="NON-TECHNICAL">NON-TECHNICAL</option>
                                <option value="CULTURALS">CULTURALS</option>
                            </select>

                            {/* Event Name */}
                            <select
                                value={participant.event}
                                onChange={e => setParticipant({ ...participant, event: e.target.value })}
                                disabled={!participant.eventType}
                                className="w-full bg-black border border-zinc-800 p-3 rounded text-white"
                            >
                                <option value="">
                                    {!participant.eventType
                                        ? "Select Event Type first"
                                        : "Select Event"}
                                </option>

                                {events
                                    .filter(ev => ev.eventType === participant.eventType)
                                    .map(ev => (
                                        <option key={ev._id} value={ev.eventName}>
                                            {ev.eventName}
                                        </option>
                                    ))}
                            </select>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowParticipantForm(false)}
                                    className="px-4 py-2 text-zinc-400 hover:text-white"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-6 py-2 bg-red-600 text-white font-bold rounded"
                                >
                                    {saving ? "Saving..." : "Add Participant"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}



            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-20" />
        </div>
    );
}

/* ================= SMALL COMPONENT ================= */

function InfoBox({
    label,
    value,
    icon,
}: {
    label: string;
    value: string;
    icon: React.ReactNode;
}) {
    return (
        <div className="bg-[#050505] border border-zinc-900 p-6 rounded-2xl relative">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-red-600">{icon}</div>
            <p className="text-zinc-600 font-black uppercase text-[9px] tracking-[0.2em] mb-1">
                {label}
            </p>
            <p className="text-white font-bold tracking-tight break-words">{value}</p>
        </div>
    );
}
