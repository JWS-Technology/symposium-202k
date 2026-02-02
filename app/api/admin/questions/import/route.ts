import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/db";
import Question from "@/models/Question";

// ⚠️ Replace this with your real admin auth middleware
function requireAdmin(req: Request) {
  return true;
}

export async function POST(req: Request) {
  try {
    if (!requireAdmin(req)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connect();

    const questions = await req.json();

    if (!Array.isArray(questions)) {
      return NextResponse.json(
        { message: "JSON must be an array of questions" },
        { status: 400 },
      );
    }

    const prepared: any[] = [];

    questions.forEach((q, index) => {
      if (!q.question || !Array.isArray(q.options)) {
        throw new Error(`Invalid question at index ${index}`);
      }

      if (q.options.length !== 4) {
        throw new Error(`Question ${index + 1}: Must have exactly 4 options`);
      }

      const correctIndexes = q.options
        .map((opt: string, i: number) => (opt.startsWith("*") ? i : -1))
        .filter((i: number) => i !== -1);

      if (correctIndexes.length !== 1) {
        throw new Error(
          `Question ${index + 1}: Exactly one option must start with *`,
        );
      }

      const correctIndex = correctIndexes[0];

      const cleanOptions = q.options.map((opt: string) =>
        opt.startsWith("*") ? opt.slice(1) : opt,
      );

      prepared.push({
        type: q.type || "mcq",
        question: q.question,
        code: q.type === "code" ? q.code : undefined,
        language: q.type === "code" ? q.language : undefined,
        options: cleanOptions,
        correctIndex,
        subject: q.subject,
        difficulty: q.difficulty,
        explanation: q.explanation,
      });
    });

    await Question.insertMany(prepared);

    return NextResponse.json({
      message: "Questions imported successfully",
      count: prepared.length,
    });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Import failed" },
      { status: 400 },
    );
  }
}
