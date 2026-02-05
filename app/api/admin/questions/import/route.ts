// app/api/questions/import/route.ts
import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/db";
import Question from "@/models/Question";
import Event from "@/models/event.model";
import mongoose from "mongoose";

export async function POST(req: Request) {
  try {
    await connect();

    // 1. Get data from body
    const { eventId, questions } = await req.json();

    // 2. Validate Event ID
    if (!eventId || !mongoose.Types.ObjectId.isValid(eventId)) {
      return NextResponse.json(
        { message: "INVALID_EVENT_ID: Provide a valid MongoID" },
        { status: 400 },
      );
    }

    // 3. Verify Event exists in DB
    const eventExists = await Event.findById(eventId);
    if (!eventExists) {
      return NextResponse.json(
        { message: "TARGET_EVENT_NOT_FOUND" },
        { status: 404 },
      );
    }

    // 4. Validate Questions Array
    if (!Array.isArray(questions)) {
      return NextResponse.json(
        { message: "INVALID_PAYLOAD: Questions must be an array" },
        { status: 400 },
      );
    }

    const prepared = questions.map((q, index) => {
      // Basic Validation
      if (!q.question || !Array.isArray(q.options)) {
        throw new Error(`Data corruption at index ${index}`);
      }

      // Logic for finding the correct answer marked with '*'
      const correctIndexes = q.options
        .map((opt: string, i: number) => (opt.startsWith("*") ? i : -1))
        .filter((i: number) => i !== -1);

      if (correctIndexes.length !== 1) {
        throw new Error(
          `Unit ${index + 1}: Exactly one option must start with '*'`,
        );
      }

      const cleanOptions = q.options.map((opt: string) =>
        opt.startsWith("*") ? opt.slice(1) : opt,
      );

      return {
        // --- RELATIONSHIP DATA ---
        eventId: eventExists._id, // Storing ID for DB references
        eventName: eventExists.eventName, // Denormalized name for easy UI display

        // --- QUESTION DATA ---
        type: q.type || "mcq",
        question: q.question,
        code: q.type === "code" ? q.code : undefined,
        language: q.type === "code" ? q.language : undefined,
        options: cleanOptions,
        correctIndex: correctIndexes[0],
        subject: q.subject,
        difficulty: q.difficulty,
        explanation: q.explanation,
      };
    });
    // console.log("PREPARED_DATA_SAMPLE:", prepared[0]);
    // 5. Bulk Insert
    const result = await Question.insertMany(prepared);

    return NextResponse.json({
      message: "INJECTION_SUCCESSFUL",
      count: result.length,
      event: eventExists.eventName,
    });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "UPLINK_ERROR" },
      { status: 500 },
    );
  }
}
