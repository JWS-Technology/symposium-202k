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
            className="relative min-h-screen w-full bg-[#020202] overflow-hidden flex items-center justify-center cursor-crosshair font-sans"
        >
            <style jsx global>{`
                @keyframes float-ui {
                    0%, 100% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-15px) scale(1.02); }
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
                    background: rgba(0, 0, 0, 0.96); /* Solid dark for sharpness */
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-left: 4px solid #991b1b;
                    clip-path: polygon(0 0, 100% 0, 100% 75%, 96% 100%, 0 100%);
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    position: relative;
                    overflow: hidden;
                }

                .stark-input-container:focus-within {
                    background: #000000;
                    border-color: rgba(220, 38, 38, 0.6);
                    border-left: 4px solid #ff0000;
                    box-shadow: 0 15px 45px -10px rgba(255, 0, 0, 0.4);
                    transform: scale(1.03) translateX(10px);
                }

                /* Laser Scan Effect on Focus */
                .stark-input-container:focus-within::after {
                    content: "";
                    position: absolute;
                    top: 0;
                    width: 2px;
                    height: 100%;
                    background: #ff0000;
                    box-shadow: 0 0 15px #ff0000;
                    animation: laser-scan 1.5s infinite;
                }

                .stark-field {
                    color: white;
                    font-weight: 800;
                    letter-spacing: 0.05em;
                    text-shadow: 0 0 12px rgba(255, 255, 255, 0.3);
                    caret-color: #ff0000;
                }

                .elegant-label {
                    font-weight: 900;
                    letter-spacing: 0.35em;
                    font-size: 11px;
                    color: #ef4444;
                    text-transform: uppercase;
                    text-shadow: 0 0 15px rgba(239, 68, 68, 0.5);
                }

                input::placeholder {
                    color: rgba(255, 255, 255, 0.05);
                    font-weight: 400;
                }

                .animate-float { animation: float-ui 8s ease-in-out infinite; }
                .web-splat { animation: web-impact 0.5s ease-out forwards; }
                .glitch-red { text-shadow: 3px 0 #ff0000, -3px 0 #00ffff; }
            `}</style>

            {/* MAIN BACKGROUND - BRIGHTER NOW */}
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

            {/* FLOATING HUD ELEMENTS */}
            {QUOTES.map((q, i) => (
                <div key={i} className="animate-float absolute z-20 hidden xl:block p-5 bg-black/90 border-l-4 border-red-600 backdrop-blur-3xl shadow-2xl"
                    style={{ left: q.side === "left" ? "5%" : "auto", right: q.side === "right" ? "5%" : "auto", top: `${20 + (i * 20)}%`, animationDelay: `${i * 1.5}s` }}>
                    <div className="flex items-center gap-2 mb-2">
                        <Globe className="w-4 h-4 text-red-600 animate-spin-slow" />
                        <span className="text-[10px] text-red-600 font-black tracking-[0.3em] uppercase">LINK_ESTABLISHED</span>
                    </div>
                    <p className="text-white text-sm font-bold max-w-[220px] leading-relaxed italic">"{q.text}"</p>
                </div>
            ))}

            {/* FORMAL ACCESS PORTAL */}
            <div className={`relative z-40 w-full max-w-[480px] px-6 transition-all duration-500 ${isGlitching ? 'translate-x-2 skew-y-1' : ''}`}>
                <div className="relative bg-[#050505]/95 border border-white/20 p-12 shadow-[0_0_150px_rgba(0,0,0,1)] overflow-hidden">

                    {/* VIDEO BACKGROUND - VISIBLE BUT CRISP */}
                    <div className="absolute inset-0 z-0 opacity-40">
                        <video autoPlay loop muted playsInline className="w-full h-full object-cover merge-screen scale-110">
                            <source src="/Spider-Verse.mp4" type="video/mp4" />
                        </video>
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-red-600/50 animate-[scanline_4s_linear_infinite]" />
                    </div>

                    {/* CONTENT */}
                    <div className="relative z-10">
                        <div className="flex flex-col items-center mb-14 text-center">
                            <div className="mb-6 relative group">
                                <div className="absolute -inset-4 bg-red-600 blur-2xl opacity-30 animate-pulse" />
                                <Target className={`relative w-16 h-16 transition-all duration-300 ${isGlitching ? 'text-blue-500 scale-110' : 'text-red-600'}`} />
                            </div>
                            <h1 className={`text-5xl font-[1000] text-white tracking-tighter uppercase italic leading-none ${isGlitching ? 'glitch-red' : ''}`}>
                                Spider<span className="text-red-600">Net</span>
                            </h1>
                            <div className="h-[3px] w-20 bg-red-600 mt-6 mb-2" />
                            <p className="text-[11px] text-gray-400 font-black mt-2 tracking-[0.7em] uppercase">Multiverse Access Terminal</p>
                        </div>

                        <form className="space-y-12" onClick={e => e.stopPropagation()}>
                            {/* USERNAME */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center px-1">
                                    <label className="elegant-label">Username</label>
                                    <span className="text-[9px] text-red-900 font-black tracking-widest animate-pulse">RECOGNIZING...</span>
                                </div>
                                <div className="stark-input-container flex items-center px-6 py-6">
                                    <User className="w-5 h-5 text-red-700 mr-5 opacity-50" />
                                    <input
                                        type="text"
                                        placeholder="AGENT_ID"
                                        className="stark-field bg-transparent border-none outline-none text-lg w-full focus:ring-0 uppercase"
                                    />
                                </div>
                            </div>

                            {/* PASSWORD */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center px-1">
                                    <label className="elegant-label">Password</label>
                                    <Zap className="w-4 h-4 text-red-600" />
                                </div>
                                <div className="stark-input-container flex items-center px-6 py-6">
                                    <Lock className="w-5 h-5 text-red-700 mr-5 opacity-50" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••••••"
                                        className="stark-field bg-transparent border-none outline-none text-lg w-full focus:ring-0"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="ml-2 hover:scale-125 transition-all active:scale-90"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-6 h-6 text-red-600 drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]" />
                                        ) : (
                                            <Eye className="w-6 h-6 text-red-800 opacity-40 hover:opacity-100" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* BUTTON */}
                            <button className="w-full relative mt-10 group overflow-hidden active:scale-[0.96] transition-all duration-300">
                                <div className="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                                <div className="relative border-2 border-red-600 py-7 flex items-center justify-center gap-4 group-hover:border-white/20 shadow-lg">
                                    <ShieldCheck className="w-6 h-6 text-red-600 group-hover:text-white transition-colors duration-300" />
                                    <span className="text-white font-black uppercase tracking-[0.5em] text-sm group-hover:scale-110 transition-transform">
                                        Initialize Link
                                    </span>
                                </div>
                            </button>
                        </form>

                        <div className="mt-16 flex flex-col items-center gap-4 opacity-40 hover:opacity-100 transition-all duration-700">
                            <div className="flex gap-2">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="w-1.5 h-1.5 bg-red-600 rotate-45 animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
                                ))}
                            </div>
                            <p className="text-[9px] text-white font-black tracking-[0.6em] uppercase">Secure Protocol 616-V</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CRT OVERLAY */}
            <div className="absolute inset-0 pointer-events-none z-[100] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%)] bg-[length:100%_4px] opacity-15" />
        </div>
    );
}