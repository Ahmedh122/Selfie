import jwt from "jsonwebtoken";
import Notifications from "../models/notifications.js";




export const sendNotif = async (req, res) => {
  const token = req.cookies.accessToken;
  const receiver = req.params.userId;
  const type = req.body.type;

  try {
    if (!token) return res.status(401).json({ message: "Not logged in" });
    const userInfo = jwt.verify(token, "secretkey");
    if (!receiver) return res.status(404).json({ message: "User Not found" });

    const existingnotif = await Notifications.findOneAndDelete({
      userId: receiver,
      sender: userInfo.id,
      type: type,
    });

    const io = req.app.get("socketio"); // Access io instance

    if (existingnotif) {
      io.to(receiver).emit("notification", { message: "New notification!" });
      return res.status(200).json("notification sent");
    } else {
      const notif = new Notifications({
        userId: receiver,
        recInfo: receiver,
        sender: userInfo.id,
        type: type,
      });

      await notif.save();
      io.to(receiver).emit("notification", { message: "New notification!" });
      return res.status(200).json("notification sent");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message || "Internal Server Error");
  }
};




export const getNotif = async (req, res) => {
    const token = req.cookies.accessToken;
     try{
        if (!token) return res.status(401).json({ message: "Not logged in" });
        const userInfo = jwt.verify(token, "secretkey");
        const notifications = await Notifications.find({
          userId: userInfo.id,
        })
          .sort({ createdAt: -1 })
          .populate("sender", "name surname profilePic _id")
        
     
        return res.status(200).json(notifications)
     }catch(error){
        console.error(error);
        return res.status(500).json(error.message || "Internal Server Error");

     }

};



export const deleteNotif = async (req, res) => {


 try{
  const notification = await Notifications.findOneAndDelete(
    {_id:req.params.id}
  );

  if(!notification){
    return res.status(404).json("Notification not found");
  };

  return res.status(200).json("Notification has been deleted.");

 }catch(error){
       console.error(error);
       return res.status(500).json(error.message || "Internal Server Error");

 }


};