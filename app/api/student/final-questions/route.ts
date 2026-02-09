import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbconfig/db";
import FinalQuestion from "@/models/finalQuestions.model";

export async function GET(req: NextRequest) {
  await connect();

  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("eventId");

  if (!eventId) {
    return NextResponse.json({ message: "Invalid eventId" }, { status: 400 });
  }

  const questions = await FinalQuestion.find({ eventId })
    .select("_id question options")
    .sort({ createdAt: 1 })
    .lean();

  return NextResponse.json({ questions });
}
