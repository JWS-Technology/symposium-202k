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

    const [form, setForm] = useState<{
        name: string;
        email: string;
        phone: string;
        department: string;
        college: string;
        password: string;
        confirmPassword: string;
    }>({
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
            className="relative min-h-screen w-full bg-[#020202] overflow-hidden flex items-center justify-center cursor-crosshair font-sans p-2"
        >
            <style jsx global>{`
                @keyframes float-ui {
                    0%, 100% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-10px) scale(1.01); }
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
                }

                .stark-input-container {
                    background: rgba(0, 0, 0, 0.98);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-left: 3px solid #991b1b;
                    border-radius: 10px;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }

                .stark-input-container:focus-within {
                    border-color: rgba(220, 38, 38, 0.6);
                    border-left: 3px solid #ff0000;
                    box-shadow: 0 0 20px rgba(255, 0, 0, 0.2);
                }

                .stark-input-container:focus-within::after {
                    content: "";
                    position: absolute;
                    top: 0;
                    width: 1.5px;
                    height: 100%;
                    background: #ff0000;
                    animation: laser-scan 2s infinite;
                }

                .stark-field {
                    color: white;
                    font-weight: 800;
                    letter-spacing: 0.05em;
                    text-shadow: 0 0 8px rgba(255, 255, 255, 0.2);
                    caret-color: #ff0000;
                }

                .elegant-label {
                    font-weight: 900;
                    letter-spacing: 0.25em;
                    font-size: 9px;
                    color: #ef4444;
                    text-transform: uppercase;
                }

                .glitch-red { text-shadow: 2px 0 #ff0000, -2px 0 #00ffff; }
            `}</style>

            {/* BACKGROUND */}
            <div className="absolute inset-0 z-0">
                <img src="/wallpaper.gif" className="w-full h-full object-cover opacity-40" alt="city" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black" />
            </div>

            {/* INTERACTIVE WEB IMPACTS */}
            {webs.map(w => (
                <div key={w.id} className="absolute z-50 pointer-events-none" style={{ left: w.x, top: w.y }}>
                    <div className="w-10 h-10 border border-white/20 rounded-full animate-ping" />
                </div>
            ))}

            {/* COMPACT REGISTRATION CARD */}
            <div className={`relative z-40 w-full max-w-[400px] transition-all duration-500 ${isGlitching ? 'translate-x-0.5' : ''}`}>
                <div className="relative bg-[#050505]/98 border border-white/20 p-6 md:p-8 rounded-[1.5rem] shadow-2xl overflow-hidden">

                    {/* VIDEO BACKGROUND */}
                    <div className="absolute inset-0 z-0 opacity-30">
                        <video autoPlay loop muted playsInline className="w-full h-full object-cover merge-screen">
                            <source src="/Spider-Verse.mp4" type="video/mp4" />
                        </video>
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-red-600/30 animate-[scanline_4s_linear_infinite]" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex flex-col items-center mb-5 text-center">
                            <Target className={`w-10 h-10 mb-2 transition-all ${isGlitching ? 'text-blue-500' : 'text-red-600'}`} />
                            <h1 className={`text-3xl font-[1000] text-white tracking-tighter uppercase italic leading-none ${isGlitching ? 'glitch-red' : ''}`}>
                                Entity<span className="text-red-600">_Registry</span>
                            </h1>
                            <p className="text-[8px] text-gray-400 font-black tracking-[0.4em] uppercase mt-1">Stark Protocol v2.6</p>
                        </div>

                        <form className="space-y-2.5" onClick={e => e.stopPropagation()} onSubmit={handleSubmit}>
                            {/* NAME */}
                            <div className="space-y-1">
                                <label className="elegant-label">Team Name</label>
                                <div className="stark-input-container flex items-center px-4 py-2">
                                    <User className="w-3.5 h-3.5 text-red-700 mr-3 opacity-50" />
                                    {/* <input type="text" placeholder="FULL NAME" className="stark-field bg-transparent border-none outline-none text-xs w-full focus:ring-0 uppercase" /> */}
                                    <input
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        type="text"
                                        className="stark-field bg-transparent border-none outline-none text-xs w-full focus:ring-0 uppercase"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                {/* GMAIL */}
                                <div className="space-y-1">
                                    <label className="elegant-label">Gmail</label>
                                    <div className="stark-input-container flex items-center px-4 py-2">
                                        <Mail className="w-3.5 h-3.5 text-red-700 mr-2 opacity-50" />
                                        <input
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            type="email"
                                            className="stark-field bg-transparent border-none outline-none text-xs w-full focus:ring-0 "
                                        />
                                        {/* <input type="email" placeholder="ID" className="stark-field bg-transparent border-none outline-none text-xs w-full focus:ring-0 uppercase" /> */}
                                    </div>
                                </div>
                                {/* PHONE */}
                                <div className="space-y-1">
                                    <label className="elegant-label">Phone</label>
                                    <div className="stark-input-container flex items-center px-4 py-2">
                                        <Phone className="w-3.5 h-3.5 text-red-700 mr-2 opacity-50" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={form.phone}
                                            onChange={handleChange}
                                            placeholder="000..."
                                            className="stark-field bg-transparent border-none outline-none text-xs w-full focus:ring-0"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* COLLEGE */}
                            <div className="space-y-1">
                                <label className="elegant-label">Origin College</label>
                                <div className="stark-input-container flex items-center px-4 py-2">
                                    <School className="w-3.5 h-3.5 text-red-700 mr-3 opacity-50" />
                                    <input
                                        type="text"
                                        name="college"
                                        value={form.college}
                                        onChange={handleChange}
                                        placeholder="CAMPUS NAME"
                                        className="stark-field bg-transparent border-none outline-none text-xs w-full focus:ring-0 uppercase"
                                    />

                                </div>
                            </div>

                            {/* COLLEGE */}
                            <div className="space-y-1">
                                <label className="elegant-label">Department </label>
                                <div className="stark-input-container flex items-center px-4 py-2">
                                    <School className="w-3.5 h-3.5 text-red-700 mr-3 opacity-50" />
                                    <input
                                        type="text"
                                        name="department"
                                        value={form.department}
                                        onChange={handleChange}
                                        placeholder="Department.."
                                        className="stark-field bg-transparent border-none outline-none text-xs w-full focus:ring-0 uppercase"
                                    />

                                </div>
                            </div>

                            {/* NEW PASSWORD */}
                            <div className="space-y-1">
                                <label className="elegant-label">Access Key</label>
                                <div className="stark-input-container flex items-center px-4 py-2">
                                    <Lock className="w-3.5 h-3.5 text-red-700 mr-3 opacity-50" />
                                    <input
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        type={showPass ? "text" : "password"}
                                        className="stark-field bg-transparent border-none outline-none text-xs w-full focus:ring-0"
                                    />
                                    {/* <input type={showPass ? "text" : "password"} placeholder="KEY_616" className="stark-field bg-transparent border-none outline-none text-xs w-full focus:ring-0" /> */}
                                    <button type="button" onClick={() => setShowPass(!showPass)}>
                                        {showPass ? <EyeOff className="w-4 h-4 text-red-600" /> : <Eye className="w-4 h-4 text-red-800 opacity-40" />}
                                    </button>
                                </div>
                            </div>

                            {/* CONFIRM PASSWORD */}
                            <div className="space-y-1">
                                <label className="elegant-label">Verify Key</label>
                                <div className="stark-input-container flex items-center px-4 py-2">
                                    <ShieldCheck className="w-3.5 h-3.5 text-red-700 mr-3 opacity-50" />
                                    <input
                                        name="confirmPassword"
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                        type={showConfirm ? "text" : "password"}
                                        className="stark-field bg-transparent border-none outline-none text-xs w-full focus:ring-0"
                                    />
                                    {/* <input type={showConfirm ? "text" : "password"} placeholder="REPEAT_KEY" className="stark-field bg-transparent border-none outline-none text-xs w-full focus:ring-0" /> */}
                                    <button type="button" onClick={() => setShowConfirm(!showConfirm)}>
                                        {showConfirm ? <EyeOff className="w-4 h-4 text-red-600" /> : <Eye className="w-4 h-4 text-red-800 opacity-40" />}
                                    </button>
                                </div>
                            </div>

                            {/* BUTTON */}
                            <button className="w-full relative mt-4 group overflow-hidden rounded-lg active:scale-[0.96] transition-all">
                                <div className="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                <div className="relative border border-red-600 py-3.5 rounded-lg flex items-center justify-center gap-2 group-hover:border-white/20">
                                    <Zap className="w-4 h-4 text-red-600 group-hover:text-white" />
                                    <span className="text-white font-black uppercase tracking-[0.4em] text-[10px]">Initialize Enrollment</span>
                                </div>
                            </button>
                        </form>

                        <div className="mt-5 flex justify-center">
                            <button className="text-[7px] text-gray-500 hover:text-red-500 transition-colors uppercase font-black tracking-[0.3em]">
                                Return to Secure Portal
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