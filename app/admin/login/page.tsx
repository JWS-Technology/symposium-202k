"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            setLoading(false);

            if (!res.ok) {
                alert(data.message || "Login failed");
                return;
            }

            // 🔐 Store admin token
            localStorage.setItem("adminToken", data.token);

            router.push("/admin/dashboard");
        } catch (err) {
            setLoading(false);
            alert("Something went wrong");
        }
        const token = localStorage.getItem("adminToken");
        if (!token) {
            router.push("/admin/login");
            return;
        }
    };

    return (
        <div className="min-h-screen bg-[#020202] flex items-center justify-center text-white">
            <form
                onSubmit={handleLogin}
                className="bg-[#050505] border border-zinc-800 rounded-2xl p-8 w-full max-w-md space-y-5"
            >
                <h1 className="text-2xl font-black uppercase tracking-widest text-red-600">
                    Admin Login
                </h1>

                <input
                    type="email"
                    placeholder="Admin Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-black border border-zinc-800 p-3 rounded text-white outline-none focus:border-red-600/50"
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-black border border-zinc-800 p-3 rounded text-white outline-none focus:border-red-600/50"
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-red-600 py-3 rounded font-bold uppercase tracking-widest hover:bg-red-500 transition"
                >
                    {loading ? "Authenticating..." : "Login"}
                </button>

                <p className="text-xs text-zinc-500 text-center tracking-widest">
                    Authorized Personnel Only
                </p>
            </form>
        </div>
    );
}
