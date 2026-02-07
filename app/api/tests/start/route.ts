import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/db";
import Question from "@/models/Question";
import TestAttempt from "@/models/TestAttempt";
import User from "@/models/User"; // 🟢 Import the User model
import { getPrelimsUser } from "@/lib/prelimsAuth";

export async function POST(req: Request) {
  // console.log("--- START API INITIATED ---");

  try {
    // 1. Auth & User Extraction
    const user = getPrelimsUser(req as any);
    if (!user || !user.participantId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse Request Body
    const { eventName } = await req.json();
    if (!eventName) {
      return NextResponse.json(
        { message: "Missing event context" },
        { status: 400 },
      );
    }

    // 3. Database Connection
    await connect();

    // 4. Check for Existing Attempt (Resume Logic)
    const existing = await TestAttempt.findOne({
      participantId: user.participantId,
      eventName: eventName,
    });

    if (existing) {
      if (existing.submitted) {
        return NextResponse.json({ status: "SUBMITTED" }, { status: 200 });
      }
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

    // 5. 🟢 Fetch Full User Profile using teamId
    // This allows us to get the college, dept, and name
    const userProfile = await User.findOne({ teamId: user.teamId });
    if (!userProfile) {
      return NextResponse.json(
        { message: "User profile not found" },
        { status: 404 },
      );
    }

    // 6. Fetch all questions for the event
    const rawQuestions = await Question.find({ eventName: eventName });
    if (!rawQuestions || rawQuestions.length === 0) {
      return NextResponse.json(
        { message: "No questions found" },
        { status: 404 },
      );
    }

    // 7. Dynamic Logic: Shuffle Questions AND Options
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
        code: q.code,
        options: shuffledOptions,
        correctIndex: shuffledOptions.indexOf(correctValue),
      };
    });

    // 8. 🟢 Create New Attempt with Profile Details
    const attempt = await TestAttempt.create({
      participantId: user.participantId,
      teamId: user.teamId,
      participantEmail: userProfile.email,

      // NEW: Storing profile data into the attempt
      participantName: userProfile.name,
      college: userProfile.college,
      department: userProfile.department,

      eventName: eventName,
      questions,
      duration: 5 * 60, // 15 Minutes
      submitted: false,
    });

    console.log(
      `SUCCESS: Created attempt for ${userProfile.name} (${userProfile.college})`,
    );

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
    console.error("CRITICAL API FAILURE:", error.stack);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
