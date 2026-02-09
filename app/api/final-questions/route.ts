import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbconfig/db";
import FinalQuestion from "@/models/finalQuestions.model";

export async function POST(req: NextRequest) {
  try {
    await connect();

    const body = await req.json();

    // Expecting array for bulk insert
    if (!Array.isArray(body)) {
      return NextResponse.json(
        { message: "Payload must be an array of final questions" },
        { status: 400 },
      );
    }

    // Safety check: prevent accidental overwrite
    const eventId = body[0]?.eventId;
    if (!eventId) {
      return NextResponse.json(
        { message: "eventId is required" },
        { status: 400 },
      );
    }

    const alreadyExists = await FinalQuestion.findOne({ eventId });
    if (alreadyExists) {
      return NextResponse.json(
        { message: "Final questions already exist for this event" },
        { status: 409 },
      );
    }

    const inserted = await FinalQuestion.insertMany(body, {
      ordered: true,
    });

    return NextResponse.json(
      {
        message: "Final questions uploaded successfully",
        count: inserted.length,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to upload final questions" },
      { status: 500 },
    );
  }
}
export async function GET(req: NextRequest) {
  await connect();

  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("eventId");

  if (!eventId || eventId === "undefined") {
    return NextResponse.json({ message: "Invalid eventId" }, { status: 400 });
  }

  const questions = await FinalQuestion.find({ eventId })
    .sort({ createdAt: 1 })
    .lean();

  return NextResponse.json({ questions });
}

// export async function GET(req: NextRequest) {
//   try {
//     await connect();

//     const { searchParams } = new URL(req.url);
//     const eventId = searchParams.get("eventId");

//     if (!eventId) {
//       return NextResponse.json(
//         { message: "eventId query param is required" },
//         { status: 400 },
//       );
//     }

//     const questions = await FinalQuestion.find({ eventId })
//       .select("-correctIndex") // hide answers if needed
//       .lean();

//     return NextResponse.json(
//       {
//         count: questions.length,
//         questions,
//       },
//       { status: 200 },
//     );
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { message: "Failed to fetch final questions" },
//       { status: 500 },
//     );
//   }
// }
