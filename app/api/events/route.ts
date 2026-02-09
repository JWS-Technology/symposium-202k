import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/db";
import Event from "@/models/event.model";

export async function GET() {
  await connect();

  const events = await Event.find({})
    .select("_id eventName eventType minPlayers maxPlayers")
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ events });
}
    