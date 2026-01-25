import mongoose, { Schema, model, models } from "mongoose";

const ParticipantSchema = new Schema(
  {
    teamId: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    dno: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    event: {
      type: String,
      required: true,
    },
    eventType: {
      type: String,
      required: true,
      enum: ["TECHNICAL", "NON-TECHNICAL", "CULTURALS"],
    },
  },
  { timestamps: true },
);

export default models.Participant || model("Participant", ParticipantSchema);
