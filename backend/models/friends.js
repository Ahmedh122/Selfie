import mongoose from "mongoose";

const friendsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
    unique: true, 
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
    },
  ],
});

const Friends = mongoose.model("Friends", friendsSchema);

export default Friends;
