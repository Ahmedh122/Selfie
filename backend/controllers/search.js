 import Channel from "../models/channel.js";
import User from "../models/users.js";


export const searchUsers = async (req, res) => {
  try {
    const { value } = req.query;

   
    const users = await User.find({ username: { $regex: new RegExp(value, "i") } });
    const channels = await Channel.find({ channelname: { $regex: new RegExp(value, "i") } });

    
    const sortedResults = [...users, ...channels].sort((a, b) => {
      const nameA = (a.username || a.channelname).toLowerCase();
      const nameB = (b.username || b.channelname).toLowerCase();
      return nameA.localeCompare(nameB);
    });

    res.json(sortedResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};