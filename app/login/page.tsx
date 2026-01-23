"use client";

import { useState, useEffect } from "react";
import { Lock, ShieldCheck, Target, User, Zap, Globe, Eye, EyeOff } from "lucide-react";

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

    useEffect(() => {
        const interval = setInterval(() => {
            setIsGlitching(true);
            setTimeout(() => setIsGlitching(false), 120);
        }, 4500);
        return () => clearInterval(interval);
    }, []);

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
            className="relative min-h-screen w-full bg-[#020202] overflow-hidden flex items-center justify-center cursor-crosshair font-sans p-4 sm:p-8"
        >
            <style jsx global>{`
                @keyframes float-ui {
                    0%, 100% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-0.9375rem) scale(1.02); }
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
                
                .merge-screen {
                    mix-blend-mode: screen;
                    mask-image: radial-gradient(circle, black 60%, transparent 95%);
                    filter: brightness(1.2) contrast(1.4);
                    pointer-events: none;
                }

                .stark-input-container {
                    background: rgba(0, 0, 0, 0.96);
                    border: 0.0625rem solid rgba(255, 255, 255, 0.1);
                    border-left: 0.25rem solid #991b1b;
                    border-radius: 0.75rem;
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    position: relative;
                    overflow: hidden;
                }

                .stark-input-container:focus-within {
                    background: #000000;
                    border-color: rgba(220, 38, 38, 0.6);
                    border-left: 0.25rem solid #ff0000;
                    box-shadow: 0 0.625rem 1.875rem -0.3125rem rgba(255, 0, 0, 0.4);
                    transform: scale(1.02) translateX(0.3125rem);
                }

                .stark-input-container:focus-within::after {
                    content: "";
                    position: absolute;
                    top: 0;
                    width: 0.125rem;
                    height: 100%;
                    background: #ff0000;
                    box-shadow: 0 0 0.9375rem #ff0000;
                    animation: laser-scan 1.5s infinite;
                }

                .stark-field {
                    color: white;
                    font-weight: 800;
                    letter-spacing: 0.05em;
                    text-shadow: 0 0 0.75rem rgba(255, 255, 255, 0.3);
                    caret-color: #ff0000;
                }

                .elegant-label {
                    font-weight: 900;
                    letter-spacing: 0.35em;
                    font-size: 0.625rem;
                    color: #ef4444;
                    text-transform: uppercase;
                    text-shadow: 0 0 0.9375rem rgba(239, 68, 68, 0.5);
                }

                .animate-float { animation: float-ui 8s ease-in-out infinite; }
                .web-splat { animation: web-impact 0.5s ease-out forwards; }
                .glitch-red { text-shadow: 0.1875rem 0 #ff0000, -0.1875rem 0 #00ffff; }
            `}</style>

            {/* MAIN BACKGROUND */}
            <div className="absolute inset-0 z-0">
                <img src="/wallpaper.gif" className="w-full h-full object-cover opacity-50 scale-105" alt="city" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
            </div>

            {/* INTERACTIVE WEB SPLITS */}
            {webs.map(w => (
                <div key={w.id} className="absolute z-50 pointer-events-none" style={{ left: w.x, top: w.y }}>
                    <svg width="180" height="180" className="web-splat -translate-x-1/2 -translate-y-1/2 opacity-50">
                        <g stroke="#ffffff" strokeWidth="1.2" fill="none">
                            {[...Array(12)].map((_, i) => (
                                <line key={i} x1="90" y1="90"
                                    x2={`${90 + 70 * Math.cos((i * 30 * Math.PI) / 180)}`}
                                    y2={`${90 + 70 * Math.sin((i * 30 * Math.PI) / 180)}`}
                                />
                            ))}
                        </g>
                    </svg>
                </div>
            ))}

            {/* FLOATING HUD ELEMENTS - Responsive hiding and scaling */}
            {QUOTES.map((q, i) => (
                <div key={i} className="animate-float absolute z-20 hidden 2xl:block p-[1rem] bg-black/90 border-l-[0.25rem] border-red-600 backdrop-blur-3xl rounded-lg shadow-2xl"
                    style={{
                        left: q.side === "left" ? "3rem" : "auto",
                        right: q.side === "right" ? "3rem" : "auto",
                        top: `${20 + (i * 18)}%`,
                        animationDelay: `${i * 1.5}s`
                    }}>
                    <div className="flex items-center gap-2 mb-1">
                        <Globe className="w-[0.75rem] h-[0.75rem] text-red-600 animate-spin-slow" />
                        <span className="text-[0.5625rem] text-red-600 font-black tracking-[0.2em] uppercase">LINK_ESTABLISHED</span>
                    </div>
                    <p className="text-white text-[0.75rem] font-bold max-w-[12.5rem] leading-snug italic">"{q.text}"</p>
                </div>
            ))}

            {/* COMPACT CRT ACCESS PORTAL */}
            <div className={`relative z-40 w-full max-w-[26.25rem] transition-all duration-500 ${isGlitching ? 'translate-x-[0.125rem] skew-y-[0.5deg]' : ''}`}>
                <div className="relative bg-[#050505]/95 border border-white/20 p-[1.5rem] sm:p-[2.5rem] rounded-[1.5rem] sm:rounded-[2rem] shadow-[0_0_6.25rem_rgba(0,0,0,1)] overflow-hidden">

                    {/* VIDEO BACKGROUND */}
                    <div className="absolute inset-0 z-0 opacity-40">
                        <video autoPlay loop muted playsInline className="w-full h-full object-cover merge-screen scale-110">
                            <source src="/Spider-Verse.mp4" type="video/mp4" />
                        </video>
                        <div className="absolute top-0 left-0 w-full h-[0.125rem] bg-red-600/50 animate-[scanline_4s_linear_infinite]" />
                    </div>

                    {/* CONTENT */}
                    <div className="relative z-10">
                        <div className="flex flex-col items-center mb-[2rem] text-center">
                            <div className="mb-[1rem] relative group">
                                <div className="absolute -inset-[1rem] bg-red-600 blur-2xl opacity-30 animate-pulse" />
                                <Target className={`relative w-[2.5rem] h-[2.5rem] sm:w-[3rem] sm:h-[3rem] transition-all duration-300 ${isGlitching ? 'text-blue-500 scale-110' : 'text-red-600'}`} />
                            </div>
                            <h1 className={`text-[2rem] sm:text-[2.5rem] font-[1000] text-white tracking-tighter uppercase italic leading-none ${isGlitching ? 'glitch-red' : ''}`}>
                                Spider<span className="text-red-600">Net</span>
                            </h1>
                            <div className="h-[0.125rem] w-[3rem] bg-red-600 mt-[1rem] mb-[0.5rem]" />
                            <p className="text-[0.625rem] text-gray-400 font-black tracking-[0.5em] uppercase">Auth Terminal</p>
                        </div>

                        <form className="space-y-[1.5rem]" onClick={e => e.stopPropagation()}>
                            {/* USERNAME */}
                            <div className="space-y-[0.5rem]">
                                <div className="flex justify-between items-center px-[0.25rem]">
                                    <label className="elegant-label">Username</label>
                                    <span className="text-[0.5rem] text-red-900 font-black tracking-widest animate-pulse">SCANNING...</span>
                                </div>
                                <div className="stark-input-container flex items-center px-[1.25rem] py-[1rem]">
                                    <User className="w-[1rem] h-[1rem] text-red-700 mr-[1rem] opacity-50 shrink-0" />
                                    <input
                                        type="text"
                                        placeholder="AGENT_ID"
                                        className="stark-field bg-transparent border-none outline-none text-[1rem] w-full focus:ring-0 uppercase placeholder:opacity-10"
                                    />
                                </div>
                            </div>

                            {/* PASSWORD */}
                            <div className="space-y-[0.5rem]">
                                <div className="flex justify-between items-center px-[0.25rem]">
                                    <label className="elegant-label">Password</label>
                                    <Zap className="w-[0.75rem] h-[0.75rem] text-red-600" />
                                </div>
                                <div className="stark-input-container flex items-center px-[1.25rem] py-[1rem]">
                                    <Lock className="w-[1rem] h-[1rem] text-red-700 mr-[1rem] opacity-50 shrink-0" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="stark-field bg-transparent border-none outline-none text-[1rem] w-full focus:ring-0"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="ml-[0.5rem] hover:scale-110 transition-all active:scale-90"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-[1.25rem] h-[1.25rem] text-red-600 drop-shadow-[0_0_0.625rem_rgba(255,0,0,0.8)]" />
                                        ) : (
                                            <Eye className="w-[1.25rem] h-[1.25rem] text-red-800 opacity-40 hover:opacity-100" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* BUTTON */}
                            <button className="w-full relative mt-[1.5rem] group overflow-hidden rounded-[0.75rem] active:scale-[0.96] transition-all duration-300">
                                <div className="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                                <div className="relative border-[0.125rem] border-red-600 py-[1.25rem] rounded-[0.75rem] flex items-center justify-center gap-[0.75rem] group-hover:border-white/20 shadow-lg">
                                    <ShieldCheck className="w-[1.25rem] h-[1.25rem] text-red-600 group-hover:text-white transition-colors duration-300" />
                                    <span className="text-white font-black uppercase tracking-[0.4em] text-[0.75rem] group-hover:scale-105 transition-transform">
                                        Initialize
                                    </span>
                                </div>
                            </button>
                        </form>

                        <div className="mt-[2.5rem] flex flex-col items-center gap-[0.75rem] opacity-40 hover:opacity-100 transition-all duration-700">
                            <div className="flex gap-[0.5rem]">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="w-[0.25rem] h-[0.25rem] bg-red-600 rotate-45 animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
                                ))}
                            </div>
                            <p className="text-[0.5rem] text-white font-black tracking-[0.4em] uppercase opacity-60 text-center">Stark Industries © 2026</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CRT OVERLAY */}
            <div className="absolute inset-0 pointer-events-none z-[100] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%)] bg-[length:100%_0.25rem] opacity-15" />
        </div>
    );
}