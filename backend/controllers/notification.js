import jwt from "jsonwebtoken";
import Notifications from "../models/notifications.js";


export const sendNotif = async (req, res) =>{
    const token = req.cookies.accessToken;
    const reciever = req.params.userId;
    const Type= req.body.type
    
    try{
        if (!token) return res.status(401).json({ message: "Not logged in" });
        const userInfo = jwt.verify(token, "secretkey");
        if (!reciever) return res.status(404).json({message: "User Not found"})

        const existingnotif = await Notifications.findOneAndDelete({
          userId: reciever,
          sender: userInfo.id,
          type: Type,
        });
        if (existingnotif) {return res.status(200).json("notification sent");}
        else {
        const notif = new Notifications({
            userId: reciever, 
            sender: userInfo.id,
            type: Type, 

        });

        await notif.save();
        return res.status(200).json("notification sent")};

    }catch(error){
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
          .populate("sender", "name surname profilePic _id");;
        return res.status(200).json(notifications)
     }catch(error){
        console.error(error);
        return res.status(500).json(error.message || "Internal Server Error");

     }

};



export const deleteNotif = async (req, res) => {};