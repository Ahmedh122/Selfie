import User from "../models/users.js";

export const searchUsers = async (req, res) => {
  try {
    const { value } = req.query;

    if (!value || value.trim() === "") {
      return res.status(400).json({ error: "Search value is required." });
    }

  
    const users = await User.find({
      name: { $regex: new RegExp(value, "i") },
    });

 
    const sortedResults = users.sort((a, b) => {
      const nameA = a.name ? a.name.toLowerCase() : ""; 
      const nameB = b.name ? b.name.toLowerCase() : ""; 
      return nameA.localeCompare(nameB);
    });

    res.json(sortedResults);
  } catch (error) {
    console.error("Error in searchUsers:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
