import jwt from "jsonwebtoken";
import Like from "../models/like.js";

export const getLikes = async (req, res) => {
  try {
    const postId = req.query.postId;

    //console.log("Received postId:", postId);

    if (!postId) {
      return res.status(400).json({ error: "postId is required" });
    }

    const likes = await Like.find({ postId, type: "like"});

    const userIds = likes.map((like) => like.userId);
    return res.status(200).json(userIds);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message || "Internal Server Error");
  }
};

export const getDislikes = async (req, res) => {
  try {
    const postId = req.query.postId;

    if (!postId) {
      return res.status(400).json({ error: "postId is required" });
    }

    const dislikes = await Like.find({ postId, type: "dislike" });

    const userIds = dislikes.map((dislike) => dislike.userId);
    return res.status(200).json(userIds);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message || "Internal Server Error");
  }
};
export const addLike = async (req, res) => {
  const token = req.cookies.accessToken;

  try {
    if (!token) return res.status(401).json("Not logged in!");

    const userInfo = jwt.verify(token, "secretkey");
    
    const deletedDislike = await Like.findOneAndDelete({
      userId: userInfo.id,
      postId: req.body.postId,
      type: "dislike",
    });
    console.log("Deleted dislike:", deletedDislike)
    if (deletedDislike) {
      console.log("Deleted dislike:", deletedDislike)
    }
    const newLike = new Like({
      userId: userInfo.id,
      postId: req.body.postId,
      type: "like",
    });
    await newLike.save();
    return res.status(200).json("Post has been liked.");
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message || "Internal Server Error");
  }
};

export const deleteLike = async (req, res) => {
  const token = req.cookies.accessToken;

  try {
    if (!token) return res.status(401).json("Not logged in!");

    const userInfo = jwt.verify(token, "secretkey");

    const deletedLike = await Like.findOneAndDelete({
      userId: userInfo.id,
      postId: req.query.postId,
      type: "like",
    });

    if (deletedLike) {
      return res.status(200).json("Post has been disliked.");
    } else {
      return res.status(500).json("Error disliking post.");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message || "Internal Server Error");
  }
};


export const addDislike = async (req, res) => {
  const token = req.cookies.accessToken;

  try {
    if (!token) return res.status(401).json("Not logged in!");

    const userInfo = jwt.verify(token, "secretkey");
    
    const deletedLike = await Like.findOneAndDelete({
      userId: userInfo.id,
      postId: req.body.postId,
      type: "like",
    });
    console.log("Deleted like:", deletedLike)
    if (deletedLike) {
      console.log("Deleted like:", deletedLike)
    }
    const newLike = new Like({
      userId: userInfo.id,
      postId: req.body.postId,
      type: "dislike",
    });
    await newLike.save();
    return res.status(200).json("Post has been disliked.");
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message || "Internal Server Error");
  }
};

export const deleteDislike = async (req, res) => {
  const token = req.cookies.accessToken;

  try {
    if (!token) return res.status(401).json("Not logged in!");

    const userInfo = jwt.verify(token, "secretkey");

    const deletedLike = await Like.findOneAndDelete({
      userId: userInfo.id,
      postId: req.query.postId,
      type: "dislike",
    });
    console.log("Deleted like:", deletedLike)
    if (deletedLike) {
      return res.status(200).json("Post has been de-disliked.");
    } else {
      return res.status(500).json("Error disliking post.");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message || "Internal Server Error");
  }
};