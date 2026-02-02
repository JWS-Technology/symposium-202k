import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/db";
import TestAttempt from "@/models/TestAttempt";
import { getPrelimsUser } from "@/lib/prelimsAuth";

export async function POST(req: Request) {
  const user = getPrelimsUser(req as any);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { answers } = await req.json();
  await connect();

  const attempt = await TestAttempt.findOne({
    participantId: user.participantId,
  });

  if (!attempt || attempt.submitted) {
    return NextResponse.json({ message: "Invalid attempt" }, { status: 400 });
  }

  let score = 0;
  attempt.questions.forEach((q: any, i: number) => {
    if (answers[i] === q.correctIndex) score++;
  });

  attempt.answers = answers;
  attempt.score = score;
  attempt.submitted = true;
  attempt.submittedAt = new Date();

  await attempt.save();

  return NextResponse.json({ score });
}
