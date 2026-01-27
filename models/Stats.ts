import mongoose from "mongoose";

const StatsSchema = new mongoose.Schema({
  key: { type: String, default: "visitor_count" },
  count: { type: Number, default: 0 },
});

export default mongoose.models.Stats || mongoose.model("Stats", StatsSchema);
