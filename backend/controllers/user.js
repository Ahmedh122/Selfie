import jwt from "jsonwebtoken";
import User from "../models/users.js";
import Friends from "../models/friends.js";
import Notifications from "../models/notifications.js";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getUser = async (req, res) => {
  const token = req.cookies.accessToken;
  const userId = req.params.userId;

  try {
    if (!token) return res.status(401).json("Not logged in!");
    const userInfo = jwt.verify(token, "secretkey");
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const PendingFriendReq = await Notifications.findOne({
      userId: userId, 
      sender: userInfo.id,
      type: "Friend_req", 
    });

    const isPending= !!PendingFriendReq;

    const friendFound = await Friends.findOne(
      { userId: userInfo.id, friends: userId },
      { _id: 1 }
    );
    const isfriend = !!friendFound;
    let friendshipState = "";
    if (isPending){friendshipState="Pending"}
    else if(isfriend){friendshipState="Friends"}
    else{friendshipState="Not_friends"}

    const { password, ...data } = user.toObject();
    return res.json({ ...data, friendshipState });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateUser = async (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json("Not authenticated!");
  }

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) {
      return res.status(403).json("Token is not valid!");
    }

    const userId = userInfo.id;

    try {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.id !== userId) {
        return res.status(403).json("You can update only your profile!");
      }

      const updateFields = {};

      if (req.file) {
        const { type } = req.body;

        if (type === "profilePic") {
          // Delete old profile picture if it exists
          if (user.profilePic) {
            const oldFilePath = path.join(__dirname, "..", user.profilePic);
            fs.unlink(oldFilePath, (err) => {
              if (err)
                console.error("Failed to delete old profile picture:", err);
            });
          }
          updateFields.profilePic = `/uploads/${req.file.filename}`;
        } else if (type === "coverPic") {
          // Delete old cover picture if it exists
          if (user.coverPic) {
            const oldFilePath = path.join(__dirname, "..", user.coverPic);
            fs.unlink(oldFilePath, (err) => {
              if (err)
                console.error("Failed to delete old cover picture:", err);
            });
          }
          updateFields.coverPic = `/uploads/${req.file.filename}`;
        } else {
          return res.status(400).json({ message: "Invalid type parameter" });
        }
      }

      // Update other fields if provided
      if (req.body.name) updateFields.name = req.body.name;
      if (req.body.surname) updateFields.surname = req.body.surname;
      if (req.body.BirthDay) updateFields.BirthDay = req.body.BirthDay;
      if (req.body.Bio) updateFields.Bio = req.body.Bio;

      // Save the updated user
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updateFields },
        { new: true }
      );

      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    if (!users) {
      return res.status(404).json({ message: "No users found" });
    }

    // Exclude sensitive information like password before sending the response
    const usersData = users.map((user) => {
      const { password, ...data } = user.toObject();
      return data;
    });

    return res.json(usersData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
