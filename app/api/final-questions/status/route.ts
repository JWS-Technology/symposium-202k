// app/api/final-questions/status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbconfig/db";
import FinalQuestion from "@/models/finalQuestions.model";

export async function GET(req: NextRequest) {
  await connect();

  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("eventId");

  if (!eventId) {
    return NextResponse.json({ message: "eventId required" }, { status: 400 });
  }

  const count = await FinalQuestion.countDocuments({ eventId });

  return NextResponse.json({
    exists: count > 0,
    count,
  });
}
