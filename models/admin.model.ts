import mongoose, { Schema, Document } from "mongoose";

export interface AdminDocument extends Document {
  email: string;
  password: string;
}

const AdminSchema = new Schema<AdminDocument>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export default mongoose.models.Admin ||
  mongoose.model<AdminDocument>("Admin", AdminSchema);
