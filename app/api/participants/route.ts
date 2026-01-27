import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connect } from "@/dbconfig/db";
import User from "@/models/User";
import Participant from "@/models/Participants";
import Event from "@/models/event.model"; // ✅ FIX 1: import Event model

const JWT_SECRET = process.env.JWT_SECRET!;

/* =========================
   POST: ADD PARTICIPANT
========================= */
export async function POST(req: Request) {
  try {
    await connect();

    /* ---------- AUTH ---------- */
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    /* ---------- BODY ---------- */
    const { name, dno, email, eventName, eventType } = await req.json();

    if (!name || !dno || !email || !eventName || !eventType) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 },
      );
    }

    /* ---------- FIND EVENT ---------- */
    const eventConfig = await Event.findOne({ eventName, eventType });
    if (!eventConfig) {
      return NextResponse.json(
        { message: "Invalid event selected" },
        { status: 400 },
      );
    }

    /* ---------- TEAM EVENT LIMIT CHECK ---------- */
    const teamEventCount = await Participant.countDocuments({
      teamId: user.teamId,
      "events.eventName": eventName,
    });

    if (teamEventCount >= eventConfig.maxPlayers) {
      return NextResponse.json(
        { message: `Max players reached for ${eventName}` },
        { status: 400 },
      );
    }

    /* ---------- FIND PARTICIPANT ---------- */
    let participant = await Participant.findOne({
      teamId: user.teamId,
      email,
    });

    if (participant) {
      const events = participant.events as {
        eventName: string;
        eventType: string;
      }[];

      /* ❌ already joined this event */
      const exists = events.some((ev) => ev.eventName === eventName);

      if (exists) {
        return NextResponse.json(
          { message: "Participant already registered for this event" },
          { status: 400 },
        );
      }

      /* ❌ max 2 events rule */
      if (events.length >= 2) {
        return NextResponse.json(
          { message: "Participant can join maximum 2 events" },
          { status: 400 },
        );
      }

      /* ✅ add event */
      events.push({ eventName, eventType });
      participant.events = events;
      await participant.save();

      return NextResponse.json(
        { message: "Event added", participant },
        { status: 200 },
      );
    }

    /* ---------- CREATE NEW PARTICIPANT ---------- */
    participant = await Participant.create({
      teamId: user.teamId,
      name,
      dno,
      email,
      events: [{ eventName, eventType }],
      paymentAmount: Number(process.env.NEXT_PUBLIC_DEFAULT_AMOUNT || 500),
      paymentStatus: "PENDING",
    });

    return NextResponse.json(
      { message: "Participant created", participant },
      { status: 201 },
    );
  } catch (err) {
    console.error("ADD PARTICIPANT ERROR:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

/* =========================
   GET: ADMIN FETCH
========================= */
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

/* =========================
   PUT: UPDATE/CHANGE EVENT (FULL VERSION)
========================= */
export async function PUT(req: Request) {
  try {
    await connect();
    const { participantId, oldEventName, eventName, eventType } =
      await req.json();

    if (!participantId || !oldEventName) {
      return NextResponse.json(
        { message: "Missing required identifiers" },
        { status: 400 },
      );
    }

    const updated = await Participant.findOneAndUpdate(
      {
        _id: participantId,
        "events.eventName": oldEventName,
      },
      {
        $set: {
          "events.$.eventName": eventName,
          "events.$.eventType": eventType,
        },
      },
      { new: true },
    );

    if (!updated) {
      return NextResponse.json(
        { message: "Target event not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Event updated successfully",
      updated,
    });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
