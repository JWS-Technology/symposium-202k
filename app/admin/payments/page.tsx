"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            router.push("/admin/login");
            return;
        }

        fetch("/api/admin/participants", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => setParticipants(data.participants))
            .finally(() => setLoading(false));
    }, [router]);

    const verifyPayment = async (id: string) => {
        const token = localStorage.getItem("adminToken");
        if (!token) return;

        setVerifyingId(id);

        const res = await fetch("/api/admin/verify-payment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ participantId: id }),
        });

        if (res.ok) {
            setParticipants(prev =>
                prev.map(p =>
                    p._id === id
                        ? { ...p, paymentStatus: "PAID" }
                        : p
                )
            );
        }

        setVerifyingId(null);
    };

    return (
        <div className="min-h-screen bg-[#020202] text-white p-10">
            <h1 className="text-3xl font-black text-red-600 uppercase mb-8">
                Payment Verification
            </h1>

            {loading ? (
                <p className="text-zinc-400">Loading payments...</p>
            ) : participants.length === 0 ? (
                <p className="text-zinc-500">No participants found.</p>
            ) : (
                <div className="space-y-4 max-w-5xl">
                    {participants.map(p => (
                        <div
                            key={p._id}
                            className="bg-[#050505] border border-zinc-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                        >
                            <div>
                                <p className="font-bold text-white">
                                    {p.name}
                                </p>
                                <p className="text-xs text-zinc-400">
                                    {p.email} • TEAM-{p.teamId}
                                </p>

                                <div className="mt-2 space-y-1">
                                    {p.events.map((ev, i) => (
                                        <p
                                            key={i}
                                            className="text-[10px] font-mono uppercase tracking-widest text-red-500"
                                        >
                                            {ev.eventName} ({ev.eventType})
                                        </p>
                                    ))}
                                </div>
                            </div>

                            <div className="text-right space-y-2">
                                <p className="font-bold">
                                    ₹{p.paymentAmount}
                                </p>

                                {p.paymentStatus === "PAID" ? (
                                    <span className="inline-block px-3 py-1 text-xs font-bold rounded bg-green-600/20 text-green-400">
                                        PAID
                                    </span>
                                ) : (
                                    <button
                                        disabled={verifyingId === p._id}
                                        onClick={() => verifyPayment(p._id)}
                                        className="px-4 py-1 text-xs font-bold rounded bg-red-600 hover:bg-red-500 transition"
                                    >
                                        {verifyingId === p._id
                                            ? "Verifying..."
                                            : "Mark as Paid"}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
