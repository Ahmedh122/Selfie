import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  desc: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
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
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
