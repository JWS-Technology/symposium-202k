import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/db";
import TestAttempt from "@/models/TestAttempt";

export async function GET() {
  try {
    await connect();

    const results = await TestAttempt.aggregate([
      { $match: { submitted: true } },

      // 🔗 Join with users collection
      {
        $lookup: {
          from: "users", // MongoDB collection name
          localField: "teamId",
          foreignField: "teamId",
          as: "userInfo",
        },
      },
      { $unwind: "$userInfo" },

      // 🎯 Select required fields
      {
        $project: {
          teamId: 1,
          participantEmail: 1,
          score: 1,
          submittedAt: 1,
          college: "$userInfo.college",
          department: "$userInfo.department",
        },
      },

      // 🏆 Sort by score desc, time asc
      { $sort: { score: -1, submittedAt: 1 } },
    ]);

    // add rank
    const leaderboard = results.map((r, i) => ({
      rank: i + 1,
      teamId: r.teamId,
      email: r.participantEmail,
      college: r.college,
      department: r.department,
      score: r.score,
      submittedAt: r.submittedAt,
    }));

    return NextResponse.json({ leaderboard });
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to load leaderboard" },
      { status: 500 },
    );
  }
}
