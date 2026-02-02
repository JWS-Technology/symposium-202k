import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/db";
import User from "@/models/User";
import { getPrelimsUser } from "@/lib/prelimsAuth";

// ✅ ADD THIS TYPE
type ParticipantProfile = {
  teamId: string;
  name: string;
  college: string;
  department: string;
};

export async function GET(req: Request) {
  try {
    const user = getPrelimsUser(req as any);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connect();

    const profile = await User.findOne(
      { teamId: user.teamId },
      { college: 1, department: 1, name: 1, teamId: 1 },
    ).lean<ParticipantProfile>();

    if (!profile) {
      return NextResponse.json(
        { message: "Participant profile not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      teamId: profile.teamId,
      name: profile.name,
      college: profile.college,
      department: profile.department,
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to fetch participant info" },
      { status: 500 },
    );
  }
}
