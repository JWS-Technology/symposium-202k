"use client";

import { useEffect, useState } from "react";

type LeaderboardRow = {
    rank: number;
    teamId: string;
    email: string;
    college: string;
    department: string;
    score: number;
    submittedAt: string;
};

export default function LeaderboardPage() {
    const [data, setData] = useState<LeaderboardRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("/api/tests/leaderboard")
            .then((res) => {
                if (!res.ok) throw new Error();
                return res.json();
            })
            .then((res) => {
                setData(res.leaderboard || []);
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to load leaderboard");
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="p-6">Loading leaderboard…</div>;
    }

    if (error) {
        return <div className="p-6 text-red-600">{error}</div>;
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Prelims Leaderboard</h1>

            {data.length === 0 ? (
                <p>No results yet</p>
            ) : (
                <table className="w-full border border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">Rank</th>
                            <th className="border p-2">Team ID</th>
                            <th className="border p-2">College</th>
                            <th className="border p-2">Department</th>
                            <th className="border p-2">Score</th>
                            <th className="border p-2">Submitted At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row) => (
                            <tr key={row.rank}>
                                <td className="border p-2 text-center font-semibold">
                                    {row.rank}
                                </td>
                                <td className="border p-2">{row.teamId}</td>
                                <td className="border p-2">{row.college}</td>
                                <td className="border p-2">{row.department}</td>
                                <td className="border p-2 text-center font-bold">
                                    {row.score}
                                </td>
                                <td className="border p-2 text-sm">
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
