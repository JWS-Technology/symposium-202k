import { NextRequest, NextResponse } from "next/server";
import Event from "@/models/event.model";
import { connect } from "@/dbconfig/db";

export async function GET(req: NextRequest) {
  try {
    await connect();

    // Get query params
    const { searchParams } = new URL(req.url);
    const eventType = searchParams.get("eventType");

    // Build filter condition dynamically
    const filter: Record<string, any> = {};

    if (eventType) {
      if (!["TECHNICAL", "NON-TECHNICAL", "CULTURALS"].includes(eventType)) {
        return NextResponse.json(
          { message: "Invalid event type" },
          { status: 400 },
        );
      }

      filter.eventType = eventType;
    }

    // Fetch events
    const events = await Event.find(filter).sort({ createdAt: -1 });

    return NextResponse.json(
      {
        message: "Events fetched successfully",
        count: events.length,
        data: events,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("❌ Fetch Events Error:", error);

    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
