"use client";

import { useState, useEffect } from "react";
import { Mail, Lock, Target, ShieldCheck } from "lucide-react";

const DIALOGUES = [
    "With great power comes great responsibility.",
    "Expect disappointment and you'll never be disappointed.",
    "It's the choices that make us who we are, and we can always choose to do what's right.",
    "Anyone can wear the mask. You could wear the mask.",
    "Being Spider-Man is a sacrifice. That's the job.",
    "I'm gonna need a rain check on that.",
    "Sometimes to do what's right, we have to be steady and give up the things we want the most."
];

export default function LoginPage() {
    const [showForm, setShowForm] = useState(false);
    const [dialogue, setDialogue] = useState("");
    const [isGlitching, setIsGlitching] = useState(false);

    useEffect(() => {
        setDialogue(DIALOGUES[Math.floor(Math.random() * DIALOGUES.length)]);
        const timer = setTimeout(() => setShowForm(true), 500);

        // Subtle Multiverse Glitch (Color shift, no shaking)
        const glitchInterval = setInterval(() => {
            setIsGlitching(true);
            setTimeout(() => setIsGlitching(false), 150);
        }, 4000);

        return () => {
            clearTimeout(timer);
            clearInterval(glitchInterval);
        };
    }, []);

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#020202] overflow-hidden">

            {/* Custom Movie Animations */}
            <style jsx>{`
                @keyframes web-shoot {
                    0% { transform: scale(0.2) translate(-50%, -50%); opacity: 0; stroke-dashoffset: 1000; }
                    70% { opacity: 1; }
                    100% { transform: scale(1) translate(0, 0); opacity: 0.3; stroke-dashoffset: 0; }
                }
                @keyframes web-sway {
                    0%, 100% { transform: rotate(-1deg) scale(1); }
                    50% { transform: rotate(1deg) scale(1.02); }
                }
                .animate-web-shoot {
                    stroke-dasharray: 1000;
                    animation: web-shoot 1.2s cubic-bezier(0.19, 1, 0.22, 1) forwards;
                }
                .animate-web-sway {
                    animation: web-sway 10s ease-in-out infinite;
                }
                .chromatic-text {
                    text-shadow: 1.5px 0 #ff0000, -1.5px 0 #0000ff;
                }
            `}</style>

            {/* DYNAMIC MOVIE WEB BACKGROUND */}
            <div className="absolute inset-0 z-0 pointer-events-none animate-web-sway">
                <svg width="100%" height="100%" className="absolute inset-0">
                    <g fill="none" stroke="white" strokeWidth="0.5" className="animate-web-shoot">
                        {/* Radial lines shooting from center */}
                        {[...Array(12)].map((_, i) => (
                            <line
                                key={i}
                                x1="50%" y1="50%"
                                x2={`${50 + 80 * Math.cos((i * 30 * Math.PI) / 180)}%`}
                                y2={`${50 + 80 * Math.sin((i * 30 * Math.PI) / 180)}%`}
                            />
                        ))}
                        {/* Connecting web rings */}
                        {[...Array(5)].map((_, i) => (
                            <circle
                                key={i}
                                cx="50%" cy="50%"
                                r={`${(i + 1) * 12}%`}
                                strokeDasharray="10,10"
                            />
                        ))}
                    </g>
                </svg>
            </div>

            {/* SCANLINE OVERLAY (Movie monitor feel) */}
            <div className="absolute inset-0 pointer-events-none z-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px]"></div>

            {/* MAIN LOGIN INTERFACE */}
            <div className="relative z-20 flex flex-col items-center w-full max-w-lg px-6">

                {/* Dialogue Section - Centered and Clear */}
                <div className={`mb-10 text-center transition-all duration-1000 ${showForm ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"}`}>
                    <p className="text-red-600 font-mono text-[10px] tracking-[0.4em] uppercase mb-3">Neural Link: Symposium Earth-616</p>
                    <h2 className={`text-white italic text-xl md:text-3xl font-black tracking-tighter transition-all duration-150 ${isGlitching ? 'chromatic-text scale-[1.02]' : ''}`}>
                        "{dialogue.toUpperCase()}"
                    </h2>
                    <div className="h-1 w-20 bg-blue-600 mx-auto mt-6 -skew-x-12 shadow-[0_0_15px_#2563eb]"></div>
                </div>

                {/* Login Card */}
                <div
                    className={`w-full max-w-md transition-all duration-700 transform 
                    ${showForm ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}
                    ${isGlitching ? 'scale-[0.995]' : 'scale-100'}`}
                >
                    <div className="bg-black/80 backdrop-blur-2xl p-8 border border-white/10 rounded-lg relative shadow-[0_0_60px_rgba(0,0,0,0.9)]">

                        {/* Corner Accents */}
                        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-red-600"></div>
                        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-blue-600"></div>

                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h1 className={`text-3xl font-black italic tracking-tighter text-white transition-all ${isGlitching ? 'chromatic-text' : ''}`}>
                                    ACCESS<span className="text-red-600">PORTAL</span>
                                </h1>
                                <p className="text-[9px] text-gray-500 font-mono uppercase tracking-widest mt-1">Stark Industries v4.0</p>
                            </div>
                            <Target className={`w-8 h-8 transition-colors duration-500 ${isGlitching ? 'text-blue-500' : 'text-red-600'}`} />
                        </div>

                        <form className="space-y-6">
                            <div className="group">
                                <label className="text-[10px] font-bold text-gray-400 mb-2 block tracking-widest uppercase">Designation</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-red-500 transition-colors" />
                                    <input
                                        type="email"
                                        placeholder="GUEST@SYMPOSIUM.COM"
                                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded focus:border-red-600 focus:bg-white/10 outline-none transition-all text-sm font-mono text-white placeholder:text-gray-700"
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="text-[10px] font-bold text-gray-400 mb-2 block tracking-widest uppercase">Neural Key</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded focus:border-blue-600 focus:bg-white/10 outline-none transition-all text-sm font-mono text-white placeholder:text-gray-700"
                                    />
                                </div>
                            </div>

                            <button className="w-full bg-red-600 hover:bg-blue-700 text-white font-black py-4 rounded transition-all duration-300 uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(220,38,38,0.3)]">
                                <ShieldCheck className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                                Initialize Session
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Ambient Tech Labels */}
            <div className="fixed bottom-10 w-full px-12 flex justify-between text-gray-700 font-mono text-[9px] uppercase tracking-widest opacity-40">
                <div className="hidden md:block">
                    Symposium Status: Online<br />
                    Network: Encrypted_Mesh
                </div>
                <div className="text-right hidden md:block">
                    Loc: New York City<br />
                    Agent: Identified
                </div>
            </div>
        </div>
    );
}