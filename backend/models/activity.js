import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to the User model
  title: String,
  startDate: Date,
  endDate: Date,
  type: {
    type: String,
    default: "activity",
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
  ], // Reference to the User model
  subActivities: [{ type: mongoose.Schema.Types.ObjectId, ref: "SubActivity" }], // Reference to SubActivity model
});

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;
