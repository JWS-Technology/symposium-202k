import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/db"; // Ensure your DB connection helper is here
import Participant from "@/models/Participants";

export async function DELETE(req: Request) {
  try {
    await connect();

    // Extracting the ID from the request body
    const { participantId } = await req.json();

    if (!participantId) {
      return NextResponse.json(
        { success: false, message: "PARTICIPANT_ID_REQUIRED" },
        { status: 400 },
      );
    }

    // Executing deletion
    const deletedParticipant =
      await Participant.findByIdAndDelete(participantId);

    if (!deletedParticipant) {
      return NextResponse.json(
        { success: false, message: "ENTITY_NOT_FOUND_IN_REGISTRY" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: `PARTICIPANT_${deletedParticipant.teamId}_TERMINATED`,
    });
  } catch (error: any) {
    console.error("DELETION_ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: "INTERNAL_SYSTEM_CRASH",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
