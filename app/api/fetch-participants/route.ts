import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connect } from "@/dbconfig/db";
import User from "@/models/User";
import Participant from "@/models/Participants";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: Request) {
  try {
    await connect();

    const auth = req.headers.get("authorization");
    if (!auth || !auth.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const participants = await Participant.find({
      teamId: user.teamId,
    }).sort({ createdAt: -1 });

    return NextResponse.json({ participants });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
