import jwt from "jsonwebtoken";
import moment from "moment";
import Comment from "../models/comment.js";

export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.query.postId })
      .populate( { path: "userId",
      model: "User",
      select: "username profilePic", } ) // Populate user information
      .sort({ createdAt: -1 });

    return res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message || "Internal Server Error");
  }
};

export const addComment = async (req, res) => {
  const token = req.cookies.accessToken;

  try {
    if (!token) return res.status(401).json("Not logged in!");

    const userInfo = jwt.verify(token, "secretkey");

    const newComment = new Comment({
      desc: req.body.desc,
      userId: userInfo.id,
      postId: req.body.postId,
    });

    await newComment.save();
    return res.status(200).json("Comment has been created.");
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message || "Internal Server Error");
  }
};
