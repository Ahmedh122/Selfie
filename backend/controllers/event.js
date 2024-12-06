import jwt from "jsonwebtoken";
import Event from "../models/event.js";
//import Relationship from "../models/relationship.js";
import Subscription from "../models/subscription.js";

export const getEventfromId = async (req, res) => {
  const token = req.cookies.accessToken;
  const id = req.params.id;
  try {
    if (!token) return res.status(401).json("Not logged in!");

    const userInfo = jwt.verify(token, "secretkey");

    const event = await Event.findOne({
      _id: id,
      userId: userInfo.id,
    });

    if (event) {
      return res.status(200).json(event);
    } else {
      return res.status(404).json("Event not found!");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message || "Internal Server Error");
  }
};

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
                  day: { $dayOfMonth: "$eventStart" },
                },
              },
              queryDate,
            ],
          },
          {
            $gte: [
              {
                $dateFromParts: {
                  year: { $year: "$eventEnd" },
                  month: { $month: "$eventEnd" },
                  day: { $dayOfMonth: "$eventEnd" },
                },
              },
              queryDate,
            ],
          },
        ],
      },
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
    const events = await Event.find({ userId: userId });
    const allEventDays = new Set(); // Using a Set to keep dates unique

    events.forEach((event) => {
      const eventDays = getDatesBetween(event.eventStart, event.eventEnd);
      eventDays.forEach((day) => {
        // Push only the date part without time for comparison purposes
        allEventDays.add(day.toISOString().split("T")[0]);
      });
    });
    console.log(Array.from(allEventDays));

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

    const title =
      req.body.title && req.body.title.trim() !== ""
        ? req.body.title
        : "Untitled";

    const frequenza = req.body.frequenza;
    const endFrequenza = req.body.endFrequenza;
    const eventStart = req.body.selectedDateEventStart;
    const eventEnd = req.body.selectedDateEventEnd;
    const events = [];

    const personalizedDays = req.body.personalizedDays || [];
    const personalizedDates = req.body.personalizedDates || false;
    const personalizedDatesArray = req.body.personalizedDatesArray || [];
    const fotm = req.body.fotm || false;
    const eotm = req.body.eotm || false;

    if (frequenza === "Personalize") {
      const endFrequenzaDate = new Date(endFrequenza).setUTCHours(
        23,
        59,
        59,
        999
      );
      let eventDuration = (new Date(eventEnd) - new Date (eventStart)) / (1000 * 60 * 60 * 24);

      if (personalizedDays.length > 0) {
        for (let day of personalizedDays) {
          let currentStart = new Date(eventStart);
          let currentEnd = new Date(eventEnd);

          while (
            currentStart
              .toLocaleDateString("en-US", { weekday: "short" })
              .toLowerCase() !== day
          ) {
            currentStart.setDate(currentStart.getDate() + 1);
          }
          currentEnd.setDate(currentStart.getDate()+ eventDuration);
        
          while (currentStart <= endFrequenzaDate) {
            if (!personalizedDates) {
              events.push(
                new Event({
                  title: title,
                  userId: userInfo.id,  
                  eventStart: new Date(currentStart),
                  eventEnd: new Date(currentEnd),
                  description: req.body.description,
                  type: req.body.eventType,
                  pomodoro: req.body.Pomodoro,
                  pomodoroHours: req.body.PomodoroHours,
                  pomodoroMinutes: req.body.PomodoroMinutes,
                })
              );
            } else if (
              personalizedDatesArray.includes(
                currentStart.toISOString().split("T")[0]
              )
            ) {
              events.push(
                new Event({
                  title: title,
                  userId: userInfo.id,
                  eventStart: new Date(currentStart),
                  eventEnd: new Date(currentEnd),
                  description: req.body.description,
                  type: req.body.eventType,
                  pomodoro: req.body.Pomodoro,
                  pomodoroHours: req.body.PomodoroHours,
                  pomodoroMinutes: req.body.PomodoroMinutes,
                })
              );
            }

            // Increment to the next week
            currentStart.setDate(currentStart.getDate() + 7);
            currentEnd.setDate(currentEnd.getDate() + 7);
          }
        }
      } else if (personalizedDays.length === 0) {
        let currentStart = new Date(eventStart);
        let currentEnd = new Date(eventEnd);

        events.push(
          new Event({
            title: title,
            userId: userInfo.id,
            eventStart: new Date(currentStart),
            eventEnd: new Date(currentEnd),
            description: req.body.description,
            type: req.body.eventType,
            pomodoro: req.body.Pomodoro,
            pomodoroHours: req.body.PomodoroHours,
            pomodoroMinutes: req.body.PomodoroMinutes,
          })
        );

        while (currentStart <= endFrequenzaDate) {
          for (let date of personalizedDatesArray) {
            let eventDateStart = new Date(currentStart);
            let eventDateEnd = new Date(currentEnd);

            eventDateStart.setDate(date);
            eventDateEnd.setDate(date);

            if (eventDateStart.getDate() === date) {
              if (eventDateStart <= endFrequenzaDate) {
                events.push(
                  new Event({
                    title: title,
                    userId: userInfo.id,
                    eventStart: new Date(eventDateStart),
                    eventEnd: new Date(eventDateEnd),
                    description: req.body.description,
                    type: req.body.eventType,
                    pomodoro: req.body.Pomodoro,
                    pomodoroHours: req.body.PomodoroHours,
                    pomodoroMinutes: req.body.PomodoroMinutes,
                  })
                );
              }
            }
          }

          currentStart.setMonth(currentStart.getMonth() + 1);
          currentEnd.setMonth(currentEnd.getMonth() + 1);
        }
      }
      if (fotm || eotm) {
        let currentStart = new Date(eventStart);
        let currentEnd = new Date(eventEnd);

        while (currentStart <= endFrequenzaDate) {
          if (fotm) {
            currentStart.setDate(1);
            currentEnd.setDate(1);

            if (
              currentStart <= endFrequenzaDate &&
              currentStart >= eventStart
            ) {
              if (
                !events.some(
                  (e) =>
                    e.eventStart.toDateString() === currentStart.toDateString()
                )
              ) {
                events.push(
                  new Event({
                    title: title,
                    userId: userInfo.id,
                    eventStart: new Date(currentStart),
                    eventEnd: new Date(currentEnd),
                    description: req.body.description,
                    type: req.body.eventType,
                    pomodoro: req.body.Pomodoro,
                    pomodoroHours: req.body.PomodoroHours,
                    pomodoroMinutes: req.body.PomodoroMinutes,
                  })
                );
              }
            }
          }

          if (eotm) {
            currentStart.setMonth(currentStart.getMonth() + 1);
            currentStart.setDate(0);
            currentEnd.setMonth(currentEnd.getMonth() + 1);
            currentEnd.setDate(0);

            if (currentStart <= endFrequenzaDate && currentEnd >= eventStart) {
              if (
                !events.some(
                  (e) =>
                    e.eventStart.toDateString() === currentStart.toDateString()
                )
              ) {
                events.push(
                  new Event({
                    title: title,
                    userId: userInfo.id,
                    eventStart: new Date(currentStart),
                    eventEnd: new Date(currentEnd),
                    description: req.body.description,
                    type: req.body.eventType,
                    pomodoro: req.body.Pomodoro,
                    pomodoroHours: req.body.PomodoroHours,
                    pomodoroMinutes: req.body.PomodoroMinutes,
                  })
                );
              }
            }
          }

          currentStart.setMonth(currentStart.getMonth() + 1);
          currentEnd.setMonth(currentEnd.getMonth() + 1);
        }
      }
    }

    if (frequenza === "Never") {
      events.push(
        new Event({
          title: title,
          userId: userInfo.id,
          eventStart,
          eventEnd,
          description: req.body.description,
          type: req.body.eventType,
          pomodoro: req.body.Pomodoro,
          pomodoroHours: req.body.PomodoroHours,
          pomodoroMinutes: req.body.PomodoroMinutes,
        })
      );
    } else if (frequenza !== "Personalize") {
      let currentStart = new Date(eventStart);
      let currentEnd = new Date(eventEnd);

      while (
        currentStart <= new Date(endFrequenza).setUTCHours(23, 59, 59, 999)
      ) {
        events.push(
          new Event({
            title: title,
            userId: userInfo.id,
            eventStart: new Date(currentStart),
            eventEnd: new Date(currentEnd),
            description: req.body.description,
            type: req.body.eventType,
            pomodoro: req.body.Pomodoro,
            pomodoroHours: req.body.PomodoroHours,
            pomodoroMinutes: req.body.PomodoroMinutes,
          })
        );
        switch (frequenza) {
          case "Every day":
            currentStart.setDate(currentStart.getDate() + 1);
            currentEnd.setDate(currentEnd.getDate() + 1);
            break;

          case "Every week":
            currentStart.setDate(currentStart.getDate() + 7);
            currentEnd.setDate(currentEnd.getDate() + 7);
            break;

          case "Every month":
            currentStart.setMonth(currentStart.getMonth() + 1);
            currentEnd.setMonth(currentEnd.getMonth() + 1);
            break;

          case "Every Year":
            currentStart.setFullYear(currentStart.getFullYear() + 1);
            currentEnd.setFullYear(currentEnd.getFullYear() + 1);
            break;
          default:
            return res.status(400).json("Invalid frequenza value.");
        }
      }
    }

    const savedEvents = await Event.insertMany(events);

    return res.status(200).json({
      message: `${savedEvents.length} event(s) created successfully.`,
      eventIds: savedEvents.map((event) => event._id),
    });
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
    const posts = await Post.find({ public: true })
      .sort({ createdAt: -1 })
      .populate({
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
