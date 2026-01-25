import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connect } from "@/dbconfig/db";
import User from "@/models/User";
import Participant from "@/models/Participants";
import PaymentQR from "@/components/PaymentQR";
import PaymentConfig from "@/models/PaymentConfig";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  try {
    await connect();

    /* ---------- AUTH ---------- */
    const auth = req.headers.get("authorization");
    if (!auth || !auth.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Unauthorized - token missing" },
        { status: 401 },
      );
    }

    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json(
        { message: "User not found for token" },
        { status: 404 },
      );
    }

    /* ---------- BODY ---------- */
    const body = await req.json();
    const { name, dno, email, event, eventType } = body;

    if (!name || !dno || !email || !event || !eventType) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 },
      );
    }

    /* ---------- FIND PARTICIPANT ---------- */
    let participant = await Participant.findOne({
      teamId: user.teamId,
      email,
    });

    /* ---------- IF PARTICIPANT EXISTS ---------- */
    if (participant) {
      // ❌ already selected this event
      const alreadyJoined = participant.events.some(
        (e: any) => e.eventName === event,
      );

      if (alreadyJoined) {
        return NextResponse.json(
          { message: "Participant already registered for this event" },
          { status: 400 },
        );
      }

      // ❌ max 2 events rule
      if (participant.events.length >= 2) {
        return NextResponse.json(
          { message: "Participant can join maximum 2 events" },
          { status: 400 },
        );
      }

      // ✅ add new event
      participant.events.push({
        eventName: event,
        eventType,
      });

      await participant.save();

      return NextResponse.json(
        {
          message: "Event added to existing participant",
          participant,
        },
        { status: 200 },
      );
    }

    /* ---------- PAYMENT CONFIG ---------- */
    const PAYMENT_AMOUNT = Number(
      process.env.NEXT_PUBLIC_DEFAULT_AMOUNT || 500,
    );

    /* ---------- CREATE NEW PARTICIPANT ---------- */
    participant = await Participant.create({
      teamId: user.teamId,
      name,
      dno,
      email,
      events: [
        {
          eventName: event,
          eventType,
        },
      ],
      paymentAmount: PAYMENT_AMOUNT, // ✅ REQUIRED FIELD
      paymentStatus: "PENDING",
    });

    return NextResponse.json(
      {
        message: "Participant created successfully",
        participant,
      },
      { status: 201 },
    );
  } catch (err: any) {
    console.error("ADD PARTICIPANT ERROR:", err);
    return NextResponse.json(
      { message: err.message || "Server error" },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  try {
    await connect();

    /* ---------- ADMIN AUTH ---------- */
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { role?: string };

    if (decoded.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    /* ---------- FETCH ALL PARTICIPANTS ---------- */
    const participants = await Participant.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      count: participants.length,
      participants,
    });
  } catch (error) {
    console.error("ADMIN FETCH PARTICIPANTS ERROR:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
