import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    type: {
      type: String,
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    additionalData: {
      type: mongoose.Schema.Types.Mixed, // Flexible field for storing extra data
    },
  },
  {
    timestamps: true,
  }
);

const Notifications = mongoose.model("Notifications", notificationSchema);

export default Notifications;
