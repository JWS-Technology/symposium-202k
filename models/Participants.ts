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

// Add this before the export default in your Participant model file
ParticipantSchema.virtual("userDetails", {
  ref: "User",
  localField: "teamId",
  foreignField: "teamId",
  justOne: true,
});

// Ensure virtuals are included in JSON/Object outputs
ParticipantSchema.set("toObject", { virtuals: true });
ParticipantSchema.set("toJSON", { virtuals: true });

export default models.Participant || model("Participant", ParticipantSchema);
