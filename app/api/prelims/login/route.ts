import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/db";
import Participant from "@/models/Participants";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    await connect();

    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password required" },
        { status: 400 },
      );
    }

    // username = teamId
    // password = email
    const participant = await Participant.findOne({
      teamId: username,
      email: password,
    });

    if (!participant) {
      return NextResponse.json(
        { message: "Invalid Team ID or Email" },
        { status: 401 },
      );
    }

    const token = jwt.sign(
      {
        participantId: participant._id,
        teamId: participant.teamId,
        email: participant.email,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "2h" },
    );

    return NextResponse.json({
      message: "Login successful",
      token,
      participant: {
        teamId: participant.teamId,
        name: participant.name,
      },
    });
  } catch (err) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
