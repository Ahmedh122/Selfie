import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming you have a User model
    required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post", // Assuming you have a Post model
    required: true,
  },
  type: {
    type: String,
    enum: ["like", "dislike"],
    required: true,
  },
});

const Like = mongoose.model("Like", likeSchema);

export default Like;
