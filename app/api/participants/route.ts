import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connect } from "@/dbconfig/db";
import User from "@/models/User";
import Participant from "@/models/Participants";
import Event from "@/models/event.model";

const JWT_SECRET = process.env.JWT_SECRET!;

/* =========================
   POST: ADD / REGISTER
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
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    /* ---------- BODY ---------- */
    const { name, dno, email, eventName, eventType } = await req.json();

    /* ---------- VALIDATIONS ---------- */
    // 1. Fetch Event configuration from DB
    const eventConfig = await Event.findOne({ eventName, eventType });
    if (!eventConfig)
      return NextResponse.json({ message: "Invalid event" }, { status: 400 });

    // 2. TEAM CAPACITY RESTRICTION: Check if team has already reached maxPlayers for this event
    const participantsInEventCount = await Participant.countDocuments({
      teamId: user.teamId,
      "events.eventName": eventName,
    });

    if (participantsInEventCount >= eventConfig.maxPlayers) {
      return NextResponse.json(
        {
          message: `Limit reached: Your team already has ${eventConfig.maxPlayers} participant(s) registered for ${eventName}.`,
        },
        { status: 400 },
      );
    }

    // 3. Check if participant exists (By DNO or Email)
    let participant = await Participant.findOne({
      $or: [{ dno }, { email }],
    });

    if (participant) {
      // Restriction: Max 2 events per individual
      if (participant.events.length >= 2) {
        return NextResponse.json(
          { message: "Participant already reached max (2) events" },
          { status: 400 },
        );
      }

      // Restriction: Duplicate event check
      if (participant.events.some((ev: any) => ev.eventName === eventName)) {
        return NextResponse.json(
          { message: "Already registered for this event" },
          { status: 400 },
        );
      }

      // Restriction: Cultural Firewall
      const hasCulturals = participant.events.some(
        (ev: any) => ev.eventType === "CULTURALS",
      );
      const isAddingCultural = eventType === "CULTURALS";

      if (hasCulturals !== isAddingCultural) {
        return NextResponse.json(
          {
            message:
              "Restriction: Cultural participants cannot register for Technical/Non-Technical events.",
          },
          { status: 400 },
        );
      }

      /* ✅ ADD TO EXISTING */
      participant.events.push({ eventName, eventType });
      await participant.save();
      return NextResponse.json(
        { message: "Event added", participant },
        { status: 200 },
      );
    }

    /* ---------- CREATE NEW ---------- */
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
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Server error" },
      { status: 500 },
    );
  }
}

/* =========================
   PUT: SWAP / EDIT EVENT
========================= */
export async function PUT(req: Request) {
  try {
    await connect();

    /* ---------- AUTH ---------- */
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer "))
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = await User.findById(decoded.id);
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    const { participantId, oldEventName, eventName, eventType } =
      await req.json();

    if (!participantId || !oldEventName)
      return NextResponse.json(
        { message: "Missing identifiers" },
        { status: 400 },
      );

    // 1. Fetch Event configuration and check Team MaxPlayers
    const eventConfig = await Event.findOne({ eventName, eventType });
    if (!eventConfig)
      return NextResponse.json({ message: "Invalid event" }, { status: 400 });

    const participantsInEventCount = await Participant.countDocuments({
      teamId: user.teamId,
      "events.eventName": eventName,
    });

    if (participantsInEventCount >= eventConfig.maxPlayers) {
      return NextResponse.json(
        {
          message: `Conflict: ${eventName} has reached max capacity for your team.`,
        },
        { status: 400 },
      );
    }

    // 2. Fetch Participant to check restrictions
    const participant = await Participant.findById(participantId);
    if (!participant)
      return NextResponse.json({ message: "Not found" }, { status: 404 });

    // 3. Cultural Firewall check for the OTHER event in the array
    const otherEvent = participant.events.find(
      (ev: any) => ev.eventName !== oldEventName,
    );
    if (otherEvent) {
      const otherIsCultural = otherEvent.eventType === "CULTURALS";
      const newIsCultural = eventType === "CULTURALS";

      if (otherIsCultural !== newIsCultural) {
        return NextResponse.json(
          {
            message: "Restriction: Cannot mix Cultural and Technical sectors.",
          },
          { status: 400 },
        );
      }
    }

    // 4. Update
    const updated = await Participant.findOneAndUpdate(
      { _id: participantId, "events.eventName": oldEventName },
      {
        $set: {
          "events.$.eventName": eventName,
          "events.$.eventType": eventType,
        },
      },
      { new: true },
    );

    return NextResponse.json({
      message: "Event updated successfully",
      updated,
    });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

/* =========================
   GET: ADMIN FETCH
========================= */
export async function GET(req: Request) {
  try {
    await connect();
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer "))
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { role?: string };
    if (decoded.role !== "ADMIN")
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const participants = await Participant.find()
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ count: participants.length, participants });
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
