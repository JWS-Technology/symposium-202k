import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/db";
import Question from "@/models/Question";
import TestAttempt from "@/models/TestAttempt";
import { getPrelimsUser } from "@/lib/prelimsAuth";

function shuffle(arr: any[]) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export async function POST(req: Request) {
  // 1️⃣ AUTH
  const user = getPrelimsUser(req as any);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connect();

  // 2️⃣ CHECK EXISTING ATTEMPT
  const existing = await TestAttempt.findOne({
    participantId: user.participantId,
  });

  if (existing && existing.submitted) {
    return NextResponse.json(
      { status: "SUBMITTED", message: "Test already submitted" },
      { status: 200 },
    );
  }

  // 🟡 CASE B: Attempt exists & NOT submitted → RESUME
  if (existing && !existing.submitted) {
    return NextResponse.json({
      attemptId: existing._id,
      duration: existing.duration,
      startedAt: existing.startedAt,
      questions: existing.questions.map((q: any) => ({
        questionId: q.questionId,
        question: q.question,
        code: q.code,
        options: q.options,
      })),
    });
  }

  // 🟢 CASE C: No attempt exists → CREATE NEW
  const raw = await Question.aggregate([{ $sample: { size: 10 } }]);

  const questions = raw.map((q: any) => {
    const opts = shuffle(q.options);
    return {
      questionId: q._id,
      question: q.question,
      code: q.code,
      options: opts,
      correctIndex: opts.indexOf(q.options[q.correctIndex]),
    };
  });

  const TEST_DURATION = 5 * 60; // 10 minutes

  const attempt = await TestAttempt.create({
    participantId: user.participantId,
    teamId: user.teamId,
    participantEmail: user.email,
    questions,
    duration: TEST_DURATION,
    submitted: false,
  });

  return NextResponse.json({
    attemptId: attempt._id,
    duration: TEST_DURATION,
    startedAt: attempt.startedAt,
    questions: questions.map((q) => ({
      questionId: q.questionId,
      question: q.question,
      code: q.code,
      options: q.options,
    })),
  });
}
