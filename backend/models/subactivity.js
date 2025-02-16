import mongoose from "mongoose";

const subActivitySchema = new mongoose.Schema({
  title: String,
  startDate: Date,
  endDate: Date,
  type: {
    type: String,
    default: "subactivity",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  participants: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to the User model
      status: { type: String, default: "pending" }, // Default status is "pending"
    },
  ],
});

const SubActivity = mongoose.model("SubActivity", subActivitySchema);

export default SubActivity;
