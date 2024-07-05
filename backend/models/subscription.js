import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  subscriberId: { //followerUserId
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming you have a User model
    required: true,
  },
  channelname: { //followedUserId
    type: String,
    ref: "Channel", // Assuming you have a User model
    required: true,
  },
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
