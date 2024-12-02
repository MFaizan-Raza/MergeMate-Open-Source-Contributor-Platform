import mongoose from "mongoose"

const TeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  expertise: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export default mongoose.model("Team", TeamSchema);
