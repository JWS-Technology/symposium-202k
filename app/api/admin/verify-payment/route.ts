import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/db";
import Participant from "@/models/Participants";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  try {
    await connect();

    /* ---------- ADMIN AUTH ---------- */
    const auth = req.headers.get("authorization");
    if (!auth || !auth.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { role?: string };

    if (decoded.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    /* ---------- BODY ---------- */
    const { participantId } = await req.json();
    if (!participantId) {
      return NextResponse.json(
        { message: "Participant ID required" },
        { status: 400 },
      );
    }

    /* ---------- UPDATE ---------- */
    const participant = await Participant.findByIdAndUpdate(
      participantId,
      { paymentStatus: "PAID" },
      { new: true },
    );

    if (!participant) {
      return NextResponse.json(
        { message: "Participant not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Payment verified successfully",
      participant,
    });
  } catch (error: any) {
    console.error("VERIFY PAYMENT ERROR:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
