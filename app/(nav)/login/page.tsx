"use client";

import { useState, useEffect } from "react";
import { Lock, ShieldCheck, Target, User, Zap, Globe, Eye, EyeOff, Mail } from "lucide-react";
import { useRouter } from "next/navigation";


const QUOTES = [
    { text: "With great power comes great responsibility.", side: "left" },
    { text: "Expect the disappointment, you will never be disappointed.", side: "right" },
    { text: "It's a leap of faith. That's all it is.", side: "left" },
    { text: "Anyone can wear the mask.", side: "right" }
];

export default function SpiderPortal() {
    const [isGlitching, setIsGlitching] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [webs, setWebs] = useState<{ id: number; x: number; y: number }[]>([]);
    const router = useRouter();
    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsGlitching(true);
            setTimeout(() => setIsGlitching(false), 120);
        }, 4500);
        return () => clearInterval(interval);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        const data = await res.json();
        setLoading(false);

        if (!res.ok) {
            alert(data.message);
            return;
        }

        localStorage.setItem("token", data.token);
        router.push("/dashboard");
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
            className="relative min-h-screen w-full bg-[#020202] overflow-hidden flex items-center justify-center cursor-crosshair font-sans p-4 pt-12"
        >
            <style jsx global>{`
                @keyframes float-ui {
                    0%, 100% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-0.75rem) scale(1.02); }
                }
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
                
                input:-webkit-autofill,
                input:-webkit-autofill:hover, 
                input:-webkit-autofill:focus, 
                input:-webkit-autofill:active {
                    -webkit-box-shadow: 0 0 0 30px #0a0a0a inset !important;
                    -webkit-text-fill-color: white !important;
                    transition: background-color 5000s ease-in-out 0s;
                }

                ::selection {
                    background: rgba(239, 68, 68, 0.4);
                    color: white;
                }

                .stark-input-container {
                    background: rgba(0, 0, 0, 0.9);
                    border: 0.0625rem solid rgba(255, 255, 255, 0.1);
                    border-left: 0.25rem solid #991b1b;
                    border-radius: 0.75rem;
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    position: relative;
                    z-index: 20;
                }

                .stark-input-container:focus-within {
                    background: #000000;
                    border-color: rgba(220, 38, 38, 0.6);
                    border-left: 0.25rem solid #ff0000;
                    box-shadow: 0 0.5rem 2rem -0.5rem rgba(255, 0, 0, 0.4);
                    transform: scale(1.01);
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
                    font-weight: 800;
                    letter-spacing: 0.05em;
                    caret-color: #ff0000;
                    background: transparent !important;
                }

                .elegant-label {
                    font-weight: 900;
                    letter-spacing: 0.25em;
                    font-size: 0.65rem;
                    color: #ef4444;
                    text-transform: uppercase;
                }

                .animate-float { animation: float-ui 8s ease-in-out infinite; }
                .web-splat { animation: web-impact 0.5s ease-out forwards; }
                .glitch-red { text-shadow: 0.15rem 0 #ff0000, -0.15rem 0 #00ffff; }
            `}</style>

            {/* LAYER 1: CITY WALLPAPER */}
            <div className="absolute inset-0 z-0">
                <img src="/wallpaper.gif" className="w-full h-full object-cover opacity-40" alt="city" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black" />
            </div>

            {/* LAYER 2: INTERACTIVE WEBS */}
            {webs.map(w => (
                <div key={w.id} className="absolute z-10 pointer-events-none" style={{ left: w.x, top: w.y }}>
                    <svg width="150" height="150" className="web-splat -translate-x-1/2 -translate-y-1/2 opacity-40">
                        <g stroke="#ffffff" strokeWidth="1" fill="none">
                            {[...Array(10)].map((_, i) => (
                                <line key={i} x1="75" y1="75"
                                    x2={`${75 + 60 * Math.cos((i * 36 * Math.PI) / 180)}`}
                                    y2={`${75 + 60 * Math.sin((i * 36 * Math.PI) / 180)}`}
                                />
                            ))}
                        </g>
                    </svg>
                </div>
            ))}

            {/* LAYER 3: MAIN PORTAL CONTAINER */}
            <div className={`relative z-20 w-full max-w-[28rem] transition-all duration-500 ${isGlitching ? 'translate-x-0.5' : ''}`}>
                <div className="relative bg-[#050505]/95 border border-white/10 p-8 sm:p-12 rounded-[2.5rem] shadow-2xl overflow-hidden">

                    {/* VIDEO DECORATION (Correctly placed inside card but behind content) */}
                    <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
                        <video autoPlay loop muted playsInline className="w-full h-full object-cover scale-110" style={{ mixBlendMode: 'screen' }}>
                            <source src="/Spider-Verse.mp4" type="video/mp4" />
                        </video>
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-red-600/40 animate-[scanline_5s_linear_infinite]" />
                    </div>

                    {/* CONTENT LAYER */}
                    <div className="relative z-10">
                        <div className="flex flex-col items-center mb-8 text-center">
                            <Target className={`w-12 h-12 mb-4 transition-all ${isGlitching ? 'text-blue-500' : 'text-red-600'}`} />
                            <h1 className={`text-4xl font-[1000] text-white tracking-tighter uppercase italic leading-none ${isGlitching ? 'glitch-red' : ''}`}>
                                Spider<span className="text-red-600">Net</span>
                            </h1>
                            <p className="text-[10px] text-gray-500 font-black tracking-[0.5em] uppercase mt-4">Auth Terminal</p>
                        </div>

                        <form className="space-y-6" onSubmit={handleSubmit} onClick={e => e.stopPropagation()}>
                            <div className="space-y-2">
                                <label className="elegant-label px-1">Gmail</label>
                                <div className="stark-input-container flex items-center px-4 py-4">
                                    <Mail className="w-4 h-4 text-red-700 mr-3 opacity-40" />
                                    <input
                                        type="email"
                                        name="email"
                                        autoComplete="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="variant@gmail.com"
                                        className="stark-field bg-transparent border-none outline-none text-base w-full focus:ring-0 placeholder:opacity-10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="elegant-label px-1">Access Key</label>
                                <div className="stark-input-container flex items-center px-4 py-4">
                                    <Lock className="w-4 h-4 text-red-700 mr-3 opacity-40" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        autoComplete="current-password"
                                        value={form.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="stark-field bg-transparent border-none outline-none text-base w-full focus:ring-0"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="ml-2 opacity-40 hover:opacity-100 transition-opacity"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5 text-red-600" /> : <Eye className="w-5 h-5 text-red-800" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full relative mt-4 group overflow-hidden rounded-xl active:scale-95 transition-all"
                            >
                                <div className="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                <div className="relative border-2 border-red-600/50 py-4 rounded-xl flex items-center justify-center gap-3">
                                    <ShieldCheck className="w-5 h-5 text-red-600 group-hover:text-white" />
                                    <span className="text-white font-black uppercase tracking-[0.3em] text-xs">
                                        {loading ? "Verifying..." : "Initialize"}
                                    </span>
                                </div>
                            </button>
                        </form>

                        <div className="mt-8 flex flex-col items-center gap-2 opacity-30">
                            <div className="flex gap-1">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="w-1 h-1 bg-red-600 rotate-45 animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
                                ))}
                            </div>
                            <p className="text-[8px] text-white font-black tracking-[0.4em] uppercase">Stark Industries © 2026</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CRT OVERLAY */}
            <div className="absolute inset-0 pointer-events-none z-[100] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%)] bg-[length:100%_4px] opacity-10" />
        </div>
    );
}