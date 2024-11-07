import jwt from "jsonwebtoken";
import Event from "../models/event.js";
import Relationship from "../models/relationship.js";
import Subscription from "../models/subscription.js";



export const getEvents = async (req, res) => {
  const { date } = req.query;
  const token = req.cookies.accessToken;

  if (!token) return res.status(401).json("Not logged in!");

  try {
    const userInfo = jwt.verify(token, "secretkey");
    const userId = userInfo.id;

        const queryDate = new Date(date);

        const events = await Event.find({
          userId: userId,
          $and: [
            { eventStart: { $lte: queryDate } },
            { eventEnd: { $gte: queryDate } },
          ],
        }).sort({ createdAt: -1 });
        
    return res.status(200).json(events);
    
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message || "Internal Server Error");
  }
};


export const getAllEvents = async (req, res) => {
 
  const token = req.cookies.accessToken;

  if (!token) return res.status(401).json("Not logged in!");

  try {
    const userInfo = jwt.verify(token, "secretkey");
    const userId = userInfo.id;

    const queryDate = new Date(date);

    const events = await Event.find().sort({ createdAt: -1 });

    return res.status(200).json(events);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message || "Internal Server Error");
  }
};


export const addEvent = async (req, res) => {
 
  const token = req.cookies.accessToken;
  //console.log(req.body);
  
  
  try {
    if (!token) return res.status(401).json("Not logged in!");

    const userInfo = jwt.verify(token, "secretkey");
    //console.log(userInfo.id);
    
    const newEvent = new Event({
      title: req.body.title,
      userId: userInfo.id,
      eventStart: req.body.selectedDateEventStart,
      eventEnd: req.body.selectedDateEventEnd,
      description: req.body.description, 
    });
    //console.log(newPost);  
    const savedEvent = await newEvent.save();

    return res.status(200).json({ message: "event has been created.", eventId: savedEvent._id});
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message || "Internal Server Error");
  }
};

export const deleteEvent = async (req, res) => {
  const token = req.cookies.accessToken;

  try {
    if (!token) return res.status(401).json("Not logged in!");

    const userInfo = jwt.verify(token, "secretkey");

    const deletedPost = await Post.findOneAndDelete({
      _id: req.params.id,
      userId: userInfo.id,
    });

    if (deletedPost) {
      return res.status(200).json("Post has been deleted.");
    } else {
      return res.status(403).json("You can delete only your post.");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message || "Internal Server Error");
  }
};


export const getPublicPosts = async (req, res) => {
  
  try {

    const posts = await Post.find({public : true}).sort({ createdAt: -1 }).populate({
      path: "userId",
      model: "User",
      select: "username profilePic",
    });

    return res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message || "Internal Server Error");
  }
};
