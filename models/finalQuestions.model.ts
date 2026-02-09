// models/FinalQuestion.ts
import { Schema, model, models } from "mongoose";

const FinalQuestionSchema = new Schema(
  {
    // ONLY linkage — no dependency
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event", // allowed, but NOT required at runtime
      required: true,
      index: true,
    },

    // Snapshot fields (never populated)
    eventName: {
      type: String,
      required: true,
    },

    eventType: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["mcq", "code"],
      required: true,
    },

    question: {
      type: String,
      required: true,
    },

    // MCQ only
    options: {
      type: [String],
      required: function () {
        return this.type === "mcq";
      },
    },

    correctIndex: {
      type: Number,
      required: function () {
        return this.type === "mcq";
      },
      min: 0,
    },

    marks: {
      type: Number,
      required: true,
      min: 0,
    },

    subject: String,
    difficulty: String,
    explanation: String,

    isFinal: {
      type: Boolean,
      default: true,
      immutable: true,
    },
  },
  {
    timestamps: true,
    strict: true,
  },
);

export default models.FinalQuestion ||
  model("FinalQuestion", FinalQuestionSchema);
