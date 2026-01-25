// models/PaymentConfig.ts
import mongoose from "mongoose";

const PaymentConfigSchema = new mongoose.Schema({
  upiId: { type: String, required: true },
  payeeName: { type: String, required: true },
  defaultAmount: { type: Number, required: true },
  active: { type: Boolean, default: true },
});

export default mongoose.models.PaymentConfig ||
  mongoose.model("PaymentConfig", PaymentConfigSchema);
