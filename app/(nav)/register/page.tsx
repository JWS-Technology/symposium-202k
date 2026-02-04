"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Lock, ShieldCheck, Target, User, Zap, Phone, Mail, School, Eye, EyeOff, ArrowRight, ArrowLeft, Loader2
} from "lucide-react";

export default function RegisterPortal() {
    const [step, setStep] = useState(1);
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
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
        if (errorMsg) setErrorMsg("");
    };

    const validateStep = () => {
        if (step === 1 && (!form.name || !form.email || !form.phone)) return "IDENTITY_REQUIRED: Fill all fields.";
        if (step === 2 && (!form.college || !form.department)) return "ORIGIN_REQUIRED: Sector data missing.";
        return null;
    };

    const nextStep = () => {
        const error = validateStep();
        if (error) {
            setErrorMsg(error);
            return;
        }
        setStep(prev => prev + 1);
    };

    const prevStep = () => setStep(prev => prev - 1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            setErrorMsg("SECURITY_MISMATCH: Passwords do not align.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "SYNC_FAILED");

            router.push("/login");
        } catch (err: any) {
            setErrorMsg(err.message.toUpperCase());
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full bg-[#020202] overflow-x-hidden flex flex-col items-center justify-center cursor-crosshair font-sans p-4">
            <style jsx global>{`
                @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
                .stark-input-container {
                    background: rgba(0, 0, 0, 0.6);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-left: 3px solid #991b1b;
                    transition: all 0.3s ease;
                }
                .stark-input-container:focus-within {
                    border-color: rgba(220, 38, 38, 0.6);
                    border-left: 3px solid #ff0000;
                    box-shadow: 0 0 20px rgba(220, 38, 38, 0.15);
                }
            `}</style>

            {/* MAIN BACKGROUND VIDEO */}
            <div className="absolute inset-0 z-0">
                <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-40 grayscale-[0.2]">
                    <source src="/Spider-Verse.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
            </div>

            <div className="relative z-20 w-full max-w-[26rem]">
                {/* STEP INDICATOR */}
                <div className="flex justify-between mb-8 px-2">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex flex-col items-center gap-2">
                            <motion.div
                                initial={false}
                                animate={{ backgroundColor: step >= i ? "#dc2626" : "#27272a", boxShadow: step >= i ? "0 0 10px #ef4444" : "none" }}
                                className="h-1 w-12 md:w-24 rounded-full transition-all duration-500"
                            />
                            <span className={`text-[9px] font-black uppercase tracking-widest ${step >= i ? "text-red-500" : "text-zinc-600"}`}>
                                Phase_0{i}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="relative bg-[#050505]/90 border border-white/10 p-6 sm:p-8 rounded-[2rem] shadow-2xl backdrop-blur-xl overflow-hidden">

                    {/* CARD INTERNAL VIDEO OVERLAY */}
                    <div className="absolute inset-0 z-0 opacity-[0.07] pointer-events-none">
                        <video autoPlay loop muted playsInline className="w-full h-full object-cover scale-150">
                            <source src="/Amazing_Spiderman_Andrew_Garfield.mp4" type="video/mp4" />
                        </video>
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-red-600/50 blur-sm animate-[scanline_4s_linear_infinite]" />
                    </div>

                    <div className="relative z-10">
                        <header className="flex flex-col items-center mb-8 text-center">
                            <div className="bg-red-600/10 p-3 rounded-2xl mb-3 border border-red-600/20">
                                <Target className="w-6 h-6 text-red-600 animate-pulse" />
                            </div>
                            <h1 className="text-2xl font-black text-white tracking-tighter uppercase italic leading-none">
                                Register<span className="text-red-600">_Now</span>
                            </h1>
                            <p className="text-[9px] text-zinc-500 font-bold tracking-[0.4em] mt-3 uppercase">
                                {step === 1 ? "Identity_Verification" : step === 2 ? "Origin_Trace" : "Security_Encryption"}
                            </p>
                        </header>

                        <form onSubmit={step === 3 ? handleSubmit : (e) => e.preventDefault()} className="space-y-4">
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div key="s1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black uppercase text-red-500 tracking-widest ml-1">Team Name</label>
                                            <div className="stark-input-container flex items-center px-4 py-3 rounded-xl">
                                                <User className="w-4 h-4 text-red-700 mr-3 opacity-50" />
                                                <input name="name" value={form.name} onChange={handleChange} placeholder="TEAM IDENTIFIER" className="bg-transparent border-none outline-none text-white text-sm w-full font-bold uppercase" />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black uppercase text-red-500 tracking-widest ml-1">Gmail</label>
                                            <div className="stark-input-container flex items-center px-4 py-3 rounded-xl">
                                                <Mail className="w-4 h-4 text-red-700 mr-3 opacity-50" />
                                                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="TEAM@GMAIL.COM" className="bg-transparent border-none outline-none text-white text-sm w-full font-bold uppercase" />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black uppercase text-red-500 tracking-widest ml-1">Phone</label>
                                            <div className="stark-input-container flex items-center px-4 py-3 rounded-xl">
                                                <Phone className="w-4 h-4 text-red-700 mr-3 opacity-50" />
                                                <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+91 XXX XXX XXXX" className="bg-transparent border-none outline-none text-white text-sm w-full font-bold" />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div key="s2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black uppercase text-red-500 tracking-widest ml-1">College Name</label>
                                            <div className="stark-input-container flex items-center px-4 py-3 rounded-xl">
                                                <School className="w-4 h-4 text-red-700 mr-3 opacity-50" />
                                                <input name="college" value={form.college} onChange={handleChange} placeholder="INSTITUTION NAME" className="bg-transparent border-none outline-none text-white text-sm w-full font-bold uppercase" />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black uppercase text-red-500 tracking-widest ml-1">Department</label>
                                            <div className="stark-input-container flex items-center px-4 py-3 rounded-xl">
                                                <ShieldCheck className="w-4 h-4 text-red-700 mr-3 opacity-50" />
                                                <input name="department" value={form.department} onChange={handleChange} placeholder="SECTOR / DEPT" className="bg-transparent border-none outline-none text-white text-sm w-full font-bold uppercase" />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 3 && (
                                    <motion.div key="s3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black uppercase text-red-500 tracking-widest ml-1">Password</label>
                                            <div className="stark-input-container flex items-center px-4 py-3 rounded-xl">
                                                <Lock className="w-4 h-4 text-red-700 mr-3 opacity-50" />
                                                <input name="password" type={showPass ? "text" : "password"} value={form.password} onChange={handleChange} placeholder="••••••••" className="bg-transparent border-none outline-none text-white text-sm w-full font-bold" />
                                                <button type="button" onClick={() => setShowPass(!showPass)} className="text-zinc-600 hover:text-white">
                                                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black uppercase text-red-500 tracking-widest ml-1">Confirm Password</label>
                                            <div className="stark-input-container flex items-center px-4 py-3 rounded-xl">
                                                <ShieldCheck className="w-4 h-4 text-red-700 mr-3 opacity-50" />
                                                <input name="confirmPassword" type={showPass ? "text" : "password"} value={form.confirmPassword} onChange={handleChange} placeholder="••••••••" className="bg-transparent border-none outline-none text-white text-sm w-full font-bold" />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* ERROR DISPLAY */}
                            {errorMsg && (
                                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-[10px] font-black text-center uppercase tracking-widest">
                                    !! {errorMsg} !!
                                </motion.p>
                            )}

                            {/* NAVIGATION BUTTONS */}
                            <div className="flex gap-3 pt-4">
                                {step > 1 && (
                                    <button type="button" onClick={prevStep} className="flex-1 border border-zinc-800 py-3 rounded-xl flex items-center justify-center gap-2 text-zinc-500 hover:text-white transition-all uppercase font-black text-[10px] tracking-widest bg-black/40">
                                        <ArrowLeft className="w-3 h-3" /> Back
                                    </button>
                                )}

                                {step < 3 ? (
                                    <button type="button" onClick={nextStep} className="flex-[2] bg-white text-black py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white transition-all uppercase font-black text-[10px] tracking-widest shadow-lg">
                                        Proceed <ArrowRight className="w-3 h-3" />
                                    </button>
                                ) : (
                                    <button type="submit" disabled={loading} className="flex-[2] bg-red-600 text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-all uppercase font-black text-[10px] tracking-widest shadow-[0_0_20px_rgba(220,38,38,0.4)]">
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

            {/* CRT OVERLAY Decor */}
            <div className="absolute inset-0 pointer-events-none z-[100] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-10" />
        </div>
    );
}