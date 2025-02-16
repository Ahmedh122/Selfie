import jwt from "jsonwebtoken";
import Friends from "../models/friends.js";
import Notifications from "../models/notifications.js";


export const getFriendship = async (req, res) => {
  const token = req.cookies.accessToken;

  try {
    if (!token) return res.status(401).json("Not logged in!");
    const userInfo = jwt.verify(token, "secretkey");
    const { userId } = req.params;

    if (!userId) return res.status(200).json("User ID required!");

    const friendFound = await Friends.findOne(
      { userId: userInfo.id, friends: userId },
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
    const { userId } = req.params;

    if (!userId) return res.status(400).json("Friend ID is required!");

    if (userInfo.id === userId) {
      return res.status(400).json("You cannot add yourself as a friend!");
    }



    try {
      await Friends.updateOne(
        { userId: userInfo.id },
        { $addToSet: { friends: userId } },
        { upsert: true }
      );

      await Friends.updateOne(
        { userId: userId },
        { $addToSet: { friends: userInfo.id } },
        { upsert: true }
      );

      const io = req.app.get("socketio");

    await Notifications.findOneAndDelete({
      userId : userInfo.id, sender : userId, type: "Friend_req"
    });

    

    const notif1 = new Notifications({
      userId: userInfo.id,
      sender: userId,
      type: "You_accepted_a_friend_req",
    });

    const notif2 = new Notifications({
      userId: userId,
      sender: userInfo.id,
      type: "friend_req_accepted",
    });
    await notif1.save();
    await notif2.save();
    io.to(userInfo.id).emit("notification", { message: "New notification!" });
    io.to(userId).emit("notification", { message: "New notification!" });

      return res.status(200).json("Friend added successfully!");
    } catch (err) {
    
      throw err;
    }
  } catch (error) {
    console.error("Error adding friend:", error.message);
    return res.status(500).json(error.message || "Internal Server Error");
  }
};
