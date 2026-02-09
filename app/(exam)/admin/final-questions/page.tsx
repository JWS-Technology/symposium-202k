"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Event = {
    _id: string;
    eventName: string;
    eventType: string;
};

type EventStatus = Event & {
    hasFinalQuestions: boolean;
};

export default function FinalQuestionsHome() {
    const router = useRouter();
    const [events, setEvents] = useState<EventStatus[]>([]);

    useEffect(() => {
        fetch("/api/events")
            .then(res => res.json())
            .then(async data => {
                const enriched = await Promise.all(
                    data.events.map(async (ev: Event) => {
                        const res = await fetch(
                            `/api/final-questions?eventId=${ev._id}`
                        );
                        const q = await res.json();

                        return {
                            ...ev,
                            hasFinalQuestions: q.questions?.length > 0
                        };
                    })
                );
                setEvents(enriched);
            });
    }, []);

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Final Questions Admin</h1>

            <div className="space-y-4">
                {events.map(ev => (
                    <div
                        key={ev._id}
                        className="border rounded p-4 flex justify-between items-center"
                    >
                        <div>
                            <p className="font-semibold">{ev.eventName}</p>
                            <p className="text-sm text-gray-500">{ev.eventType}</p>
                        </div>

                        {ev.hasFinalQuestions ? (
                            <button
                                onClick={() =>
                                    router.push(`/admin/final-questions/view-question/${ev._id}`)
                                }
                                className="px-4 py-2 bg-blue-600 text-white rounded"
                            >
                                View Questions
                            </button>
                        ) : (
                            <button
                                onClick={() =>
                                    router.push(`/admin/final-questions/upload?eventId=${ev._id}`)
                                }
                                className="px-4 py-2 bg-black text-white rounded"
                            >
                                Upload Questions
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
