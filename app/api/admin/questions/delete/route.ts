// app/api/questions/delete/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbconfig/db";
import Question from "@/models/Question";
import mongoose from "mongoose";

export async function DELETE(req: NextRequest) {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const questionId = searchParams.get("questionId");
    const eventId = searchParams.get("eventId");

    // Scenario A: Delete single question
    if (questionId) {
      if (!mongoose.Types.ObjectId.isValid(questionId)) {
        return NextResponse.json(
          { message: "Invalid Question ID" },
          { status: 400 },
        );
      }
      await Question.findByIdAndDelete(questionId);
      return NextResponse.json({ message: "UNIT_DELETED_SUCCESSFULLY" });
    }

    // Scenario B: Delete all questions for a specific event
    if (eventId) {
      if (!mongoose.Types.ObjectId.isValid(eventId)) {
        return NextResponse.json(
          { message: "Invalid Event ID" },
          { status: 400 },
        );
      }
      const result = await Question.deleteMany({
        eventId: new mongoose.Types.ObjectId(eventId),
      });
      return NextResponse.json({
        message: `WIPE_COMPLETE: ${result.deletedCount} units removed.`,
        count: result.deletedCount,
      });
    }

    return NextResponse.json(
      { message: "NO_TARGET_SPECIFIED" },
      { status: 400 },
    );
  } catch (error: any) {
    console.error("DELETE_ERROR:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
