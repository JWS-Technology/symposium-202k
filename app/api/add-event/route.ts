import { NextRequest, NextResponse } from "next/server";
import Event from "@/models/event.model";
import { connect } from "@/dbconfig/db";

export async function POST(req: NextRequest) {
  try {
    await connect();

    const body = await req.json();
    console.log("✅ Received Data:", body);

    const { eventName, minPlayers, maxPlayers, eventType } = body;

    // Validation
    if (!eventName || !minPlayers || !maxPlayers || !eventType) {
      return NextResponse.json(
        { message: "Please fill all fields" },
        { status: 400 },
      );
    }

    const newEvent = new Event({
      eventName,
      minPlayers: Number(minPlayers),
      maxPlayers: Number(maxPlayers),
      eventType,
    });

    const savedEvent = await newEvent.save();
    console.log(savedEvent);

    return NextResponse.json(
      { message: "Event created successfully!", data: savedEvent },
      { status: 201 },
    );
  } catch (error: unknown) { // Use 'unknown' instead of 'any'
    console.error("❌ API Error:", error);

    // 1. Narrow down the type to access properties safely
    if (error instanceof Error) {
        // Mongoose duplicate key error often has a 'code' property, but it's not on the standard Error interface.
        // We can safely cast it for this specific check if needed, or check properties existence.
        const mongooseError = error as { code?: number; message: string };

        if (mongooseError.code === 11000) {
            return NextResponse.json(
                { message: "An event with this name already exists!" },
                { status: 409 },
            );
        }
        
        return NextResponse.json(
            { message: mongooseError.message },
            { status: 500 },
        );
    }

    // Fallback for non-Error objects
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}