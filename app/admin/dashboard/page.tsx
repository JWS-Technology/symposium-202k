"use client";

import { useRouter } from "next/navigation";

export default function AdminDashboard() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#020202] text-white p-10">
            <h1 className="text-4xl font-black text-red-600 mb-10 uppercase">
                Admin Control Panel
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
                <AdminButton
                    label="View Participants"
                    desc="All registered participants"
                    onClick={() => router.push("/admin/participants")}
                />

                <AdminButton
                    label="Verify Payments"
                    desc="Pending & paid transactions"
                    highlight
                    onClick={() => router.push("/admin/payments")}
                />

                <AdminButton
                    label="View Events"
                    desc="Manage symposium events"
                    onClick={() => router.push("/admin/events")}
                />
            </div>
        </div>
    );
}

function AdminButton({
    label,
    desc,
    onClick,
    highlight = false,
}: {
    label: string;
    desc: string;
    onClick: () => void;
    highlight?: boolean;
}) {
    return (
        <button
            onClick={onClick}
            className={`p-6 rounded-xl text-left transition-all border
                ${highlight
                    ? "bg-red-600/10 border-red-600 hover:bg-red-600 hover:text-black"
                    : "bg-[#050505] border-zinc-800 hover:border-red-600 hover:bg-[#0a0a0a]"
                }`}
        >
            <p className="font-black uppercase tracking-widest text-sm mb-2">
                {label}
            </p>
            <p className="text-xs text-zinc-400">{desc}</p>
        </button>
    );
}
