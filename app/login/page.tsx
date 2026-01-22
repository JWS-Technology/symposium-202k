"use client";

import { useState, useEffect, useRef } from "react";
import { Mail, Lock, Target, ShieldCheck } from "lucide-react";

const SIDE_QUOTES = [
    "With great power comes great responsibility.",
    "Expect the disappointment, you will never be disappointed.",
    "It's a leap of faith. That's all it is, Miles.",
    "Anyone can wear the mask. You could wear the mask.",
    "The choices we make define who we are.",
    "You're not Spider-Man. You're a kid who got bit by a spider.",
    "I'm gonna need a rain check on that.",
    "We are who we choose to be. Now, choose!"
];

export default function LoginPage() {
    const [showForm, setShowForm] = useState(false);
    const [isGlitching, setIsGlitching] = useState(false);
    const [isClickGlitching, setIsClickGlitching] = useState(false);
    const [webs, setWebs] = useState<{ id: number; x: number; y: number }[]>([]);

    useEffect(() => {
        const timer = setTimeout(() => setShowForm(true), 500);

        // Random background glitching
        const glitchInterval = setInterval(() => {
            setIsGlitching(true);
            setTimeout(() => setIsGlitching(false), 150);
        }, 5000);

        return () => {
            clearTimeout(timer);
            clearInterval(glitchInterval);
        };
    }, []);

    const handleWebShoot = (e: React.MouseEvent) => {
        const newWeb = { id: Date.now(), x: e.clientX, y: e.clientY };
        setWebs((prev) => [...prev, newWeb]);
        setIsClickGlitching(true);

        // Remove web and glitch after animation
        setTimeout(() => {
            setWebs((prev) => prev.filter((w) => w.id !== newWeb.id));
            setIsClickGlitching(false);
        }, 600);
    };

    return (
        <div
            onClick={handleWebShoot}
            className={`relative min-h-screen flex flex-col items-center justify-center bg-[#050505] overflow-hidden transition-all duration-75 
            ${isClickGlitching ? "scale-[1.02] saturate-200" : "scale-100"}`}
        >

            <style jsx>{`
                @keyframes swing-1 {
                    0% { transform: translate(-20vw, -20vh) rotate(45deg); }
                    100% { transform: translate(120vw, 40vh) rotate(45deg); }
                }
                @keyframes swing-2 {
                    0% { transform: translate(120vw, 20vh) rotate(-45deg); }
                    100% { transform: translate(-20vw, 80vh) rotate(-45deg); }
                }
                @keyframes web-expand {
                    0% { transform: scale(0); opacity: 1; }
                    100% { transform: scale(3); opacity: 0; }
                }
                @keyframes crawl {
                    0% { transform: translateY(110vh); }
                    100% { transform: translateY(-20vh); }
                }
                .swing-fast { animation: swing-1 3s ease-in-out infinite; }
                .swing-slow { animation: swing-2 5s ease-in-out infinite; animation-delay: 2s; }
                .spider-crawl { animation: crawl 15s linear infinite; }
                .web-effect { animation: web-expand 0.6s ease-out forwards; }
                
                .multiverse-glitch {
                    text-shadow: 3px 0 #ff0000, -3px 0 #0000ff;
                    filter: hue-rotate(90deg);
                }
            `}</style>

            {/* INTERACTIVE WEB SHOOT (REAL WEBS ON CLICK) */}
            {webs.map((web) => (
                <div key={web.id} className="absolute z-50 pointer-events-none" style={{ left: web.x, top: web.y }}>
                    <svg width="200" height="200" className="web-effect -translate-x-1/2 -translate-y-1/2">
                        <g stroke="white" strokeWidth="1.5" fill="none">
                            {[...Array(12)].map((_, i) => (
                                <line key={i} x1="100" y1="100"
                                    x2={`${100 + 80 * Math.cos((i * 30 * Math.PI) / 180)}`}
                                    y2={`${100 + 80 * Math.sin((i * 30 * Math.PI) / 180)}`}
                                />
                            ))}
                            <circle cx="100" cy="100" r="20" strokeDasharray="5,5" />
                            <circle cx="100" cy="100" r="40" strokeDasharray="10,5" />
                        </g>
                    </svg>
                </div>
            ))}

            {/* SWINGING SPIDER-MEN (MULTIPLE) */}
            <div className="swing-fast absolute z-10 pointer-events-none"><SpiderManSilhouette color="#dc2626" /></div>
            <div className="swing-slow absolute z-10 pointer-events-none opacity-50"><SpiderManSilhouette color="#2563eb" /></div>

            {/* CRAWLING SPIDERS (SIDES) */}
            <div className="spider-crawl absolute left-10 opacity-20"><SpiderIcon /></div>
            <div className="spider-crawl absolute right-10 opacity-20" style={{ animationDelay: '7s' }}><SpiderIcon /></div>

            {/* MULTIVERSE QUOTES (SIDES) */}
            <div className="absolute inset-0 z-10 pointer-events-none p-10 hidden lg:flex justify-between items-center font-mono uppercase">
                <div className="space-y-24">
                    {SIDE_QUOTES.slice(0, 4).map((q, i) => (
                        <div key={i} className="max-w-[200px] opacity-20 hover:opacity-100 transition-opacity">
                            <p className="text-red-600 text-[10px] mb-1">DATA_STREAM_{i}</p>
                            <p className="text-white text-xs italic">"{q}"</p>
                        </div>
                    ))}
                </div>
                <div className="space-y-24 text-right">
                    {SIDE_QUOTES.slice(4).map((q, i) => (
                        <div key={i} className="max-w-[200px] opacity-20 hover:opacity-100 transition-opacity">
                            <p className="text-blue-500 text-[10px] mb-1">DATA_STREAM_{i + 4}</p>
                            <p className="text-white text-xs italic text-right">"{q}"</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* LOGIN CARD */}
            <div className={`relative z-20 w-full max-w-md px-6 transition-all duration-700 
                ${showForm ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
                ${isClickGlitching ? "multiverse-glitch" : ""}`}>

                <div className="bg-black/90 backdrop-blur-3xl p-8 border-y-2 border-red-600 relative overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)]">

                    {/* Interior Scanlines */}
                    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-40"></div>

                    <div className="flex justify-between items-center mb-10 relative z-10">
                        <div>
                            <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase">
                                Spider<span className="text-red-600">Symp</span>
                            </h1>
                            <p className="text-[10px] text-gray-500 font-mono tracking-widest mt-1">Stark-OS Identity Portal</p>
                        </div>
                        <Target className={`w-10 h-10 transition-colors ${isClickGlitching ? 'text-blue-500' : 'text-red-600'}`} />
                    </div>

                    <form className="space-y-6 relative z-10" onClick={(e) => e.stopPropagation()}>
                        <div className="group">
                            <label className="text-[10px] font-bold text-gray-400 mb-2 block tracking-widest uppercase">Agent ID</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                <input type="email" placeholder="P.PARKER@STARK.CORP" className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 focus:border-red-600 outline-none transition-all text-sm font-mono text-white" />
                            </div>
                        </div>

                        <div className="group">
                            <label className="text-[10px] font-bold text-gray-400 mb-2 block tracking-widest uppercase">Neural Key</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                <input type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 focus:border-blue-600 outline-none transition-all text-sm font-mono text-white" />
                            </div>
                        </div>

                        <button className="w-full bg-red-700 hover:bg-blue-700 text-white font-black py-4 transition-all duration-300 uppercase tracking-widest text-xs flex items-center justify-center gap-2 group shadow-[5px_5px_0px_#1e40af]">
                            <ShieldCheck className="w-4 h-4" />
                            Initialize Access
                        </button>
                    </form>
                </div>
            </div>

            {/* Global Overlay */}
            <div className="absolute inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-20"></div>
        </div>
    );
}

// Sub-components for animations
function SpiderManSilhouette({ color }: { color: string }) {
    return (
        <div className="relative">
            <svg width="60" height="60" viewBox="0 0 24 24" fill={color}>
                <path d="M12 2C11.4 2 11 2.4 11 3C11 3.6 11.4 4 12 4C12.6 4 13 3.6 13 3C13 2.4 12.6 2 12 2ZM7 4C6.4 4 6 4.4 6 5C6 5.6 6.4 6 7 6C7.6 6 8 5.6 8 5C8 4.4 7.6 4 7 4ZM17 4C16.4 4 16 4.4 16 5C16 5.6 16.4 6 17 6C17.6 6 18 5.6 18 5C18 4.4 17.6 4 17 4ZM12 6C9.8 6 8 7.8 8 10C8 11.4 8.7 12.6 9.8 13.3L7 22H9L11 15H13L15 22H17L14.2 13.3C15.3 12.6 16 11.4 16 10C16 7.8 14.2 6 12 6Z" />
            </svg>
            <div className="absolute top-0 right-full w-[1000px] h-[1px] bg-white/20 origin-right -rotate-12"></div>
        </div>
    );
}

function SpiderIcon() {
    return (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C11.5 2 11 2.5 11 3C11 3.5 11.5 4 12 4C12.5 4 13 3.5 13 3C13 2.5 12.5 2 12 2ZM12 6C9.8 6 8 7.8 8 10C8 11.4 8.7 12.6 9.8 13.3L7 22H9L11 15H13L15 22H17L14.2 13.3C15.3 12.6 16 11.4 16 10C16 7.8 14.2 6 12 6Z" />
        </svg>
    );
}