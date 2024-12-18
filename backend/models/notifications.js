import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
   
  },

  type: {
    type: String,
    enum: ["Friend_req", "Message", "Pomodoro" ],
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});



const Notifications = mongoose.model("Notifications", notificationSchema);

export default Notifications;
