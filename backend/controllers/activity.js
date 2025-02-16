import Notifications from "../models/notifications.js";
import Activity from "../models/activity.js";
import SubActivity from "../models/subactivity.js";
import User from "../models/users.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { addEventDays } from "../controllers/event.js";

export const createActivity = async (req, res) => {
  const token = req.cookies.accessToken;
  const userInfo = jwt.verify(token, "secretkey");

  try {
    const { title, startDate, endDate, participants, subActivities } = req.body;

    const validParticipants = await User.find({ _id: { $in: participants } });
    if (validParticipants.length !== participants.length) {
      return res.status(400).json({ error: "Some participants are invalid" });
    }

    const validatedSubActivities = await Promise.all(
      subActivities.map(async (sub) => {
        const validSubParticipants = await User.find({
          _id: { $in: sub.participants },
        });
        if (validSubParticipants.length !== sub.participants.length) {
          throw new Error("Invalid participants in a subactivity");
        }

        const newSubActivity = new SubActivity({
          title: sub.title,
          startDate: startDate,
          endDate: sub.endDate,
          participants: sub.participants.map((userId) => ({
            userId,
            status: "pending",
          })),
        });

        await newSubActivity.save();

        return newSubActivity;
      })
    );

    const activity = new Activity({
      userId: userInfo.id,
      title: title,
      startDate: startDate,
      endDate: endDate,
      participants: participants.map((userId) => ({
        userId,
        status: "pending",
      })),
      subActivities: validatedSubActivities.map((sub) => sub._id),
    });

    await activity.save();
    addEventDays(userInfo.id, startDate, endDate);

    const notifications = [];
    const notifiedUsers = new Set();

    participants.forEach((userId) => {
      notifications.push({
        userId: userId.userId,
        type: "activity_invit",
        sender: userInfo.id,
        additionalData: {
          title,
          activityId: activity._id,
        },
      });
      notifiedUsers.add(userId);
    });

    validatedSubActivities.forEach((sub) => {
      sub.participants.forEach((userId) => {
        if (!notifiedUsers.has(userId)) {
          notifications.push({
            userId: userId.userId,
            type: "subactivity_invit",
            sender: userInfo.id,
            additionalData: {
              title: sub.title,
              subactivityId: sub._id, // Pass subactivity ID
              activityId: activity._id, // Pass the main activity ID
              subactivityOf: title,
            },
          });
          notifiedUsers.add(userId.userId);
        }
      });
    });

    await Notifications.insertMany(notifications);

    const io = req.app.get("socketio");

    notifiedUsers.forEach((userId) => {
      io.to(userId.toString()).emit("notification", {
        message: "New notification!",
      });
      console.log("fvsefsefsef", userId.toString());
    });

    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateParticipantStatus = async (req, res) => {
  const { activityId, subActivityId, userId } = req.params; // Get activityId, subActivityId, and userId from params
  const { status } = req.body; // The status to update to (e.g., "accepted" or "rejected")
  const token = req.cookies.accessToken;
  const userInfo = jwt.verify(token, "secretkey");

  if (!status || !["accepted", "rejected"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  const io = req.app.get("socketio");

  try {
    const io = req.app.get("socketio");

    const activity = await Activity.findById(activityId).populate(
      "subActivities"
    );

    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    const mainParticipantIndex = activity.participants.findIndex(
      (participant) => participant.userId.toString() === userId
    );

    if (mainParticipantIndex !== -1) {
      if (status === "rejected") {
        activity.participants.splice(mainParticipantIndex, 1);
      } else {
        activity.participants[mainParticipantIndex].status = status;
        addEventDays(userId, activity.startDate, activity.endDate);
      }
    }

    const subActivity = activity.subActivities.find(
      (sub) => sub._id.toString() === subActivityId
    );

    if (subActivity) {
      const subParticipantIndex = subActivity.participants.findIndex(
        (participant) => participant.userId.toString() === userId
      );

      if (subParticipantIndex !== -1) {
        if (status === "rejected") {
          subActivity.participants.splice(subParticipantIndex, 1);
        } else {
          subActivity.participants[subParticipantIndex].status = status;
          addEventDays(userId, subActivity.startDate, subActivity.endDate);
          io.to(userId).emit("eventDays");
        }
        await subActivity.save();

        const notification = await Notifications.findOneAndDelete({
          "additionalData.subactivityId": new mongoose.Types.ObjectId(
            subActivityId
          ),
          "additionalData.activityId": new mongoose.Types.ObjectId(activityId),
          userId: userInfo.id,
        });

        if (status === "accepted") {
          const newNotif = new Notifications({
            userId: notification.sender,
            type: "acc_subactivity_invit",
            sender: userInfo.id,
            additionalData: {
              title: notification.additionalData.title,
              subactivityOf: notification.additionalData.subactivityOf,
            },
          });

          await newNotif.save();
        }

        io.to(notification.sender.toString()).emit("notification", {
          message: "New notification!",
        });
      } else {
        return res
          .status(404)
          .json({ error: "Participant not found in subactivity" });
      }
    } else {
      return res.status(404).json({ error: "Subactivity not found" });
    }

    await activity.save();
    if (subActivityId === "") {
      const notification = await Notifications.findOneAndDelete({
        "additionalData.activityId": new mongoose.Types.ObjectId(activityId),
        userId: userInfo.id,
        type: "activity_invit",
      });

      if (status === "accepted") {
        const newNotif = new Notifications({
          userId: notification.sender,
          type: "acc_activity_invit",
          sender: userInfo.id,
          additionalData: {
            title: notification.additionalData.title,
          },
        });

        await newNotif.save();
      }

      io.to(notification.sender.toString()).emit("notification", {
        message: "New notification!",
      });
    }

    res.status(200).json({ message: "Status updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getActivities = async (req, res) => {
  const { date, offset } = req.query; // Receive queryDate (ISO) and offset in milliseconds
  const token = req.cookies.accessToken;

  if (!token) return res.status(401).json("Not logged in!");

  try {
    const userInfo = jwt.verify(token, "secretkey");
    const userId = userInfo.id;

    const parsedQueryDate = new Date(date);
    parsedQueryDate.setUTCHours(0, 0, 0, 0);

    const numericOffset = parseInt(offset, 10);

    const activities = await Activity.find({
      $or: [
        { userId: userId },
        {
          participants: {
            $elemMatch: {
              userId: userId,
              status: "accepted",
            },
          },
        },
      ],
      $expr: {
        $and: [
          {
            $lte: [
              {
                $dateFromParts: {
                  year: { $year: { $add: ["$startDate", numericOffset] } },
                  month: { $month: { $add: ["$startDate", numericOffset] } },
                  day: {
                    $dayOfMonth: { $add: ["$startDate", numericOffset] },
                  },
                },
              },
              {
                $dateFromParts: {
                  year: { $year: parsedQueryDate },
                  month: { $month: parsedQueryDate },
                  day: { $dayOfMonth: parsedQueryDate },
                },
              },
            ],
          },
          {
            $gte: [
              {
                $dateFromParts: {
                  year: { $year: { $add: ["$endDate", numericOffset] } },
                  month: { $month: { $add: ["$endDate", numericOffset] } },
                  day: { $dayOfMonth: { $add: ["$endDate", numericOffset] } },
                },
              },
              {
                $dateFromParts: {
                  year: { $year: parsedQueryDate },
                  month: { $month: parsedQueryDate },
                  day: { $dayOfMonth: parsedQueryDate },
                },
              },
            ],
          },
        ],
      },
    })
      .sort({ createdAt: -1 })
      .populate("participants.userId", "name surname profilePic _id")
      .populate(
        "subActivities",
        "title  startDate endDate participants createdAt _id "
      )
      .populate("subActivities.participants.userId" , "name surname profilePic _id");

    return res.status(200).json(activities);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message || "Internal Server Error");
  }
};

export const getSubActivities = async (req, res) => {
  const { date, offset } = req.query; // Receive queryDate (ISO) and offset in milliseconds
  const token = req.cookies.accessToken;

  if (!token) return res.status(401).json("Not logged in!");

  try {
    const userInfo = jwt.verify(token, "secretkey");
    const userId = userInfo.id;

    const parsedQueryDate = new Date(date);
    parsedQueryDate.setUTCHours(0, 0, 0, 0);

    const numericOffset = parseInt(offset, 10);

    const activities = await SubActivity.find({
      participants: {
        $elemMatch: {
          userId: userId,
          status: "accepted",
        },
      },

      $expr: {
        $and: [
          {
            $lte: [
              {
                $dateFromParts: {
                  year: { $year: { $add: ["$startDate", numericOffset] } },
                  month: { $month: { $add: ["$startDate", numericOffset] } },
                  day: {
                    $dayOfMonth: { $add: ["$startDate", numericOffset] },
                  },
                },
              },
              {
                $dateFromParts: {
                  year: { $year: parsedQueryDate },
                  month: { $month: parsedQueryDate },
                  day: { $dayOfMonth: parsedQueryDate },
                },
              },
            ],
          },
          {
            $gte: [
              {
                $dateFromParts: {
                  year: { $year: { $add: ["$endDate", numericOffset] } },
                  month: { $month: { $add: ["$endDate", numericOffset] } },
                  day: { $dayOfMonth: { $add: ["$endDate", numericOffset] } },
                },
              },
              {
                $dateFromParts: {
                  year: { $year: parsedQueryDate },
                  month: { $month: parsedQueryDate },
                  day: { $dayOfMonth: parsedQueryDate },
                },
              },
            ],
          },
        ],
      },
    }).sort({ createdAt: -1 });

    return res.status(200).json(activities);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message || "Internal Server Error");
  }
};
