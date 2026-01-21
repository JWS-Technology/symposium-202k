"use client";
import { motion } from "framer-motion";

export default function EventsPage() {
    return (
        <div className="min-h-screen pt-32 px-6 md:px-20 bg-black">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto"
            >
                <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic border-l-8 border-red-600 pl-6 mb-10">
                    On Stage <span className="text-red-600">Events</span>
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Example Event Cards would go here */}
                    <div className="h-64 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center">
                        <p className="text-zinc-500 font-mono tracking-widest">LOADING_DATA...</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}