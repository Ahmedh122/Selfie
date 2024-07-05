import jwt from "jsonwebtoken";
import Subscription from "../models/subscription.js";

export const getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({
      channelname: req.query.channelname,
    });

    const subscriberIds = subscriptions.map(
      (relationship) => relationship.subscriberId
    );
    return res.status(200).json(subscriberIds);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message || "Internal Server Error");
  }
};

export const getSubscription = async (req, res) => {
  try {
    const userId = req.query.userId; // Use userId instead of currentUser._id
    const subscriptions = await Subscription.find({
      subscriberId: userId,
    });

    const channelnames = subscriptions.map(
      (relationship) => relationship.channelname
    );

    return res.status(200).json(channelnames);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message || "Internal Server Error");
  }
};

export const addSubscription = async (req, res) => {
  const token = req.cookies.accessToken;

  try {
    if (!token) return res.status(401).json("Not logged in!");

    const userInfo = jwt.verify(token, "secretkey");

    const newSubscription = new Subscription({
      subscriberId: userInfo.id,
      channelname: req.body.channelname,
    });

    await newSubscription.save();
    return res.status(200).json("Following");
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message || "Internal Server Error");
  }
};

export const deleteSubscription = async (req, res) => {
  const token = req.cookies.accessToken;

  try {
    if (!token) return res.status(401).json("Not logged in!");

    const userInfo = jwt.verify(token, "secretkey");

    const deletedSubscription = await Subscription.findOneAndDelete({
      subscriberId: userInfo.id,
      channelname: req.query.channelname,
    });

    if (deletedSubscription) {
      return res.status(200).json("Unfollowed");
    } else {
      return res.status(500).json("Error unfollowing user.");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message || "Internal Server Error");
  }
};
