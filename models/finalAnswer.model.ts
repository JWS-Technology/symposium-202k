import { Schema, model, models } from "mongoose";

const FinalAnswerSchema = new Schema(
  {
    // Link to the result record this answer belongs to
    resultId: {
      type: Schema.Types.ObjectId,
      ref: "FinalResult",
      required: true,
      index: true,
    },

    // Link to the specific participant
    participantId: {
      type: Schema.Types.ObjectId,
      ref: "FinalParticipant",
      required: true,
      index: true,
    },

    // Link to the specific question
    questionId: {
      type: Schema.Types.ObjectId,
      ref: "FinalQuestion",
      required: true,
    },

    // The index of the option the user selected (e.g., 0 for A, 1 for B)
    // Use -1 or null to represent an unattempted question
    selectedOption: {
      type: Number,
      required: true,
      default: -1,
    },

    // Boolean to quickly check correctness without re-calculating
    isCorrect: {
      type: Boolean,
      required: true,
      default: false,
    },

    // Marks awarded for this specific answer
    marksObtained: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

// Prevent duplicate answers for the same question by the same participant in a single result
FinalAnswerSchema.index({ resultId: 1, questionId: 1 }, { unique: true });

export default models.FinalAnswer || model("FinalAnswer", FinalAnswerSchema);