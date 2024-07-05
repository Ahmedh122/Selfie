import jwt from "jsonwebtoken";
import Channel from "../models/channel.js";

export const getChannel = async (req, res) => {
  const channelname = req.params.channelname;
  
  try {
    const channel = await Channel.findOne({ channelname: channelname }).populate({
      path: "admin",
      model:"User",
      select:"username",
    });
    if (!channel) {
      return res.status(404).json({ message: "channel not found" });
    }

    return res.send(channel);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addChannel = async (req, res) => {
  const token = req.cookies.accessToken;

  try {
    if (!token) return res.status(401).json("Not logged in!");

    const userInfo = jwt.verify(token, "secretkey");

    // Check if channel already exists
    const existingChannel = await Channel.findOne({ channelname: req.body.channelname });
    if (existingChannel && existingChannel.isHashtag === false) {
      return res.status(409).json("Channel already exists!");
    }
    if (existingChannel && existingChannel.isHashtag === true) {
      return;
    }
    const newChannel = new Channel({
      admin: req.body.admin,
      channelname: req.body.channelname,
      channelPic: req.body.channelpic,
      coverPic: req.body.coverpic,
      isHashtag: req.body.isHashtag || false,
      isAdmin: req.body.isAdmin || false,
    });

    await newChannel.save();

   

    return res.status(200).json({
      message: "Channel has been created.",
      channelname: newChannel.channelname,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message || "Internal Server Error");
  }
};

export const deleteChannel = async (req, res) => {
  const token = req.cookies.accessToken;

  try {
    if (!token) return res.status(401).json("Not logged in!");

    const userInfo = jwt.verify(token, "secretkey");

    const deleteChannel = await Channel.findOneAndDelete({
      channelname: req.params.channelname,
      admin: userInfo.id,
    });

    if (deleteChannel) {
      return res.status(200).json("Channel has been deleted.");
    } else {
      return res.status(403).json("You can delete only your Channel.");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message || "Internal Server Error");
  }
};

export const getChannellist = async (req , res) => {

 

  try {

  //console.log("userid" , userId);

    const channel = await Channel.find({});
      if (!channel || channel.length === 0) {
        return res.json([]); // Return an empty array
      }

    // Exclude sensitive information like password before sending the response
    return res.json(channel);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const modifyChannel = async (req, res) => {
  const token = req.cookies.accessToken;

  try {
    if (!token) return res.status(401).json("Not logged in!");
    const userInfo = jwt.verify(token, "secretkey");

    const channel = await Channel.findOne({
      channelname: req.body.channelname,
    });
    console.log(channel);
    if (!channel) {
      return res.status(404).json({ message: "channel not found" });
    }

    if (channel.admin.toHexString() !== userInfo.id) {
      return res.status(403).json("You can modify only your channel.");
    }

    const updateFields = {};

    if (req.body.channelname2) {
      updateFields.channelname = req.body.channelname2;
    }

    if (req.body.newcoverpic) {
      updateFields.coverPic = req.body.newcoverpic;
    }

    if (req.body.newchannelpic) {
      updateFields.channelPic = req.body.newchannelpic;
    }

    const updatedChannel = await Channel.findOneAndUpdate(
      { channelname: req.body.channelname },
      { $set: updateFields },
      { new: true }
    );

    return res.status(200).json({
      message: "Channel has been updated.",
      channelname: updatedChannel.channelname,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message || "Internal Server Error");
  }
};
