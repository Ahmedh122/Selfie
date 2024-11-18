import jwt from "jsonwebtoken";
import Event from "../models/event.js";
//import Relationship from "../models/relationship.js";
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
               $expr: {
        $and: [
          {
            $lte: [
              {
                $dateFromParts: {
                  year: { $year: "$eventStart" },
                  month: { $month: "$eventStart" },
                  day: { $dayOfMonth: "$eventStart" }
                }
              },
              queryDate
            ]
          },
          {
            $gte: [
              {
                $dateFromParts: {
                  year: { $year: "$eventEnd" },
                  month: { $month: "$eventEnd" },
                  day: { $dayOfMonth: "$eventEnd" }
                }
              },
              queryDate
            ]
          }
        ]
      }
    }).sort({ createdAt: -1 });
        
        
        
    return res.status(200).json(events);
    
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message || "Internal Server Error");
  }
};

function getDatesBetween(startDate, endDate) {

  const dates = [];
  const currentDate = new Date(startDate);

  while (currentDate.getDate() <= endDate.getDate()) {
    dates.push(new Date(currentDate)); // Add a copy of the date
    currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
  }

  return dates;
}
export const getAllEvents = async (req, res) => {

  const token = req.cookies.accessToken;

  if (!token) return res.status(401).json("Not logged in!");

  try {
    const userInfo = jwt.verify(token, "secretkey");
    const userId = userInfo.id;

    // Fetch all events for the user, sorted by creation date
    const events = await Event.find({userId : userId});
    const allEventDays = new Set(); // Using a Set to keep dates unique

    events.forEach((event) => {
      const eventDays = getDatesBetween(event.eventStart, event.eventEnd);
      eventDays.forEach((day) => {
        // Push only the date part without time for comparison purposes
        allEventDays.add(day.toISOString().split("T")[0]);
      });
    });console.log(Array.from(allEventDays));

    // Convert the Set to an array, each date in ISO string format (yyyy-mm-dd)
    return res.json(Array.from(allEventDays));
   
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
     const title =
       req.body.title && req.body.title.trim() !== ""
         ? req.body.title
         : "Untitled";
    
    const newEvent = new Event({
      title: title,
      userId: userInfo.id,
      eventStart: req.body.selectedDateEventStart,
      eventEnd: req.body.selectedDateEventEnd,
      description: req.body.description, 
      type: req.body.eventType,
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
