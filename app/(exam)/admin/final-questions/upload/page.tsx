"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Event = {
    _id: string;
    eventName: string;
    eventType: string;
};

// 1. Move all logic into this new inner component
function UploadContent() {
    const router = useRouter();
    const params = useSearchParams();
    const eventIdFromQuery = params.get("eventId");

    const [events, setEvents] = useState<Event[]>([]);
    const [event, setEvent] = useState<Event | null>(null);
    const [raw, setRaw] = useState("[]");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch("/api/events")
            .then(res => res.json())
            .then(data => {
                // Ensure we have an array to prevent crashes
                const eventList = data.events || [];
                setEvents(eventList);
                
                if (eventIdFromQuery) {
                    const found = eventList.find(
                        (e: Event) => e._id === eventIdFromQuery
                    );
                    setEvent(found || null);
                }
            })
            .catch(err => setError("Failed to load events list"));
    }, [eventIdFromQuery]);

    const upload = async () => {
        if (!event) {
            setError("Select an event");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) {
                throw new Error("Payload must be an array");
            }

            // Map the parsed JSON to your schema structure
            const payload = parsed.map((q: any) => ({
                ...q,
                eventId: event._id,
                eventName: event.eventName,
                eventType: event.eventType,
                type: "mcq",
                marks: q.marks ?? 1
            }));

            const res = await fetch("/api/final-questions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            // Redirect to view page on success
            // Note: Ensure this route exists in your app
            router.push(`/admin/final-questions/view/${event._id}`);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-4">
            <h1 className="text-2xl font-bold">Upload Final Questions</h1>

            {/* Event Selector */}
            <select
                className="border p-2 w-full bg-black text-white rounded"
                value={event?._id || ""}
                onChange={e =>
                    setEvent(events.find(ev => ev._id === e.target.value) || null)
                }
            >
                <option value="">Select Event</option>
                {events.map(ev => (
                    <option key={ev._id} value={ev._id}>
                        {ev.eventName}
                    </option>
                ))}
            </select>

            {/* JSON Input Area */}
            <textarea
                className="w-full h-96 border p-3 font-mono text-sm bg-gray-900 text-green-400 rounded"
                value={raw}
                onChange={e => setRaw(e.target.value)}
                placeholder='[ { "question": "...", "options": ["A", "B"], "correctIndex": 0, "marks": 2 } ]'
            />

            {error && <p className="text-red-500 font-bold border border-red-500 p-2 rounded">{error}</p>}

            <button
                onClick={upload}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded disabled:opacity-50 font-bold uppercase tracking-widest transition-all"
            >
                {loading ? "Uploading..." : "Upload Protocol"}
            </button>
        </div>
    );
}

// 2. Export the component wrapped in Suspense
export default function UploadFinalQuestions() {
    return (
        <Suspense fallback={<div className="p-10 text-center text-white">Loading Terminal...</div>}>
            <UploadContent />
        </Suspense>
    );
}