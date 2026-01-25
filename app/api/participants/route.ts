import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connect } from "@/dbconfig/db";
import User from "@/models/User";
import Participant from "@/models/Participants";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  try {
    await connect();

    const auth = req.headers.get("authorization");
    if (!auth || !auth.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Unauthorized - token missing" },
        { status: 401 },
      );
    }

    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json(
        { message: "User not found for token" },
        { status: 404 },
      );
    }

    const body = await req.json();
    const { name, dno, email, event, eventType } = body;

    if (!name || !dno || !email || !event || !eventType) {
      return NextResponse.json(
        {
          message: "All fields are required",
          received: body,
        },
        { status: 400 },
      );
    }

    const participant = await Participant.create({
      teamId: user.teamId,
      name,
      dno,
      email,
      eventType,
      event,
    });

    return NextResponse.json(
      {
        message: "Participant added successfully",
        participant,
      },
      { status: 201 },
    );
  } catch (err: any) {
    console.error("ADD PARTICIPANT ERROR:", err);
    return NextResponse.json(
      { message: err.message || "Server error" },
      { status: 500 },
    );
  }
}
