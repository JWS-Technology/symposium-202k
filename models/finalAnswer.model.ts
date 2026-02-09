import { Schema, model, models } from "mongoose";

const FinalAnswerSchema = new Schema(
  {
    // --- Session Identification ---
    participantId: {
      type: Schema.Types.ObjectId,
      ref: "FinalParticipant",
      required: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    teamId: { type: String, required: true },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    // --- NEW: The Array of Answers ---
    // This fixes the "questionId is required" error by moving it inside an array
    answers: [
      {
        questionId: { type: Schema.Types.ObjectId, ref: "FinalQuestion" },
        selectedOption: { type: Number, required: true },
        isCorrect: { type: Boolean, default: false },
        marksObtained: { type: Number, default: 0 },
      }
    ],

    // --- Stats ---
    totalScore: { type: Number, default: 0 },
    violations: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    strict: true,
  }
);

// Constraint: One submission per participant per event
FinalAnswerSchema.index({ participantId: 1, eventId: 1 }, { unique: true });

// Check if the model exists to prevent overwrite errors during hot-reloading
const FinalAnswer = models.FinalAnswer || model("FinalAnswer", FinalAnswerSchema);

export default FinalAnswer;