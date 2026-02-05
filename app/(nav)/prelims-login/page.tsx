// app/(prelims)/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserSecret, FaFingerprint, FaShieldAlt, FaTerminal, FaIdCard } from "react-icons/fa";

export default function PrelimsLogin() {
    const router = useRouter();
    const [form, setForm] = useState({ name: "", email: "", password: "" }); // password = teamId
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/prelims/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("prelims_token", data.token);

                // 🛡️ CRITICAL: The API returns "registeredEvents", so use data.participant.registeredEvents
                localStorage.setItem("participant_events", JSON.stringify(data.participant.registeredEvents));

                localStorage.setItem("participant_data", JSON.stringify({
                    name: data.participant.name
                }));

                router.push("/test/select-event");
            }

            // 🏁 Use window.location.href for a "hard" redirect if router.push fails
            // Or stick to router.push but ensure the path is absolute
            router.replace("/test/select-event");

        } catch (err: any) {
            setError(err.message || "Connection Interrupted");
            setIsLoading(false);
        }


    };


    return (
        <div className="flex min-h-screen items-center justify-center bg-[#020202] text-white">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-md p-6">
                <form onSubmit={handleSubmit} className="bg-zinc-950 border border-zinc-800 p-8 rounded-2xl space-y-6">
                    <div className="text-center">
                        <FaShieldAlt className="text-red-600 text-4xl mx-auto mb-4" />
                        <h2 className="text-2xl font-black uppercase italic">Node <span className="text-red-600">Access</span></h2>
                    </div>

                    <div className="space-y-4">
                        <div className="relative">
                            <FaIdCard className="absolute left-4 top-4 text-zinc-600" />
                            <input name="name" placeholder="FULL NAME" required onChange={handleChange}
                                className="w-full bg-black/50 border border-zinc-800 p-4 pl-12 rounded-lg outline-none focus:border-red-600 transition-all font-mono text-sm" />
                        </div>
                        <div className="relative">
                            <FaUserSecret className="absolute left-4 top-4 text-zinc-600" />
                            <input name="email" type="email" placeholder="REGISTERED EMAIL" required onChange={handleChange}
                                className="w-full bg-black/50 border border-zinc-800 p-4 pl-12 rounded-lg outline-none focus:border-red-600 transition-all font-mono text-sm" />
                        </div>
                        <div className="relative">
                            <FaFingerprint className="absolute left-4 top-4 text-zinc-600" />
                            <input name="password" type="password" placeholder="TEAM ID (KEY)" required onChange={handleChange}
                                className="w-full bg-black/50 border border-zinc-800 p-4 pl-12 rounded-lg outline-none focus:border-red-600 transition-all font-mono text-sm" />
                        </div>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} className="text-red-500 text-[10px] font-mono uppercase bg-red-600/10 p-2 border border-red-600/50 rounded flex items-center gap-2">
                                <FaTerminal /> {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button type="submit" disabled={isLoading} className="w-full bg-red-600 py-4 rounded-lg font-black uppercase italic tracking-widest hover:bg-red-700 transition-all disabled:opacity-50">
                        {isLoading ? "AUTHORIZING..." : "INITIALIZE LINK"}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}