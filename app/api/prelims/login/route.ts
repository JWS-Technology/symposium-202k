// app/api/participant/login/route.ts
import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/db";
import Participant from "@/models/Participants";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    await connect();

    const { name, email, password } = await req.json();

    // 1. Basic Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, Email, and Team ID (Password) are required" },
        { status: 400 },
      );
    }

    // 2. Find Participant by Name and Email
    // We check name and email first to identify the user
    const participant = await Participant.findOne({
      name: name.trim(),
      email: email.trim().toLowerCase(),
    });

    if (!participant) {
      return NextResponse.json(
        { message: "Participant record not found" },
        { status: 404 },
      );
    }

    // 3. Verify "Password" (Team ID)
    // Here we check if the password provided matches the teamId in DB
    if (participant.teamId !== password) {
      return NextResponse.json(
        { message: "Invalid Team ID credentials" },
        { status: 401 },
      );
    }

    // 4. Generate Token
    const token = jwt.sign(
      {
        participantId: participant._id,
        teamId: participant.teamId,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "3h" }, // Extended to 3h for test duration
    );

    // 5. Response with filtering logic
    return NextResponse.json({
      message: "Access Granted",
      token,
      participant: {
        name: participant.name,
        teamId: participant.teamId,
        // 🔹 Returning only the events this participant is registered for
        registeredEvents: participant.events,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { message: "System Error: " + err.message },
      { status: 500 },
    );
  }
}
