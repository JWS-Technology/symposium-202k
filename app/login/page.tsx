"use client";

import { useState, useEffect } from "react";
import { Mail, Lock, ShieldCheck, Target } from "lucide-react";

const QUOTES = [
    { text: "With great power comes great responsibility.", side: "left" },
    { text: "Expect the disappointment, you will never be disappointed.", side: "right" },
    { text: "It's a leap of faith. That's all it is.", side: "left" },
    { text: "Anyone can wear the mask.", side: "right" }
];

export default function SpiderPortal() {
    const [isGlitching, setIsGlitching] = useState(false);
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
        // Spawns the classic web splat at click coordinates
        setWebs((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);

        // Remove web after animation
        setTimeout(() => {
            setWebs((prev) => prev.filter(w => w.id !== id));
        }, 600);
    };

    return (
        <div
            onClick={handleInteraction}
            className="relative min-h-screen w-full bg-[#050505] overflow-hidden flex items-center justify-center cursor-crosshair"
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
                
                /* Advanced blending for the Jump GIF inside the card */
                .merge-screen {
                    mix-blend-mode: screen;
                    mask-image: radial-gradient(circle, black 40%, transparent 90%);
                    filter: brightness(1.2) contrast(1.1);
                    pointer-events: none;
                }

                .animate-float { animation: float-ui 8s ease-in-out infinite; }
                .web-splat { animation: web-impact 0.5s ease-out forwards; }
                .glitch-red { text-shadow: 2px 0 #ff0000, -2px 0 #00ffff; }
            `}</style>

            {/* MAIN BACKGROUND: WALLPAPER (Visible and Clear) */}
            <div className="absolute inset-0 z-0">
                <img src="/wallpaper.gif" className="w-full h-full object-cover opacity-80" alt="city" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
            </div>

            {/* INTERACTIVE WEB SPLITS (Old Style Restored) */}
            {webs.map(w => (
                <div key={w.id} className="absolute z-50 pointer-events-none" style={{ left: w.x, top: w.y }}>
                    <svg width="200" height="200" className="web-splat -translate-x-1/2 -translate-y-1/2">
                        <g stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" fill="none">
                            {[...Array(12)].map((_, i) => (
                                <line key={i} x1="100" y1="100"
                                    x2={`${100 + 80 * Math.cos((i * 30 * Math.PI) / 180)}`}
                                    y2={`${100 + 80 * Math.sin((i * 30 * Math.PI) / 180)}`}
                                />
                            ))}
                            <circle cx="100" cy="100" r="30" strokeDasharray="5,5" />
                            <circle cx="100" cy="100" r="50" strokeDasharray="8,8" />
                        </g>
                    </svg>
                </div>
            ))}

            {/* FLOATING DIALOGUES (Glassmorphism) */}
            {QUOTES.map((q, i) => (
                <div
                    key={i}
                    className="animate-float absolute z-20 hidden xl:block p-5 bg-black/50 border border-white/10 backdrop-blur-2xl rounded-sm transition-all duration-300"
                    style={{
                        left: q.side === "left" ? "5%" : "auto",
                        right: q.side === "right" ? "5%" : "auto",
                        top: `${20 + (i * 20)}%`,
                        animationDelay: `${i * 1.8}s`
                    }}
                >
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-1 h-1 bg-red-600 rounded-full animate-pulse" />
                        <span className="text-[9px] text-red-500 font-mono font-bold tracking-widest uppercase">Spider_Sense_Active</span>
                    </div>
                    <p className="text-white text-xs italic font-medium max-w-[200px]">"{q.text}"</p>
                </div>
            ))}

            {/* CENTRAL LOGIN CARD WITH INTEGRATED JUMP GIF */}
            <div className={`relative z-40 w-full max-w-[450px] px-6 transition-all duration-75 ${isGlitching ? 'translate-x-1' : ''}`}>
                <div className="bg-black/90 p-10 border border-red-600/30 shadow-[0_0_100px_rgba(0,0,0,1)] rounded-sm relative overflow-hidden group">

                    {/* INTEGRATED JUMP GIF (Hologram Look) */}
                    <div className="absolute inset-0 z-0 opacity-40">
                        <img
                            src="/spiderman-jump.gif"
                            className="w-full h-full object-cover merge-screen scale-125"
                        />
                    </div>

                    <div className="relative z-10">
                        <div className="flex flex-col items-center mb-10">
                            <div className="relative">
                                <Target className={`w-12 h-12 mb-4 ${isGlitching ? 'text-blue-500' : 'text-red-600'}`} />
                                <div className="absolute inset-0 bg-red-600/20 blur-xl animate-pulse" />
                            </div>
                            <h1 className={`text-4xl font-black italic text-white uppercase tracking-tighter text-center ${isGlitching ? 'glitch-red' : ''}`}>
                                Spider<span className="text-red-600">Net</span>
                            </h1>
                            <p className="text-[9px] text-gray-500 font-mono mt-2 tracking-[0.5em] uppercase">Auth Protocol v616</p>
                        </div>

                        <form className="space-y-6" onClick={e => e.stopPropagation()}>
                            <div className="space-y-2">
                                <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest ml-1">Identity Tag</label>
                                <input type="email" placeholder="P.PARKER@STARK.IND" className="w-full px-4 py-4 bg-black/60 border border-white/10 focus:border-red-600 outline-none text-white font-mono text-sm transition-all rounded-none backdrop-blur-md" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest ml-1">Neural Key</label>
                                <input type="password" placeholder="••••••••" className="w-full px-4 py-4 bg-black/60 border border-white/10 focus:border-blue-600 outline-none text-white font-mono text-sm transition-all rounded-none backdrop-blur-md" />
                            </div>

                            <button className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-5 transition-all duration-300 uppercase tracking-widest text-xs flex items-center justify-center gap-3 active:scale-95 shadow-[0_10px_30px_rgba(220,38,38,0.3)]">
                                <ShieldCheck className="w-5 h-5" />
                                Initialize Session
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* CRT OVERLAY */}
            <div className="absolute inset-0 pointer-events-none z-[100] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-20" />
        </div>
    );
}