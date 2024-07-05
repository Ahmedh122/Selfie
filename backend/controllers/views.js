import Post from "../models/post.js";
import jwt from "jsonwebtoken";

export const addView = async (req, res) => {
  const { userId, postId } = req.query;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      throw new Error("Post not found");
    }

    // Initialize viewedUsers array if undefined
    if (!post.viewedUsers) {
      post.viewedUsers = [];
    }

    // Check if the request is from the post owner
    if (post.userId.toString() === userId) {
      return res
        .status(200)
        .json({ message: "Request from post owner. No view added." });
    }

    // Check if the user is registered and has not viewed the post before
    if (userId !== "undefined_user" && !post.viewedUsers.includes(userId)) {
      post.views += 1;
      post.viewedUsers.push(userId);
      await post.save();

      return res.status(200).json({ message: "View added successfully" });
    } else if (
      userId === "undefined_user" 
     
    ) {
      // If the user is not registered and has not viewed the post before
      post.views += 1;
      await post.save();

      return res.status(200).json({ message: "View added successfully" });
    } else {
      // If the user is registered and has already viewed the post, or the user is not registered and the post has already been viewed
      return res.status(200).json({ message: "Already viewed by the user" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};
