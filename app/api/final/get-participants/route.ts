import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbconfig/db";
import FinalParticipant from "@/models/finalParticipant.model";

export async function GET(req: NextRequest) {
  try {
    // 1. Establish connection to the multiverse database
    await connect();

    // 2. Fetch all participants
    // We use .populate("eventId") to get the full Event details (like eventName)
    // We sort by 'createdAt' descending so the newest entries appear first
    const participants = await FinalParticipant.find({})
      .populate("eventId") 
      .sort({ createdAt: -1 });

    // 3. Return the success response
    return NextResponse.json(
      {
        message: "Operative manifest retrieved successfully",
        count: participants.length,
        data: participants,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("❌ Fetch Participants Error:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message }, 
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Internal Server Anomaly" },
      { status: 500 }
    );
  }
}