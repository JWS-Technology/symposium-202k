import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/db";
import FinalParticipant from "@/models/finalParticipant.model";

export async function POST(req: Request) {
  try {
    await connect();
    const body = await req.json();

    // Normalize data before saving
    const newParticipant = await FinalParticipant.create({
      ...body,
      email: body.email.toLowerCase().trim(),
      teamId: body.teamId.toUpperCase().trim(),
    });

    return NextResponse.json(
      { success: true, participant: newParticipant },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 },
    );
  }
}
