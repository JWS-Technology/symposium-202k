"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserSecret, FaFingerprint, FaShieldAlt, FaTerminal } from "react-icons/fa";

export default function PrelimsLogin() {
    const router = useRouter();
    const [form, setForm] = useState({ username: "", password: "" });
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

            if (!res.ok) {
                setError(data.message || "Access Denied: Invalid Credentials");
                setIsLoading(false);
                return;
            }

            localStorage.setItem("prelims_token", data.token);
            // Artificial delay for "System Auth" feel
            setTimeout(() => router.push("/test"), 1000);
        } catch (err) {
            setError("Connection Interrupted: System Offline");
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#020202] text-white font-sans relative overflow-hidden">

            {/* BACKGROUND SPIDER WEB EFFECT */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, #ff003c 1px, transparent 0)`,
                        backgroundSize: '40px 40px'
                    }}
                />
                <motion.div
                    animate={{ opacity: [0.1, 0.3, 0.1] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="absolute inset-0 bg-gradient-to-tr from-red-900/10 via-transparent to-transparent"
                />
            </div>

            {/* LOGIN CONTAINER */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md z-10 p-4"
            >
                <div className="relative group">
                    {/* Decorative HUD Corners */}
                    <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-red-600 rounded-tl-lg" />
                    <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-red-600 rounded-tr-lg" />
                    <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-red-600 rounded-bl-lg" />
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-red-600 rounded-br-lg" />

                    <form
                        onSubmit={handleSubmit}
                        className="bg-zinc-950/80 border border-zinc-800 backdrop-blur-xl p-8 md:p-10 rounded-xl shadow-2xl space-y-6"
                    >
                        <div className="text-center space-y-2">
                            <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ repeat: Infinity, duration: 3 }}
                                className="inline-block p-4 bg-red-600/10 rounded-full border border-red-600/30 mb-2"
                            >
                                <FaShieldAlt className="text-red-600 text-3xl" />
                            </motion.div>
                            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">
                                Node <span className="text-red-600">Access</span>
                            </h2>
                            <p className="text-[10px] font-mono text-zinc-500 tracking-[0.3em] uppercase">Secure Terminal v2.0.26</p>
                        </div>

                        <div className="space-y-4">
                            {/* TEAM ID INPUT */}
                            <div className="relative group/field">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FaUserSecret className="text-zinc-600 group-focus-within/field:text-red-600 transition-colors" />
                                </div>
                                <input
                                    name="username"
                                    placeholder="TEAM ID"
                                    required
                                    onChange={handleChange}
                                    className="w-full bg-black/50 border border-zinc-800 p-4 pl-12 rounded-lg focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all outline-none font-mono text-sm tracking-widest uppercase placeholder:text-zinc-700"
                                />
                            </div>

                            {/* PASSWORD INPUT */}
                            <div className="relative group/field">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FaFingerprint className="text-zinc-600 group-focus-within/field:text-red-600 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="REGISTERED EMAIL"
                                    required
                                    onChange={handleChange}
                                    className="w-full bg-black/50 border border-zinc-800 p-4 pl-12 rounded-lg focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all outline-none font-mono text-sm tracking-widest uppercase placeholder:text-zinc-700"
                                />
                            </div>
                        </div>

                        {/* ERROR ALERT */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="bg-red-600/10 border border-red-600/50 p-3 rounded flex items-center gap-3"
                                >
                                    <FaTerminal className="text-red-600 text-xs" />
                                    <p className="text-red-500 text-[10px] font-mono uppercase font-bold">{error}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* SUBMIT BUTTON */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full overflow-hidden bg-red-600 text-white py-4 rounded-lg font-black uppercase italic tracking-[0.2em] shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all disabled:opacity-50"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {isLoading ? "Authorizing..." : "Initialize Link"}
                                {!isLoading && <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity }}>→</motion.span>}
                            </span>

                            {/* Button Glitch Effect Overlay */}
                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                        </button>

                        <div className="pt-2 flex justify-between items-center opacity-30 group-hover:opacity-100 transition-opacity">
                            <div className="h-[1px] flex-grow bg-zinc-800" />
                            <span className="mx-4 text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Encrypted Session</span>
                            <div className="h-[1px] flex-grow bg-zinc-800" />
                        </div>
                    </form>
                </div>

                {/* FOOTER SYSTEM STATUS */}
                <div className="mt-8 flex justify-center gap-8 text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                        Auth_Active
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-red-600" />
                        SSL_Secure
                    </div>
                </div>
            </motion.div>
        </div>
    );
}