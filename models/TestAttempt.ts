import { Schema, model, models } from "mongoose";

const TestAttemptSchema = new Schema(
  {
    participantId: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
    },
    teamId: { type: String, required: true },
    participantEmail: { type: String, required: true },

    questions: [
      {
        questionId: Schema.Types.ObjectId,
        question: String,
        code: String,
        options: [String],
        correctIndex: Number,
      },
    ],

    answers: [Number],
    score: { type: Number, default: 0 },
    duration: {
      type: Number, // seconds
      required: true,
    },
    submitted: { type: Boolean, default: false },
    startedAt: { type: Date, default: Date.now },
    submittedAt: Date,
  },
  { timestamps: true },
);

export default models.TestAttempt || model("TestAttempt", TestAttemptSchema);
