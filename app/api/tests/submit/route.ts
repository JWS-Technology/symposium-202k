import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/db";
import TestAttempt from "@/models/TestAttempt";
import User from "@/models/User"; // Import your User model
import { getPrelimsUser } from "@/lib/prelimsAuth";

export async function POST(req: Request) {
  try {
    const sessionUser = getPrelimsUser(req as any);
    if (!sessionUser)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { answers, eventName } = await req.json();
    await connect();

    // 1. Find the active attempt
    const attempt = await TestAttempt.findOne({
      participantId: sessionUser.participantId,
      eventName,
      submitted: false,
    });

    if (!attempt)
      return NextResponse.json(
        { message: "Attempt not found" },
        { status: 404 },
      );

    // 2. Fetch full User details using teamId
    const userProfile = await User.findOne({ teamId: attempt.teamId });

    if (!userProfile) {
      console.warn(`User profile not found for teamId: ${attempt.teamId}`);
    }

    // 3. Calculate Score
    let score = 0;
    attempt.questions.forEach((q: any, idx: number) => {
      if (answers[idx] === q.correctIndex) {
        score += 1;
      }
    });

    // 4. Update Attempt with Results and User Meta (Optional)
    attempt.answers = answers;
    attempt.score = score;
    attempt.submitted = true;
    attempt.submittedAt = new Date();

    // You could also store a 'metadata' field if you want to keep college info in the attempt
    // attempt.metadata = { college: userProfile?.college, dept: userProfile?.department };

    await attempt.save();

    console.log(
      `SUCCESS: ${userProfile?.name} from ${userProfile?.college} scored ${score}`,
    );

    return NextResponse.json({
      success: true,
      score,
      participantName: userProfile?.name,
      college: userProfile?.college,
    });
  } catch (error: any) {
    console.error("SUBMISSION_ERROR:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
