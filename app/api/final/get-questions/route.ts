import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbconfig/db";
import FinalQuestion from "@/models/finalQuestions.model";

export async function GET(req: NextRequest) {
  try {
    // 1. Establish database connection
    await connect();

    // 2. Extract query parameters (e.g., eventId)
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");

    // 3. Build dynamic filter
    const filter: Record<string, any> = {};
    if (eventId) {
      filter.eventId = eventId;
    }

    // 4. Fetch questions with exclusion
    // We explicitly exclude 'correctIndex' and 'explanation' for security
    const questions = await FinalQuestion.find(filter)
      .select("-correctIndex -explanation")
      .sort({ createdAt: 1 });

    return NextResponse.json(
      {
        message: "Questions retrieved successfully",
        count: questions.length,
        data: questions,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("❌ Fetch Questions Error:", error);

    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Failed to fetch question protocol" },
      { status: 500 },
    );
  }
}
