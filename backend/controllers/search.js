import User from "../models/users.js";
import Friends from "../models/friends.js";
import jwt from "jsonwebtoken";

export const searchUsers = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
  
    const userInfo = jwt.verify(token, "secretkey");

    const { value, filter } = req.query; 

    if (!value || value.trim() === "") {
      return res.status(400).json({ error: "Search value is required." });
    }

    let users;

    if (filter === "friends") {
      
      const friendsList = await Friends.findOne({
        userId: userInfo.id,
      }).populate("friends", "name surname profilePic");

      if (!friendsList || !friendsList.friends) {
        return res.status(404).json({ error: "Friends list not found." });
      }

    
      users = friendsList.friends.filter((friend) =>
        friend.name.toLowerCase().includes(value.toLowerCase())
      );
    } else {
     
      users = await User.find({
        name: { $regex: new RegExp(value, "i") },
      });
    }


    const sortedResults = users.sort((a, b) => {
      const nameA = a.name ? a.name.toLowerCase() : "";
      const nameB = b.name ? b.name.toLowerCase() : "";
      return nameA.localeCompare(nameB);
    });

    res.json(sortedResults);
  } catch (error) {
    console.error("Error in searchUsers:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};
