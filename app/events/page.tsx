"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface Event {
    _id: string;
    title: string;
    description: string;
    eventType: "TECHNICAL" | "NON-TECHNICAL" | "CULTURALS";
    minPlayers?: number;
    maxPlayers?: number;
}

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch("/api/events-fetch");
                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(text);
                }
                const json = await res.json();
                setEvents(json.data);
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 bg-[#020202] text-white">
            <div className="max-w-7xl mx-auto">
                {/* Page Header - Brutalist Style */}
                <div className="mb-16 relative">
                    <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter opacity-10 absolute -top-10 -left-2 select-none">
                        Events
                    </h1>
                    <h1 className="relative text-5xl md:text-7xl font-black italic uppercase border-l-8 border-red-600 pl-6">
                        Events <span className="text-red-600">Portal</span>
                    </h1>
                </div>

                {/* Grid Container */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        // Render 3 skeleton cards while loading
                        [...Array(3)].map((_, i) => <LoadingCard key={i} />)
                    ) : (
                        events.map((event) => (
                            <SpiderCard key={event._id} event={event} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

/* ---------------- Components ---------------- */

function SpiderCard({ event }: { event: Event }) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const xPct = (e.clientX - rect.left) / rect.width - 0.5;
        const yPct = (e.clientY - rect.top) / rect.height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            whileHover={{ scale: 1.02 }}
            className="relative h-[450px] w-full rounded-2xl bg-zinc-900 border border-white/10 group cursor-pointer"
        >
            {/* 1. BACKGROUND IMAGE CONTAINER */}
            <div className="absolute inset-2 overflow-hidden rounded-xl bg-black">
                <motion.img
                    src="/images/spider_man_bg.png"
                    style={{
                        x: useTransform(mouseXSpring, [-0.5, 0.5], [15, -15]),
                        y: useTransform(mouseYSpring, [-0.5, 0.5], [15, -15]),
                    }}
                    className="w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(220,38,38,0.2)_100%)] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* 2. SPIDER WEB OVERLAY */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-20 group-hover:opacity-80 transition-opacity pointer-events-none">
                <svg viewBox="0 0 100 100" className="w-full h-full text-red-600">
                    <path d="M100,0 Q80,10 70,30 M100,0 Q90,20 70,30 M100,0 L60,60" stroke="currentColor" fill="none" strokeWidth="0.5" />
                    <path d="M100,0 Q50,10 20,40" stroke="currentColor" fill="none" strokeWidth="0.2" />
                </svg>
            </div>

            {/* 3. CARD CONTENT */}
            <div
                style={{ transform: "translateZ(50px)" }}
                className="absolute inset-0 p-8 flex flex-col justify-end"
            >
                <div className="bg-black/60 backdrop-blur-md p-6 border-l-4 border-red-600 transform group-hover:translate-x-2 transition-transform">
                    <p className="text-red-500 font-mono text-[10px] tracking-widest mb-1 uppercase">
                        {event.eventType}
                    </p>
                    <h2 className="text-2xl font-black italic uppercase leading-none mb-3 group-hover:text-red-500 transition-colors">
                        {event.title}
                    </h2>

                    <p className="text-zinc-400 text-xs mb-4 line-clamp-2 font-medium">
                        {event.description}
                    </p>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-mono text-zinc-400 uppercase">
                                Active Registration
                            </span>
                        </div>
                        <motion.div whileHover={{ x: 5 }} className="text-white bg-red-600 p-2">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Tech Accents */}
            <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-zinc-700" />
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-zinc-700" />
        </motion.div>
    );
}

function LoadingCard() {
    return (
        <div className="h-[450px] bg-zinc-900/50 border border-zinc-800 rounded-2xl flex items-center justify-center animate-pulse">
            <p className="text-zinc-500 font-mono tracking-widest">LOADING_SYSTEM...</p>
        </div>
    );
}