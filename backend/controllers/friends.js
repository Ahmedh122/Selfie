import jwt from "jsonwebtoken";
import Friends from "../models/friends.js";

export const getFriendship = async (req, res) => {
  const token = req.cookies.accessToken;

  try {
    if (!token) return res.status(401).json("Not logged in!");
    const userInfo = jwt.verify(token, "secretkey");
    const { friendId } = req.params;

    if (!friendId) return res.status(200).json("User ID required!");

    const friendFound = await Friends.findOne(
      { userId: userInfo.id, friends: friendId },
      { _id: 1 }
    );

    if (friendFound) {
      return res.status(200).json(true);
    } else {
      return res.status(200).json(false);
    }
  } catch (error) {
    console.error("Error checking friendship:", error.message);
    return res.status(500).json(error.message || "Internal Server Error");
  }
};

export const addFriend = async (req, res) => {
  const token = req.cookies.accessToken;

  try {
    if (!token) return res.status(401).json("Not logged in!");

    const userInfo = jwt.verify(token, "secretkey");
    const { friendId } = req.body;

    if (!friendId) return res.status(400).json("Friend ID is required!");

    if (userInfo.id === friendId) {
      return res.status(400).json("You cannot add yourself as a friend!");
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await Friends.updateOne(
        { userId: userInfo.id },
        { $addToSet: { friends: friendId } },
        { upsert: true, session }
      );

      await Friends.updateOne(
        { userId: friendId },
        { $addToSet: { friends: userInfo.id } },
        { upsert: true, session }
      );

      await session.commitTransaction();
      session.endSession();

      return res.status(200).json("Friend added successfully!");
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  } catch (error) {
    console.error("Error adding friend:", error.message);
    return res.status(500).json(error.message || "Internal Server Error");
  }
};
