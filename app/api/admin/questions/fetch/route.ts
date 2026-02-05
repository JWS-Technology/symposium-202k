// app/api/questions/fetch/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbconfig/db";
import Question from "@/models/Question";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");

    // Initialize an empty filter
    const filter: any = {};

    // 🛡️ CHECK: Only apply filter if eventId is a valid non-empty string
    if (eventId && eventId.trim() !== "" && eventId !== "null") {
      if (!mongoose.Types.ObjectId.isValid(eventId)) {
        return NextResponse.json(
          { message: "Invalid ObjectId format" },
          { status: 400 },
        );
      }
      // Convert String to ObjectId for the query
      filter.eventId = new mongoose.Types.ObjectId(eventId);
    }

    console.log("🔍 QUERY_FILTER_APPLIED:", filter);

    const questions = await Question.find(filter).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: questions.length,
      data: questions,
    });
  } catch (error: any) {
    console.error("❌ API_FETCH_ERROR:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
