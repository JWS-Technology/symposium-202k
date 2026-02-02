"use client";

import { useState } from "react";

type Question = {
    type?: "mcq" | "code";
    question: string;
    code?: string;
    language?: string;
    options: string[];
    subject?: string;
    difficulty?: string;
};

export default function ImportQuestionsPage() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError("");
        setSuccess("");

        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            try {
                const parsed = JSON.parse(reader.result as string);
                if (!Array.isArray(parsed)) {
                    throw new Error("JSON must be an array");
                }
                setQuestions(parsed);
            } catch (err: any) {
                setError(err.message);
            }
        };
        reader.readAsText(file);
    };

    const handleImport = async () => {
        setLoading(true);
        setError("");
        setSuccess("");

        const res = await fetch("/api/admin/questions/import", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(questions),
        });

        const data = await res.json();
        setLoading(false);

        if (!res.ok) {
            setError(data.message);
            return;
        }

        setSuccess(`Imported ${data.count} questions successfully`);
        setQuestions([]);
    };

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <h1 className="text-2xl font-semibold">Import Prelims Questions</h1>

            <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="border p-2"
            />

            {error && <p className="text-red-600">{error}</p>}
            {success && <p className="text-green-600">{success}</p>}

            {questions.length > 0 && (
                <>
                    <h2 className="text-lg font-medium">
                        Preview ({questions.length} questions)
                    </h2>

                    <div className="space-y-4 max-h-[400px] overflow-y-auto border p-4">
                        {questions.map((q, i) => (
                            <div key={i} className="border-b pb-3">
                                <p className="font-medium">
                                    {i + 1}. {q.question}
                                </p>

                                {q.type === "code" && q.code && (
                                    <pre className="bg-gray-100 p-2 text-sm overflow-x-auto">
                                        {q.code}
                                    </pre>
                                )}

                                <ul className="ml-4 list-disc">
                                    {q.options.map((opt, idx) => (
                                        <li key={idx}>
                                            {opt.startsWith("*") ? (
                                                <strong className="text-green-600">{opt}</strong>
                                            ) : (
                                                opt
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handleImport}
                        disabled={loading}
                        className="bg-black text-white px-6 py-2 rounded"
                    >
                        {loading ? "Importing..." : "Import Questions"}
                    </button>
                </>
            )}
        </div>
    );
}
