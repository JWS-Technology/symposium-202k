// models/Question.ts
import { Schema, model, models } from "mongoose";

const QuestionSchema = new Schema(
  {
    // New Field: Linking to the Event model
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    eventName: { type: String, required: true },
    type: { type: String, enum: ["mcq", "code"], default: "mcq" },
    question: { type: String, required: true },
    code: String,
    language: String,
    options: { type: [String], required: true },
    correctIndex: { type: Number, required: true },
    subject: String,
    difficulty: String,
    explanation: String,
  },
  { timestamps: true },
);

export default models.Question || model("Question", QuestionSchema);
