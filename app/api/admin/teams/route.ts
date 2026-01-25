import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbconfig/db";
import { verifyAdmin } from "@/lib/adminAuth";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  await connect();

  const token = req.headers.get("authorization")?.split(" ")[1];
  verifyAdmin(token);

  const teams = await User.find().sort({ createdAt: -1 });

  return NextResponse.json({ teams });
}
