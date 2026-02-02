"use client";

import { useEffect, useState } from "react";

type AdminResultRow = {
    participantId: string;
    teamId: string;
    name: string;
    participantEmail: string;
    college: string;
    department: string;
    score: number;
    submittedAt: string;
};

export default function AdminResultsPage() {
    const [data, setData] = useState<AdminResultRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("/api/admin/results")
            .then((res) => {
                if (!res.ok) throw new Error();
                return res.json();
            })
            .then((res) => {
                setData(res.results || []);
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to load admin results");
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-6">Loading results…</div>;
    if (error) return <div className="p-6 text-red-600">{error}</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">All Test Submissions</h1>

            {data.length === 0 ? (
                <p>No submissions yet</p>
            ) : (
                <table className="w-full border border-collapse text-sm">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">#</th>
                            <th className="border p-2">Team ID</th>
                            <th className="border p-2">Name</th>
                            <th className="border p-2">College</th>
                            <th className="border p-2">Department</th>
                            <th className="border p-2">Email</th>
                            <th className="border p-2">Score</th>
                            <th className="border p-2">Submitted At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, i) => (
                            <tr key={row.participantId}>
                                <td className="border p-2 text-center">{i + 1}</td>
                                <td className="border p-2">{row.teamId}</td>
                                <td className="border p-2">{row.name}</td>
                                <td className="border p-2">{row.college}</td>
                                <td className="border p-2">{row.department}</td>
                                <td className="border p-2">{row.participantEmail}</td>
                                <td className="border p-2 text-center font-semibold">
                                    {row.score}
                                </td>
                                <td className="border p-2 text-xs">
                                    {new Date(row.submittedAt).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
