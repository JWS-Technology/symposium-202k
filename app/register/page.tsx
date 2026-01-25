"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Lock,
    ShieldCheck,
    Target,
    User,
    Zap,
    Phone,
    Mail,
    School,
    Eye,
    EyeOff,
} from "lucide-react";

export default function RegisterPortal() {
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [webs, setWebs] = useState<{ id: number; x: number; y: number }[]>([]);
    const router = useRouter();

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        department: "",
        college: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        const data = await res.json();
        if (!res.ok) {
            alert(data.message);
            return;
        }
        router.push("/login");
    };

    const handleInteraction = (e: React.MouseEvent) => {
        const id = Date.now();
        setWebs((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);
        setTimeout(() => {
            setWebs((prev) => prev.filter(w => w.id !== id));
        }, 600);
    };

    return (
        <div
            onClick={handleInteraction}
            className="relative min-h-screen w-full bg-[#020202] overflow-x-hidden flex flex-col items-center cursor-crosshair font-sans p-4 pt-22"
        >
            <style jsx global>{`
                @keyframes web-impact {
                    0% { transform: scale(0); opacity: 1; }
                    100% { transform: scale(2.5); opacity: 0; }
                }
                @keyframes scanline {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100%); }
                }
                @keyframes laser-scan {
                    0% { left: -10%; opacity: 0; }
                    50% { opacity: 1; }
                    100% { left: 110%; opacity: 0; }
                }
                
                input:-webkit-autofill {
                    -webkit-box-shadow: 0 0 0 30px #0a0a0a inset !important;
                    -webkit-text-fill-color: white !important;
                }

                .stark-input-container {
                    background: rgba(0, 0, 0, 0.85);
                    border: 0.0625rem solid rgba(255, 255, 255, 0.1);
                    border-left: 0.2rem solid #991b1b;
                    border-radius: 0.5rem;
                    transition: all 0.3s ease;
                    position: relative;
                    z-index: 20;
                    overflow: hidden;
                }

                .stark-input-container:focus-within {
                    background: #000000;
                    border-color: rgba(220, 38, 38, 0.6);
                    border-left: 0.2rem solid #ff0000;
                }

                .stark-input-container:focus-within::after {
                    content: "";
                    position: absolute;
                    top: 0;
                    width: 0.125rem;
                    height: 100%;
                    background: #ff0000;
                    animation: laser-scan 1.5s infinite;
                }

                .stark-field {
                    color: white !important;
                    font-weight: 700;
                    letter-spacing: 0.02em;
                    background: transparent !important;
                }

                .elegant-label {
                    font-weight: 900;
                    letter-spacing: 0.15em;
                    font-size: 0.6rem;
                    color: #ef4444;
                    text-transform: uppercase;
                }

                .web-splat { animation: web-impact 0.5s ease-out forwards; }
            `}</style>

            {/* PAGE BACKGROUND: SPIDER-VERSE (BRIGHTER) */}
            <div className="absolute inset-0 z-0">
                <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-60">
                    <source src="/Spider-Verse.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
            </div>

            {/* INTERACTIVE WEBS */}
            {webs.map(w => (
                <div key={w.id} className="absolute z-10 pointer-events-none" style={{ left: w.x, top: w.y }}>
                    <svg width="120" height="120" className="web-splat -translate-x-1/2 -translate-y-1/2 opacity-50">
                        <g stroke="#ffffff" strokeWidth="1" fill="none">
                            {[...Array(8)].map((_, i) => (
                                <line key={i} x1="60" y1="60"
                                    x2={`${60 + 50 * Math.cos((i * 45 * Math.PI) / 180)}`}
                                    y2={`${60 + 50 * Math.sin((i * 45 * Math.PI) / 180)}`}
                                />
                            ))}
                        </g>
                    </svg>
                </div>
            ))}

            {/* COMPACT MAIN PORTAL CONTAINER */}
            <div className="relative z-20 w-full max-w-[26rem] mb-10">
                <div className="relative bg-[#050505]/90 border border-white/10 p-5 sm:p-7 rounded-[1.5rem] shadow-[0_0_50px_rgba(0,0,0,1)] overflow-hidden backdrop-blur-sm">

                    {/* CARD BACKGROUND VIDEO: FULLY ZOOMED TO FILL */}
                    <div className="absolute inset-0 z-0 opacity-25 pointer-events-none overflow-hidden">
                        <video autoPlay loop muted playsInline className="w-full h-full object-cover scale-[1.8]">
                            <source src="/Amazing_Spiderman_Andrew_Garfield.mp4" type="video/mp4" />
                        </video>
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-red-600/30 animate-[scanline_6s_linear_infinite]" />
                    </div>

                    {/* CONTENT LAYER */}
                    <div className="relative z-10">
                        <div className="flex flex-col items-center mb-4 text-center">
                            <Target className="w-8 h-8 mb-2 text-red-600" />
                            <h1 className="text-2xl font-[1000] text-white tracking-tighter uppercase italic leading-none">
                                Entity<span className="text-red-600">_Registry</span>
                            </h1>
                            <p className="text-[8px] text-gray-500 font-black tracking-[0.4em] uppercase mt-2">Stark Protocol v2.8</p>
                        </div>

                        <form className="space-y-3" onSubmit={handleSubmit} onClick={e => e.stopPropagation()}>

                            <div className="space-y-1">
                                <label className="elegant-label px-1">Team Name</label>
                                <div className="stark-input-container flex items-center px-3 py-2">
                                    <User className="w-3.5 h-3.5 text-red-700 mr-2.5 opacity-40" />
                                    <input
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="ID_NAME"
                                        className="stark-field bg-transparent border-none outline-none text-[13px] w-full focus:ring-0 uppercase"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="elegant-label px-1">Gmail</label>
                                <div className="stark-input-container flex items-center px-3 py-2">
                                    <Mail className="w-3.5 h-3.5 text-red-700 mr-2.5 opacity-40" />
                                    <input
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="variant@gmail.com"
                                        className="stark-field bg-transparent border-none outline-none text-[13px] w-full focus:ring-0"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="elegant-label px-1">Phone</label>
                                <div className="stark-input-container flex items-center px-3 py-2">
                                    <Phone className="w-3.5 h-3.5 text-red-700 mr-2.5 opacity-40" />
                                    <input
                                        name="phone"
                                        type="tel"
                                        value={form.phone}
                                        onChange={handleChange}
                                        placeholder="+91 0000000000"
                                        className="stark-field bg-transparent border-none outline-none text-[13px] w-full focus:ring-0"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="elegant-label px-1">Origin College</label>
                                <div className="stark-input-container flex items-center px-3 py-2">
                                    <School className="w-3.5 h-3.5 text-red-700 mr-2.5 opacity-40" />
                                    <input
                                        name="college"
                                        value={form.college}
                                        onChange={handleChange}
                                        placeholder="CAMPUS"
                                        className="stark-field bg-transparent border-none outline-none text-[13px] w-full focus:ring-0 uppercase"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="elegant-label px-1">Department</label>
                                <div className="stark-input-container flex items-center px-3 py-2">
                                    <ShieldCheck className="w-3.5 h-3.5 text-red-700 mr-2.5 opacity-40" />
                                    <input
                                        name="department"
                                        value={form.department}
                                        onChange={handleChange}
                                        placeholder="SECTOR"
                                        className="stark-field bg-transparent border-none outline-none text-[13px] w-full focus:ring-0 uppercase"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="elegant-label px-1">Access Key</label>
                                <div className="stark-input-container flex items-center px-3 py-2">
                                    <Lock className="w-3.5 h-3.5 text-red-700 mr-2.5 opacity-40" />
                                    <input
                                        name="password"
                                        type={showPass ? "text" : "password"}
                                        value={form.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="stark-field bg-transparent border-none outline-none text-[13px] w-full focus:ring-0"
                                    />
                                    <button type="button" onClick={() => setShowPass(!showPass)} className="opacity-40 hover:opacity-100">
                                        {showPass ? <EyeOff className="w-3.5 h-3.5 text-red-600" /> : <Eye className="w-3.5 h-3.5 text-red-800" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="elegant-label px-1">Verify Key</label>
                                <div className="stark-input-container flex items-center px-3 py-2">
                                    <ShieldCheck className="w-3.5 h-3.5 text-red-700 mr-2.5 opacity-40" />
                                    <input
                                        name="confirmPassword"
                                        type={showConfirm ? "text" : "password"}
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="stark-field bg-transparent border-none outline-none text-[13px] w-full focus:ring-0"
                                    />
                                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="opacity-40 hover:opacity-100">
                                        {showConfirm ? <EyeOff className="w-3.5 h-3.5 text-red-600" /> : <Eye className="w-3.5 h-3.5 text-red-800" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full relative mt-3 group overflow-hidden rounded-lg active:scale-95 transition-all"
                            >
                                <div className="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                <div className="relative border-2 border-red-600/50 py-3 rounded-lg flex items-center justify-center gap-3">
                                    <Zap className="w-4 h-4 text-red-600 group-hover:text-white" />
                                    <span className="text-white font-black uppercase tracking-[0.2em] text-[10px]">Initialize</span>
                                </div>
                            </button>
                        </form>

                        <div className="mt-4 flex justify-center">
                            <button
                                onClick={() => router.push("/login")}
                                className="text-[8px] text-gray-500 hover:text-red-600 transition-colors uppercase font-black tracking-[0.3em]"
                            >
                                Return to Secure Portal
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* GLOBAL CRT SCANLINES */}
            <div className="absolute inset-0 pointer-events-none z-[100] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-20" />
        </div>
    );
}