import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbconfig/db";
import { verifyAdmin } from "@/lib/adminAuth";
import Event from "@/models/event.model";

export async function GET(req: NextRequest) {
  await connect();

  const token = req.headers.get("authorization")?.split(" ")[1];
  verifyAdmin(token);

  const events = await Event.find().sort({ createdAt: -1 });

  return NextResponse.json({ events });
}
