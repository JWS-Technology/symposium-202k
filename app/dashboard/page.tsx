"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, School, BookOpen, Phone, Mail, LogOut, ShieldAlert, Activity } from "lucide-react";

interface UserData {
    teamId: string;
    name: string;
    email: string;
    phone: string;
    department: string;
    college: string;
    createdAt: string;
}

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        const fetchUser = async () => {
            try {
                const res = await fetch("/api/auth/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error();
                const data = await res.json();
                setUser(data.user);
            } catch (err) {
                localStorage.removeItem("token");
                router.push("/login");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-red-600 font-mono text-xs tracking-[0.5em] animate-pulse">SYNCHRONIZING_DNA...</p>
            </div>
        </div>
    );

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#020202] text-zinc-300 font-sans selection:bg-red-600 selection:text-white overflow-hidden relative">

            {/* BACKGROUND TECH ELEMENTS */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(185,28,28,0.08),transparent)] pointer-events-none" />
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />

            <div className="max-w-5xl mx-auto px-6 py-12 relative z-10">

                {/* HEADER SECTION */}
                <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <ShieldAlert className="text-red-600 w-5 h-5 animate-pulse" />
                            <span className="text-red-600 font-mono text-[10px] tracking-[0.4em] uppercase">Security_Level: Authorized</span>
                        </div>
                        <h1 className="text-5xl font-black italic text-white uppercase tracking-tighter">
                            Team <span className="text-red-600">Dashboard_</span>
                        </h1>
                    </motion.div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-6 py-3 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-red-500 hover:border-red-600/50 transition-all font-bold uppercase text-[10px] tracking-widest skew-x-[-12deg]"
                    >
                        <LogOut size={14} className="skew-x-[12deg]" />
                        <span className="skew-x-[12deg]">Logout</span>
                    </motion.button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT COLUMN: IDENTITY CARD */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-1"
                    >
                        <div className="relative p-[1px] bg-gradient-to-b from-red-600/50 to-transparent rounded-2xl overflow-hidden">
                            <div className="bg-[#050505] rounded-2xl p-8 flex flex-col items-center text-center">

                                {/* PROFILE IMAGE AREA */}
                                <div className="w-32 h-32 rounded-full border-2 border-red-600 p-2 mb-6 relative">
                                    <div className="absolute inset-0 border-t-2 border-white rounded-full animate-spin-slow opacity-30" />
                                    <div className="w-full h-full bg-zinc-900 rounded-full flex items-center justify-center overflow-hidden border border-zinc-800">
                                        <User size={48} className="text-zinc-700" />
                                    </div>
                                </div>

                                {/* IDENTITY TEXT */}
                                <h2 className="text-2xl font-black text-white italic uppercase mb-1">{user.name}</h2>

                                {/* TEAM ID SECTION - STYLIZED */}
                                <div className="relative group cursor-default">
                                    <div className="absolute -inset-1 bg-red-600/20 blur opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <p className="relative text-red-600 font-mono text-[11px] tracking-[0.4em] uppercase font-black bg-red-600/5 px-3 py-1 border border-red-600/20 rounded">
                                        Team_ID : {user.teamId}
                                    </p>
                                </div>

                                {/* STATUS DATA */}
                                <div className="w-full space-y-3 pt-6 mt-6 border-t border-zinc-900">
                                    <div className="flex items-center justify-between text-xs font-mono">
                                        <span className="text-zinc-600 uppercase font-black tracking-tighter">Status</span>
                                        <span className="flex items-center gap-1.5 text-green-500 font-bold">
                                            <Activity size={12} className="animate-pulse" /> Active
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs font-mono">
                                        <span className="text-zinc-600 uppercase font-black tracking-tighter">Universe</span>
                                        <span className="text-zinc-300 font-bold">E-616</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs font-mono">
                                        <span className="text-zinc-600 uppercase font-black tracking-tighter">Sector_Key</span>
                                        <span className="text-zinc-300 font-bold opacity-50">#{user.teamId?.slice(0, 4)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* RIGHT COLUMN: CORE DATA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-2 space-y-6"
                    >
                        {/* DATA GRID */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoBox label="Email Address" value={user.email} icon={<Mail />} />
                            <InfoBox label="Comm-Link" value={user.phone} icon={<Phone />} />
                            <InfoBox label="Academy" value={user.college} icon={<School />} />
                            <InfoBox label="Department" value={user.department} icon={<BookOpen />} />
                        </div>

                        {/* BOTTOM FOOTER TECH */}
                        <div className="relative group overflow-hidden border border-zinc-800 p-8 rounded-2xl bg-[#050505] flex items-center justify-between transition-all hover:border-red-600/30">
                            <div className="relative z-10">
                                <p className="text-red-600 font-mono text-[10px] tracking-[0.3em] uppercase mb-2">Registration_Stamp</p>
                                <p className="text-zinc-400 text-sm italic">Access granted on <span className="text-white font-bold">{new Date(user.createdAt).toLocaleDateString()}</span></p>
                            </div>
                            <div className="opacity-10 group-hover:opacity-20 transition-opacity">
                                <ShieldAlert size={64} className="text-red-600" />
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>

            {/* CRT OVERLAY EFFECT */}
            <div className="absolute inset-0 pointer-events-none z-[100] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-20" />
        </div>
    );
}

function InfoBox({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
    return (
        <div className="bg-[#050505] border border-zinc-900 p-6 rounded-2xl group hover:border-red-600/40 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity text-red-600">
                {icon}
            </div>
            <p className="text-zinc-600 font-black uppercase text-[9px] tracking-[0.2em] mb-1">{label}</p>
            <p className="text-white font-bold tracking-tight break-words">{value}</p>
        </div>
    );
}