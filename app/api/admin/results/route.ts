import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/db";
import TestAttempt from "@/models/TestAttempt";

// TODO: replace with real admin auth
function requireAdmin() {
  return true;
}

export async function GET() {
  try {
    if (!requireAdmin()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connect();

    const results = await TestAttempt.aggregate([
      // only submitted attempts
      { $match: { submitted: true } },

      // join with users collection
      {
        $lookup: {
          from: "users", // MongoDB collection name
          localField: "teamId",
          foreignField: "teamId",
          as: "userInfo",
        },
      },

      // flatten userInfo
      { $unwind: "$userInfo" },

      // select fields
      {
        $project: {
          participantId: 1,
          teamId: 1,
          participantEmail: 1,
          score: 1,
          duration: 1,
          startedAt: 1,
          submittedAt: 1,
          college: "$userInfo.college",
          department: "$userInfo.department",
          name: "$userInfo.name",
        },
      },

      // leaderboard-style sort
      { $sort: { score: -1, submittedAt: 1 } },
    ]);

    return NextResponse.json({ results });
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to load results" },
      { status: 500 },
    );
  }
}
