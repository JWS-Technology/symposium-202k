"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Event = {
    _id: string;
    eventName: string;
    eventType: string;
};

export default function UploadFinalQuestions() {
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
                setEvents(data.events);
                if (eventIdFromQuery) {
                    const found = data.events.find(
                        (e: Event) => e._id === eventIdFromQuery
                    );
                    setEvent(found || null);
                }
            });
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

            const payload = parsed.map(q => ({
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

            <select
                className="border p-2 w-full"
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

            <textarea
                className="w-full h-96 border p-3 font-mono text-sm"
                value={raw}
                onChange={e => setRaw(e.target.value)}
                placeholder="Paste questions JSON (no event fields)"
            />

            {error && <p className="text-red-600">{error}</p>}

            <button
                onClick={upload}
                disabled={loading}
                className="bg-black text-white px-6 py-2 rounded disabled:opacity-50"
            >
                {loading ? "Uploading..." : "Upload"}
            </button>
        </div>
    );
}
