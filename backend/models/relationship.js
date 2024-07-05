import mongoose from "mongoose";

const relationshipSchema = new mongoose.Schema({
  followerUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming you have a User model
    required: true,
  },
  followedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming you have a User model
    required: true,
  },
});

const Relationship = mongoose.model("Relationship", relationshipSchema);

export default Relationship;
