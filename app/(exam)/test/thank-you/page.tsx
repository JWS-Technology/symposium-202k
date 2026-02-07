"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

function ThankYouContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const name = searchParams.get("name");
    const event = searchParams.get("event");

    return (
        <div className="min-h-screen bg-black text-green-500 font-mono flex items-center justify-center p-4">
            <div className="max-w-md w-full border border-green-900 bg-zinc-950 p-8 text-center shadow-[0_0_30px_rgba(0,255,0,0.1)]">
                <div className="mb-6 flex justify-center">
                    <div className="h-20 w-20 rounded-full border-2 border-green-500 flex items-center justify-center animate-pulse">
                        <svg className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-white mb-2 tracking-tighter uppercase">
                    Test Completed
                </h1>
                <p className="text-zinc-500 text-xs mb-8 uppercase tracking-widest">
                    Thank you for {name || "N/A"} Team
                </p>

                <div className="space-y-4 mb-8 text-left bg-black border border-zinc-800 p-4 rounded">
                    <div className="flex justify-between">
                        <span className="text-zinc-600">Team Name:</span>
                        <span className="text-white uppercase">{name || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-zinc-600">Event:</span>
                        <span className="text-white">{event || "General"}</span>
                    </div>

                </div>

                <div className="text-xs text-zinc-600 mb-8 italic">
                    "The efficiency of your logic has been logged for final evaluation."
                </div>

                <button
                    onClick={() => router.push("/")}
                    className="w-full bg-green-600 text-black font-bold py-3 hover:bg-green-400 transition-colors uppercase tracking-widest"
                >
                    Return to Home
                </button>
            </div>
        </div>
    );
}

export default function ThankYouPage() {
    return (
        <Suspense fallback={<div className="bg-black min-h-screen" />}>
            <ThankYouContent />
        </Suspense>
    );
}