import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbconfig/db";
import { verifyAdmin } from "@/lib/adminAuth";
import Participant from "@/models/Participants";

export async function GET(req: NextRequest) {
  await connect();

  const token = req.headers.get("authorization")?.split(" ")[1];
  verifyAdmin(token);

  const participants = await Participant.find().sort({ createdAt: -1 });

  return NextResponse.json({ participants });
}
