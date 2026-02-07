import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/db";
import TestAttempt from "@/models/TestAttempt";

// TODO: replace with real admin auth
function requireAdmin() {
  return true;
}

export async function GET() {
  try {
    if (!requireAdmin()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    await connect();

    // Fetch only submitted tests, sorted by latest
    const results = await TestAttempt.find({ submitted: true })
      .select(
        "participantName teamId eventName college department score participantEmail submittedAt",
      )
      .sort({ submittedAt: -1 });

    return NextResponse.json({ success: true, data: results });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
