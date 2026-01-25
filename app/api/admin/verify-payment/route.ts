import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/db";
import Participant from "@/models/Participants";
import User from "@/models/User";
import { sendPaymentSuccessMail } from "@/lib/mailer";
import { verifyAdminToken } from "@/lib/adminAuth";

export async function POST(req: Request) {
  try {
    await connect();

    /* ---------- ADMIN AUTH (UPDATED) ---------- */
    try {
      verifyAdminToken(req);
    } catch (err: any) {
      if (err.message === "UNAUTHORIZED") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
      if (err.message === "FORBIDDEN") {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
      throw err;
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

    /* ---------- UPDATE PAYMENT ---------- */
    participant.paymentStatus = "PAID";
    await participant.save();

    /* ---------- FIND TEAM LEADER ---------- */
    const teamLeader = await User.findOne({
      teamId: participant.teamId,
    });

    /* ---------- SEND EMAILS (OPTION B – UNCHANGED) ---------- */

    // Participant email
    await sendPaymentSuccessMail({
      to: participant.email,
      name: participant.name,
      teamId: participant.teamId,
      amount: participant.paymentAmount,
      role: "PARTICIPANT",
    });

    // Team leader email
    if (teamLeader?.email) {
      await sendPaymentSuccessMail({
        to: teamLeader.email,
        name: teamLeader.name,
        teamId: participant.teamId,
        amount: participant.paymentAmount,
        role: "TEAM",
      });
    }

    return NextResponse.json({
      message: "Payment verified & emails sent",
      participant,
    });
  } catch (error) {
    console.error("VERIFY PAYMENT ERROR:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
