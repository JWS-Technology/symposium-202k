import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/db";
import Question from "@/models/Question";
import TestAttempt from "@/models/TestAttempt";
import User from "@/models/User";
import { getPrelimsUser } from "@/lib/prelimsAuth";

export async function POST(req: Request) {
  try {
    const user = getPrelimsUser(req as any);
    if (!user || !user.participantId)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { eventName } = await req.json();
    if (!eventName)
      return NextResponse.json(
        { message: "Missing event context" },
        { status: 400 },
      );

    await connect();

    const existing = await TestAttempt.findOne({
      participantId: user.participantId,
      eventName,
    });

    if (existing) {
      if (existing.submitted)
        return NextResponse.json({ status: "SUBMITTED" }, { status: 200 });
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

    const userProfile = await User.findOne({ teamId: user.teamId });
    if (!userProfile)
      return NextResponse.json(
        { message: "User profile not found" },
        { status: 404 },
      );

    const rawQuestions = await Question.find({ eventName });
    if (!rawQuestions || rawQuestions.length === 0)
      return NextResponse.json(
        { message: "No questions found" },
        { status: 404 },
      );

    const shuffleArray = (array: any[]) =>
      array.sort(() => Math.random() - 0.5);
    const shuffledQuestionPool = shuffleArray([...rawQuestions]);

    const questions = shuffledQuestionPool.map((q: any) => {
      const originalOptions = [...q.options];
      const correctValue = originalOptions[q.correctIndex];
      const shuffledOptions = shuffleArray([...originalOptions]);

      return {
        questionId: q._id,
        question: q.question,
        code: q.code, // This is a backup in case the DB has a separate code field
        options: shuffledOptions,
        correctIndex: shuffledOptions.indexOf(correctValue),
      };
    });

    // 🟢 DYNAMIC TIME: 60 seconds per question
    const dynamicDuration = questions.length * 60;

    const attempt = await TestAttempt.create({
      participantId: user.participantId,
      teamId: user.teamId,
      participantEmail: userProfile.email,
      participantName: userProfile.name,
      college: userProfile.college,
      department: userProfile.department,
      eventName,
      questions,
      duration: dynamicDuration,
      submitted: false,
    });

    return NextResponse.json({
      attemptId: attempt._id,
      duration: attempt.duration,
      startedAt: attempt.startedAt,
      questions: questions.map((q) => ({
        questionId: q.questionId,
        question: q.question,
        code: q.code,
        options: q.options,
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
