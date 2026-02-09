import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbconfig/db";
import FinalAnswer from "@/models/finalAnswer.model";

export async function GET(req: NextRequest) {
  try {
    await connect();

    // Fetch ALL results, sorted by highest score first
    const results = await FinalAnswer.find({})
      .sort({ totalScore: -1, createdAt: 1 });

    return NextResponse.json({ results }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: "Error fetching results: " + error.message }, { status: 500 });
  }
}