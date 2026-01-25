"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminRegisterPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const res = await fetch("/api/admin/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        setLoading(false);

        if (!res.ok) {
            alert(data.message);
            return;
        }

        alert("Admin registered successfully");
        router.push("/admin/login");
    };

    return (
        <div className="min-h-screen bg-[#020202] flex items-center justify-center text-white">
            <form
                onSubmit={handleRegister}
                className="bg-[#050505] border border-zinc-800 rounded-2xl p-8 w-full max-w-md space-y-4"
            >
                <h1 className="text-2xl font-black uppercase tracking-widest text-red-600">
                    Admin Register
                </h1>

                <input
                    type="email"
                    placeholder="Admin Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-black border border-zinc-800 p-3 rounded"
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-black border border-zinc-800 p-3 rounded"
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-red-600 py-3 rounded font-bold uppercase"
                >
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>
        </div>
    );
}
