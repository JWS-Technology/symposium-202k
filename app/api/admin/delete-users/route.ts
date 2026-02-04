import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/db"; // Adjust based on your DB helper
import User from "@/models/User"; // Adjust based on your User model

export async function DELETE(req: Request) {
  try {
    await connect();
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "ENTITY_ID_REQUIRED" },
        { status: 400 },
      );
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return NextResponse.json(
        { success: false, message: "ENTITY_NOT_FOUND" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: `ENTITY_${deletedUser.teamId}_TERMINATED`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "INTERNAL_SYSTEM_CRASH" },
      { status: 500 },
    );
  }
}
