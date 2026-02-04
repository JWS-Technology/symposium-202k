import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/db"; // Ensure you have a DB connection utility
import User from "@/models/User";

export async function GET() {
  try {
    await connect();

    // Fetch users, sorted by latest, excluding password
    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: users }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
