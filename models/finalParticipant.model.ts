// models/FinalParticipant.ts
import { Schema, model, models } from "mongoose";

const FinalParticipantSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    teamId: {
      type: String,
      required: true,
      trim: true,
    },
    college: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    // Optional: Linking to an Event if needed, similar to your Question model
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
    },
  },
  { timestamps: true },
);

export default models.FinalParticipant ||
  model("FinalParticipant", FinalParticipantSchema);
