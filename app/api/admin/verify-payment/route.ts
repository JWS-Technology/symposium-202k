import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/db";
import Participant from "@/models/Participants";
import User from "@/models/User";
import { sendPaymentSuccessMailSES } from "@/lib/emailsend"; // Updated Import
import { verifyAdminToken } from "@/lib/adminAuth";

export async function POST(req: Request) {
  try {
    await connect();

    /* ---------- ADMIN AUTH ---------- */
    try {
      verifyAdminToken(req);
    } catch (err: any) {
      const status = err.message === "FORBIDDEN" ? 403 : 401;
      return NextResponse.json({ message: err.message }, { status });
    }

    /* ---------- BODY ---------- */
    const { participantId } = await req.json();
    if (!participantId) {
      return NextResponse.json(
        { message: "Participant ID required" },
        { status: 400 },
      );
    }

    /* ---------- FIND PARTICIPANT ---------- */
    const participant = await Participant.findById(participantId);
    if (!participant) {
      return NextResponse.json(
        { message: "Participant not found" },
        { status: 404 },
      );
    }

    // Optimization: Check if already paid
    if (participant.paymentStatus === "PAID") {
      return NextResponse.json(
        { message: "Already verified" },
        { status: 200 },
      );
    }

    /* ---------- UPDATE PAYMENT ---------- */
    participant.paymentStatus = "PAID";
    await participant.save();

    /* ---------- FIND TEAM LEADER ---------- */
    const teamLeader = await User.findOne({ teamId: participant.teamId });

    /* ---------- SEND EMAILS VIA SES ---------- */
    const emailPromises = [];

    // 1. To Participant
    emailPromises.push(
      sendPaymentSuccessMailSES({
        to: participant.email,
        name: participant.name,
        teamId: participant.teamId,
        amount: participant.paymentAmount,
      }),
    );

    // 2. To Team Leader (Optional)
    if (teamLeader?.email && teamLeader.email !== participant.email) {
      emailPromises.push(
        sendPaymentSuccessMailSES({
          to: teamLeader.email,
          name: teamLeader.name,
          teamId: participant.teamId,
          amount: participant.paymentAmount,
        }),
      );
    }

    // Wait for all emails to fire
    await Promise.allSettled(emailPromises);

    return NextResponse.json({
      message: "Payment verified & confirmation emails dispatched",
      participant,
    });
  } catch (error) {
    console.error("VERIFY PAYMENT ERROR:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
