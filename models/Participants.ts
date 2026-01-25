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
      index: true,
    },

    // 🔹 MAX 2 EVENTS
    events: [
      {
        eventName: {
          type: String,
          required: true,
        },
        eventType: {
          type: String,
          enum: ["TECHNICAL", "NON-TECHNICAL", "CULTURALS"],
          required: true,
        },
      },
    ],

    // 🔹 SINGLE PAYMENT FOR PARTICIPANT
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID"],
      default: "PENDING",
    },
    paymentAmount: {
      type: Number,
      required: true,
    },
    paymentVerifiedByAdmin: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,
  },
  { timestamps: true },
);

export default models.Participant || model("Participant", ParticipantSchema);
