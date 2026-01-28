"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Lock, ShieldCheck, Target, User, Zap, Phone, Mail, School, Eye, EyeOff, ArrowRight, ArrowLeft, Loader2
} from "lucide-react";

export default function RegisterPortal() {
    const [step, setStep] = useState(1);
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
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

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            alert("SECURITY ALERT: Passwords do not match");
            return;
        }

        setLoading(true);
        const res = await fetch("/api/auth/register", {
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
        router.push("/login");
    };

    return (
        <div className="relative min-h-screen w-full bg-[#020202] overflow-x-hidden flex flex-col items-center cursor-crosshair font-sans p-4 pt-30">
            <style jsx global>{`
                @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
                @keyframes laser-scan { 0% { left: -10%; opacity: 0; } 50% { opacity: 1; } 100% { left: 110%; opacity: 0; } }
                
                .stark-input-container {
                    background: rgba(0, 0, 0, 0.85);
                    border: 0.0625rem solid rgba(255, 255, 255, 0.1);
                    border-left: 0.2rem solid #991b1b;
                    border-radius: 0.4rem;
                    transition: all 0.3s ease;
                    position: relative;
                }
                .stark-input-container:focus-within {
                    border-color: rgba(220, 38, 38, 0.6);
                    border-left: 0.2rem solid #ff0000;
                    box-shadow: 0 0 15px rgba(220, 38, 38, 0.1);
                }
                .elegant-label {
                    font-weight: 900;
                    letter-spacing: 0.15em;
                    font-size: 0.6rem;
                    color: #ef4444;
                    text-transform: uppercase;
                }
            `}</style>

            {/* BACKGROUND VIDEO */}
            <div className="absolute inset-0 z-0">
                <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-40">
                    <source src="/Spider-Verse.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black" />
            </div>

            <div className="relative z-20 w-full max-w-[26rem]">
                {/* STEP INDICATOR */}
                <div className="flex justify-between mb-6 px-2">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex flex-col items-center gap-2">
                            <div className={`h-1 w-12 md:w-24 transition-all duration-500 ${step >= i ? "bg-red-600 shadow-[0_0_10px_#ef4444]" : "bg-zinc-800"}`} />
                            <span className={`text-[8px] font-black uppercase tracking-tighter ${step >= i ? "text-red-500" : "text-zinc-600"}`}>
                                Phase_0{i}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="relative bg-[#050505]/95 border border-white/10 p-6 sm:p-8 rounded-[1.5rem] shadow-2xl backdrop-blur-md overflow-hidden">

                    {/* CARD INTERNAL VIDEO SCAN */}
                    <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                        <video autoPlay loop muted playsInline className="w-full h-full object-cover scale-[2]">
                            <source src="/Amazing_Spiderman_Andrew_Garfield.mp4" type="video/mp4" />
                        </video>
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-red-600 animate-[scanline_4s_linear_infinite]" />
                    </div>

                    <div className="relative z-10">
                        <header className="flex flex-col items-center mb-8 text-center">
                            <div className="bg-red-600/10 p-3 rounded-full mb-3 border border-red-600/20">
                                <Target className="w-6 h-6 text-red-600 animate-pulse" />
                            </div>
                            <h1 className="text-2xl font-[1000] text-white tracking-tighter uppercase italic leading-none">
                                Entity<span className="text-red-600">_Sync</span>
                            </h1>
                            <p className="text-[9px] text-zinc-500 font-bold tracking-[0.4em] mt-3 uppercase">
                                Step {step} of 3 // {step === 1 ? "Identity" : step === 2 ? "Origin" : "Security"}
                            </p>
                        </header>

                        <form onSubmit={step === 3 ? handleSubmit : (e) => e.preventDefault()} className="space-y-4">

                            {/* STEP 1: IDENTITY */}
                            {step === 1 && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                                    <div className="space-y-1">
                                        <label className="elegant-label">Team Name</label>
                                        <div className="stark-input-container flex items-center px-4 py-3">
                                            <User className="w-4 h-4 text-red-700 mr-3 opacity-50" />
                                            <input name="name" value={form.name} onChange={handleChange} placeholder="TEAM NAME " className="bg-transparent border-none outline-none text-white text-sm w-full font-bold uppercase" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="elegant-label"> Gmail</label>
                                        <div className="stark-input-container flex items-center px-4 py-3">
                                            <Mail className="w-4 h-4 text-red-700 mr-3 opacity-50" />
                                            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="VARIANT@GMAIL.COM" className="bg-transparent border-none outline-none text-white text-sm w-full font-bold" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="elegant-label">Phone</label>
                                        <div className="stark-input-container flex items-center px-4 py-3">
                                            <Phone className="w-4 h-4 text-red-700 mr-3 opacity-50" />
                                            <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+91 XXX XXX XXXX" className="bg-transparent border-none outline-none text-white text-sm w-full font-bold uppercase" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 2: ORIGIN */}
                            {step === 2 && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                                    <div className="space-y-1">
                                        <label className="elegant-label">College Name</label>
                                        <div className="stark-input-container flex items-center px-4 py-3">
                                            <School className="w-4 h-4 text-red-700 mr-3 opacity-50" />
                                            <input name="college" value={form.college} onChange={handleChange} placeholder="COLLEGE_NAME" className="bg-transparent border-none outline-none text-white text-sm w-full font-bold uppercase" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="elegant-label">Department</label>
                                        <div className="stark-input-container flex items-center px-4 py-3">
                                            <ShieldCheck className="w-4 h-4 text-red-700 mr-3 opacity-50" />
                                            <input name="department" value={form.department} onChange={handleChange} placeholder="DEPARTMENT" className="bg-transparent border-none outline-none text-white text-sm w-full font-bold uppercase" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 3: SECURITY */}
                            {step === 3 && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                                    <div className="space-y-1">
                                        <label className="elegant-label">Password</label>
                                        <div className="stark-input-container flex items-center px-4 py-3">
                                            <Lock className="w-4 h-4 text-red-700 mr-3 opacity-50" />
                                            <input name="password" type={showPass ? "text" : "password"} value={form.password} onChange={handleChange} placeholder="••••••••" className="bg-transparent border-none outline-none text-white text-sm w-full font-bold" />
                                            <button type="button" onClick={() => setShowPass(!showPass)} className="opacity-50 hover:opacity-100">
                                                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="elegant-label">Confirm Password</label>
                                        <div className="stark-input-container flex items-center px-4 py-3">
                                            <ShieldCheck className="w-4 h-4 text-red-700 mr-3 opacity-50" />
                                            <input name="confirmPassword" type={showPass ? "text" : "password"} value={form.confirmPassword} onChange={handleChange} placeholder="••••••••" className="bg-transparent border-none outline-none text-white text-sm w-full font-bold" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* NAVIGATION BUTTONS */}
                            <div className="flex gap-3 pt-4">
                                {step > 1 && (
                                    <button type="button" onClick={prevStep} className="flex-1 border border-zinc-800 py-3 rounded-lg flex items-center justify-center gap-2 text-zinc-500 hover:text-white transition-all uppercase font-black text-[10px] tracking-widest">
                                        <ArrowLeft className="w-3 h-3" /> Back
                                    </button>
                                )}

                                {step < 3 ? (
                                    <button type="button" onClick={nextStep} className="flex-[2] bg-white text-black py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white transition-all uppercase font-black text-[10px] tracking-widest">
                                        Proceed <ArrowRight className="w-3 h-3" />
                                    </button>
                                ) : (
                                    <button type="submit" disabled={loading} className="flex-[2] bg-red-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-all uppercase font-black text-[10px] tracking-widest shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                                        {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                                        {loading ? "Syncing..." : "Finalize Sync"}
                                    </button>
                                )}
                            </div>
                        </form>

                        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center">
                            <button onClick={() => router.push("/login")} className="text-[9px] text-zinc-600 hover:text-red-500 transition-colors uppercase font-black tracking-[0.3em]">
                                Return to Secure Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* CRT OVERLAY */}
            <div className="absolute inset-0 pointer-events-none z-[100] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-10" />
        </div>
    );
}