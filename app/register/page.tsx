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
    const [isGlitching, setIsGlitching] = useState(false);
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
            body: JSON.stringify({
                name: form.name,
                email: form.email,
                phone: form.phone,
                department: form.department,
                college: form.college,
                password: form.password,
            }),
        });

        const data = await res.json();
        if (!res.ok) {
            alert(data.message);
            return;
        }
        router.push("/login");
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setIsGlitching(true);
            setTimeout(() => setIsGlitching(false), 120);
        }, 4500);
        return () => clearInterval(interval);
    }, []);

    const handleInteraction = (e: React.MouseEvent) => {
        const id = Date.now();
        setWebs(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);
        setTimeout(() => {
            setWebs(prev => prev.filter(w => w.id !== id));
        }, 600);
    };

    return (
        <div
            onClick={handleInteraction}
            className="relative min-h-screen w-full bg-[#020202] overflow-hidden flex items-center justify-center cursor-default font-sans p-2 pt-16"
        >
            <style jsx global>{`
                @keyframes scanline {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100%); }
                }
                
                input:-webkit-autofill,
                input:-webkit-autofill:hover,
                input:-webkit-autofill:focus,
                input:-webkit-autofill:active {
                    -webkit-box-shadow: 0 0 0 30px #0a0a0a inset !important;
                    -webkit-text-fill-color: white !important;
                    transition: background-color 5000s ease-in-out 0s;
                }

                .stark-input-container {
                    background: rgba(0, 0, 0, 0.75);
                    backdrop-filter: blur(8px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-left: 2px solid #991b1b;
                    border-radius: 4px;
                    transition: all 0.3s ease;
                    position: relative;
                    z-index: 50;
                }

                .stark-input-container:focus-within {
                    border-color: rgba(220, 38, 38, 0.6);
                    border-left: 2px solid #ff0000;
                    background: #000;
                }

                .stark-field {
                    color: white !important;
                    font-weight: 600;
                    letter-spacing: 0.05em;
                    background: transparent !important;
                }

                .elegant-label {
                    font-weight: 800;
                    letter-spacing: 0.15em;
                    font-size: 6.5px;
                    color: #ef4444;
                    text-transform: uppercase;
                }
                .glitch-red { text-shadow: 1.5px 0 #ff0000, -1.5px 0 #00ffff; }
            `}</style>

            {/* HD BACKGROUND LAYER - GWEN FALL */}
            <div className="absolute inset-0 z-0">
                <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-60">
                    <source src="/gwen_fall.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black" />
            </div>

            {/* CARD CONTAINER - HEIGHT REDUCED */}
            <div className={`relative z-40 w-full max-w-[440px] transition-all duration-500 ${isGlitching ? 'translate-x-0.5' : ''}`}>
                <div className="relative bg-[#050505]/85 border border-white/20 p-4 md:p-6 rounded-[1.2rem] shadow-[0_0_40px_rgba(0,0,0,0.9)] overflow-hidden backdrop-blur-md">

                    {/* DECORATIVE VIDEO - 1.5x ZOOMED */}
                    <div className="absolute inset-0 z-0 opacity-60 pointer-events-none overflow-hidden">
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute top-0 left-0 w-full h-full object-cover scale-[1.5] brightness-125"
                            style={{ mixBlendMode: 'screen', transformOrigin: 'center center' }}
                        >
                            <source src="/Amazing_Spiderman_Andrew_Garfield.mp4" type="video/mp4" />
                        </video>
                        <div className="absolute inset-0 bg-black/25" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex flex-col items-center mb-3 text-center">
                            <Target className={`w-5 h-5 mb-0.5 transition-all ${isGlitching ? 'text-blue-500' : 'text-red-600'}`} />
                            <h1 className={`text-lg font-[1000] text-white tracking-tighter uppercase italic leading-none ${isGlitching ? 'glitch-red' : ''}`}>
                                Entity<span className="text-red-600">_Registry</span>
                            </h1>
                            <p className="text-[6px] text-gray-400 font-black tracking-[0.3em] uppercase mt-0.5">Secure Entry Protocol</p>
                        </div>

                        {/* TIGHTENED FORM FIELDS */}
                        <form className="space-y-2" onSubmit={handleSubmit}>

                            <div className="space-y-0.5">
                                <label className="elegant-label">Team Name</label>
                                <div className="stark-input-container flex items-center px-2 py-1.5">
                                    <User className="w-3 h-3 text-red-700 mr-2 opacity-50" />
                                    <input
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="ID_NAME"
                                        className="stark-field bg-transparent border-none outline-none text-[10px] w-full focus:ring-0 uppercase placeholder:opacity-20"
                                    />
                                </div>
                            </div>

                            <div className="space-y-0.5">
                                <label className="elegant-label">Gmail</label>
                                <div className="stark-input-container flex items-center px-2 py-1.5">
                                    <Mail className="w-3 h-3 text-red-700 mr-2 opacity-50" />
                                    <input
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        type="email"
                                        placeholder="variant@gmail.com"
                                        className="stark-field bg-transparent border-none outline-none text-[10px] w-full focus:ring-0 placeholder:opacity-20"
                                    />
                                </div>
                            </div>

                            <div className="space-y-0.5">
                                <label className="elegant-label">Phone</label>
                                <div className="stark-input-container flex items-center px-2 py-1.5">
                                    <Phone className="w-3 h-3 text-red-700 mr-2 opacity-50" />
                                    <input
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        type="tel"
                                        placeholder="+00 00000000"
                                        className="stark-field bg-transparent border-none outline-none text-[10px] w-full focus:ring-0"
                                    />
                                </div>
                            </div>

                            <div className="space-y-0.5">
                                <label className="elegant-label">Origin College</label>
                                <div className="stark-input-container flex items-center px-2 py-1.5">
                                    <School className="w-3 h-3 text-red-700 mr-2 opacity-50" />
                                    <input
                                        name="college"
                                        value={form.college}
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="CAMPUS"
                                        className="stark-field bg-transparent border-none outline-none text-[10px] w-full focus:ring-0 uppercase"
                                    />
                                </div>
                            </div>

                            <div className="space-y-0.5">
                                <label className="elegant-label">Department</label>
                                <div className="stark-input-container flex items-center px-2 py-1.5">
                                    <ShieldCheck className="w-3 h-3 text-red-700 mr-2 opacity-50" />
                                    <input
                                        name="department"
                                        value={form.department}
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="SECTOR"
                                        className="stark-field bg-transparent border-none outline-none text-[10px] w-full focus:ring-0 uppercase"
                                    />
                                </div>
                            </div>

                            <div className="space-y-0.5">
                                <label className="elegant-label">Access Key</label>
                                <div className="stark-input-container flex items-center px-2 py-1.5">
                                    <Lock className="w-3 h-3 text-red-700 mr-2 opacity-50" />
                                    <input
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        type={showPass ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="stark-field bg-transparent border-none outline-none text-[10px] w-full focus:ring-0"
                                    />
                                    <button type="button" onClick={() => setShowPass(!showPass)} className="relative z-50 ml-1">
                                        {showPass ? <EyeOff className="w-3 h-3 text-red-600" /> : <Eye className="w-3 h-3 text-red-800 opacity-40" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-0.5">
                                <label className="elegant-label">Verify Key</label>
                                <div className="stark-input-container flex items-center px-2 py-1.5">
                                    <ShieldCheck className="w-3 h-3 text-red-700 mr-2 opacity-50" />
                                    <input
                                        name="confirmPassword"
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                        type={showConfirm ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="stark-field bg-transparent border-none outline-none text-[10px] w-full focus:ring-0"
                                    />
                                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="relative z-50 ml-1">
                                        {showConfirm ? <EyeOff className="w-3 h-3 text-red-600" /> : <Eye className="w-3 h-3 text-red-800 opacity-40" />}
                                    </button>
                                </div>
                            </div>

                            <button className="w-full relative mt-2 group overflow-hidden rounded active:scale-[0.97] transition-all">
                                <div className="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                <div className="relative border border-red-600 py-2 rounded flex items-center justify-center gap-2">
                                    <Zap className="w-3 h-3 text-red-600 group-hover:text-white" />
                                    <span className="text-white font-black uppercase tracking-[0.25em] text-[9px]">Initialize</span>
                                </div>
                            </button>
                        </form>

                        <div className="mt-2.5 flex justify-center">
                            <button
                                onClick={() => router.push("/login")}
                                className="text-[7px] text-gray-500 hover:text-red-500 transition-colors uppercase font-black tracking-[0.15em]"
                            >
                                Back to Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* CRT OVERLAY */}
            <div className="absolute inset-0 pointer-events-none z-[100] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%)] bg-[length:100%_2px] opacity-10" />
        </div>
    );
}