import jwt from "jsonwebtoken";
import Relationship from "../models/relationship.js";

export const getRelationships = async (req, res) => {
  try {
    const relationships = await Relationship.find({
      followedUserId: req.query.followedUserId,
    });

    const relationship2 = await Relationship.find({
      followerUserId: req.query.followerUserId,
    });

    const followerUserIds = relationships.map(
      (relationship) => relationship.followerUserId
    );

    const followedUserIds = relationship2.map(
      (relationship) => relationship.followedUserId
    );

    return res.status(200).json({ followers: followerUserIds, following: followedUserIds });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message || "Internal Server Error");
  }
};

export const addRelationship = async (req, res) => {
  const token = req.cookies.accessToken;

  try {
    if (!token) return res.status(401).json("Not logged in!");

    const userInfo = jwt.verify(token, "secretkey");

    const newRelationship = new Relationship({
      followerUserId: userInfo.id,
      followedUserId: req.body.userId,
    });

    await newRelationship.save();
    return res.status(200).json("Following");
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message || "Internal Server Error");
  }
};

export const deleteRelationship = async (req, res) => {
  const token = req.cookies.accessToken;

  try {
    if (!token) return res.status(401).json("Not logged in!");

    const userInfo = jwt.verify(token, "secretkey");

    const deletedRelationship = await Relationship.findOneAndDelete({
      followerUserId: userInfo.id,
      followedUserId: req.query.userId,
    });

    if (deletedRelationship) {
      return res.status(200).json("Unfollowed");
    } else {
      return res.status(500).json("Error unfollowing user.");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message || "Internal Server Error");
  }
};
