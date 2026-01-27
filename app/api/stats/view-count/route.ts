import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/db";
import Stats from "@/models/Stats";

export async function POST(req: Request) {
  try {
    await connect();
    const { increment } = await req.json();

    let stats;
    if (increment) {
      // Actually add +1 to the database
      stats = await Stats.findOneAndUpdate(
        { key: "visitor_count" },
        { $inc: { count: 1 } },
        { upsert: true, new: true },
      );
    } else {
      // Just fetch the current number without increasing it
      stats = await Stats.findOne({ key: "visitor_count" });
    }

    return NextResponse.json({ count: stats?.count || 0 });
  } catch (err) {
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}
