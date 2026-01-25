"use client";

import { useRouter } from "next/navigation";

export default function AdminDashboard() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#020202] text-white p-10">
            <h1 className="text-4xl font-black text-red-600 mb-10 uppercase">
                Admin Control Panel
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
                <AdminButton
                    label="View Participants"
                    onClick={() => router.push("/admin/participants")}
                />

                <AdminButton
                    label="View Events"
                    onClick={() => router.push("/admin/events")}
                />
            </div>
        </div>
    );
}

function AdminButton({
    label,
    onClick,
}: {
    label: string;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className="bg-[#050505] border border-red-600/40 hover:bg-red-600 hover:text-black transition-all p-6 rounded-xl text-left font-bold uppercase tracking-widest"
        >
            {label}
        </button>
    );
}
