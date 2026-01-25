import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    teamId: {
      type: String,
      unique: true,
      index: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    college: { type: String, required: true },
    department: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true },
);

export default models.User || model("User", UserSchema);
