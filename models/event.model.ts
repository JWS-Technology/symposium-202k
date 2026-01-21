import mongoose, { Schema, Document } from "mongoose";

// 1. Define the TypeScript Interface
export interface EventDocument extends Document {
  eventName: string;
  minPlayers: number;
  maxPlayers: number;
  eventType: "ON_STAGE" | "OFF_STAGE" | "CULTURALS"; // Strict Enum Typing
  createdAt: Date;
  updatedAt: Date;
}

// 2. Define the Schema
const EventSchema = new Schema<EventDocument>(
  {
    eventName: {
      type: String,
      required: [true, "Event name is required"],
      trim: true,
      unique: true, // Note: Ensure your DB indexes are synced
    },
    minPlayers: {
      type: Number,
      required: [true, "Minimum players required"],
      min: 1,
    },
    maxPlayers: {
      type: Number,
      required: [true, "Maximum players required"],
    },
    eventType: {
      type: String,
      required: true,
      enum: ["ON_STAGE", "OFF_STAGE", "CULTURALS"],
      uppercase: true,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// 3. Export the Model (checking if it already exists first)
export default mongoose.models.Event ||
  mongoose.model<EventDocument>("Event", EventSchema);