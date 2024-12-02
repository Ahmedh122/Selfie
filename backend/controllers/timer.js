import jwt from "jsonwebtoken";
import Timer from "../models/timer.js";

export const getTimer = async (req, res) => {
  const token = req.cookies.accessToken;
  const userInfo = jwt.verify(token, "secretkey");
  const userId = userInfo.id;
  console.log('GET TIMER ::',req.params.id);
  if (req.params.id != 0) {
    try {
      if (!token) return res.status(401).json({ message: "Not logged in" });

      const timer = await Timer.findOne({ _id: req.params.id, userId: userId });
      res.status(200).json(timer);

    }
    catch (error) {
      res.status(404).json({ message: error.message });
    }
    
  }
  else{
    try {
      if (!token) return res.status(401).json({ message: "Not logged in" });

      const timers = await Timer.find({ userId: userId });
      res.status(200).json(timers);

    }
    catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
};

export const addTimer = async (req, res) => {
  const token = req.cookies.accessToken;
  try {
    if (!token) return res.status(401).json("Not logged in!");
    const userInfo = jwt.verify(token, "secretkey");

    const newTimer = new Timer({
      userId: userInfo.id,
      donepomo: req.body.donepomo,
      remainingTime: req.body.remainingTime,
      mode: req.body.mode,
      workTime: req.body.workTime,
      shortBreakTime: req.body.shortBreakTime,
      longBreakTime: req.body.longBreakTime,
      longBreakInterval: req.body.longBreakInterval,
      taskname: req.body.taskname,
      eventId: req.body.eventId
    });

    const savedTimer = await newTimer.save();

    return res.status(200).json({ message: "Timer has been created.", timerId: savedTimer._id });

  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message || "Internal Server Error");
  }
};

export const updateTimer = async (req, res) => {
  const token = req.cookies.accessToken;
  try {
    if (!token) return res.status(401).json("Not logged in!");

    //const userInfo = jwt.verify(token, "secretkey");

    const timer = await Timer.findOne({
      _id: req.params.id,
    });

    if (!timer) {
      return res.status(404).json("Timer not found");
    }
    else {
      const updateFields = {};
      if (req.body.donepomo) updateFields.donepomo = req.body.donepomo;
      if (req.body.remainingTime) updateFields.remainingTime = req.body.remainingTime;
      if (req.body.mode) updateFields.mode = req.body.mode;
      if (req.body.workTime) updateFields.workTime = req.body.workTime;
      if (req.body.shortBreakTime) updateFields.shortBreakTime = req.body.shortBreakTime;
      if (req.body.longBreakTime) updateFields.longBreakTime = req.body.longBreakTime;
      if (req.body.longBreakInterval) updateFields.longBreakInterval = req.body.longBreakInterval;
      if (req.body.taskname) updateFields.taskname = req.body.taskname;
      if (req.body.eventId) updateFields.eventId = req.body.eventId;

      const updatedTimer = await Timer.findOneAndUpdate(
        { _id: req.params.id },
        { $set: updateFields },
        { new: true }
      );
      return res.status(200).json({
        message: "Timer has been updated.",
        timerId: updatedTimer._id,
      });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message || "Internal Server Error");
  }
};

export const deleteTimer = async (req, res) => {
  const token = req.cookies.accessToken;

  const regex = /\d/; // se ce un numero allora è un id altrimenti e un nome
  let isid = false;
  if (regex.test(req.params.id)) {
    isid = true;
  }

  try {
    if (!token) return res.status(401).json("Not logged in!");

    const userInfo = jwt.verify(token, "secretkey");

    const deletedTimer = isid ? await Timer.findOneAndDelete({  // se è un id allora elimina per eventid altrimenti per tasknema
      eventId: req.params.id,
      userId: userInfo.id,
    }) : await Timer.findOneAndDelete({
      taskname: req.params.id,
      userId: userInfo.id,
    });


    if (deletedTimer) {
      return res.status(200).json("Timer has been deleted.");
    } else {
      return res.status(403).json("You can delete only your Timer.");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message || "Internal Server Error");
  }
};
