import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/db";
import FinalParticipant from "@/models/finalParticipant.model";

export async function POST(req: Request) {
  try {
    await connect();

    // 1. Parse the incoming JSON
    const { email, teamId } = await req.json();

    // 2. Simple validation
    if (!email || !teamId) {
      return NextResponse.json(
        { message: "Email and Team ID are required" },
        { status: 400 },
      );
    }

    // 3. Find the participant
    // Using findOne to match both credentials
    const participant = await FinalParticipant.findOne({
      email: email.toLowerCase().trim(),
      teamId: teamId.trim(),
    });

    if (!participant) {
      return NextResponse.json(
        { message: "Invalid credentials. Please check your Email/Team ID." },
        { status: 401 },
      );
    }

    // 4. Success - Return participant data (excluding sensitive fields if any)
    return NextResponse.json(
      {
        message: "Login successful",
        success: true,
        user: {
          id: participant._id,
          name: participant.name,
          email: participant.email,
          teamId: participant.teamId,
          college: participant.college,
          department: participant.department,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 },
    );
  }
}
