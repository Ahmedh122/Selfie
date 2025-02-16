import jwt from "jsonwebtoken";
import Event from "../models/event.js";
import EventDays from "../models/eventDays.js";
import mongoose from "mongoose";
import Subscription from "../models/friends.js";

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
  const { date, offset } = req.query; // Receive queryDate (ISO) and offset in milliseconds
  const token = req.cookies.accessToken;

  if (!token) return res.status(401).json("Not logged in!");

  try {
    const userInfo = jwt.verify(token, "secretkey");
    const userId = userInfo.id;

    // Parse and reset queryDate to UTC midnight
    const parsedQueryDate = new Date(date);
    parsedQueryDate.setUTCHours(0, 0, 0, 0);

     const numericOffset = parseInt(offset, 10);
     

    const events = await Event.find({
      userId: userId,
      $expr: {
        $and: [
          {
            $lte: [
              {
                $dateFromParts: {
                  year: { $year: { $add: ["$eventStart", numericOffset] } },
                  month: { $month: { $add: ["$eventStart", numericOffset] } },
                  day: { $dayOfMonth: { $add: ["$eventStart", numericOffset] } },
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
                  year: { $year: { $add: ["$eventEnd", numericOffset] } },
                  month: { $month: { $add: ["$eventEnd", numericOffset] } },
                  day: { $dayOfMonth: { $add: ["$eventEnd", numericOffset] } },
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

   

    return res.status(200).json(events);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message || "Internal Server Error");
  }
};







// DA RINOMINARE, PRENDE TUTTI GLI EVENTI CHE CI SONO NEL MESE (PER FARE I NUMERI VERDI)

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
export const getAllEvents = async (req, res) => {
  const { month, year } = req.params;
  const token = req.cookies.accessToken;

  try {
    await delay(100);

    if (!token) {
      return res.status(401).json("Not logged in!");
    }

    const userInfo = jwt.verify(token, "secretkey");
    const userId = userInfo.id;

    const eventDays = await EventDays.findOne({
      userId,
      month: parseInt(month),
      year: parseInt(year),
    }).exec();

    
    if (!eventDays) {
      return res.json([]);
    }

   
    const eventDates = eventDays.days.map((event) => {
      return `${String(event.day).padStart(2, "0")}-${String(month).padStart(
        2,
        "0"
      )}-${String(year)}`;
    });
   
  
    return res.json(eventDates);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message || "Internal Server Error");
  }
};

  export async function addEventDays(userId, eventStart, eventEnd) {
  
    const normalizeDate = (date) => {
      const parsedDate = new Date(date); 
      return new Date(
        parsedDate.getFullYear(),
        parsedDate.getMonth(),
        parsedDate.getDate()
      );
    };

  
    let currentDate = normalizeDate(eventStart);
    const endDate = normalizeDate(eventEnd);

    while (currentDate <= endDate) {
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      const day = currentDate.getDate();

      
      const existingEntry = await EventDays.findOne({
        userId: userId,
        month: currentMonth,
        year: currentYear,
        "days.day": day,
      });

      const eventCount = existingEntry
        ? existingEntry.days.find((d) => d.day === day)?.count || 0
        : 0;

     
      const updateResult = await EventDays.updateOne(
        {
          userId: userId,
          month: currentMonth,
          year: currentYear,
          "days.day": day,
        },
        { $set: { "days.$.count": eventCount + 1 } }
      );

     
      if (updateResult.modifiedCount === 0) {
        await EventDays.updateOne(
          { userId: userId, month: currentMonth, year: currentYear },
          {
            $addToSet: {
              days: { day, count: eventCount + 1 },
            },
          },
          { upsert: true }
        );
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

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
    const eventStart = new Date(req.body.selectedDateEventStart).toISOString();
    const eventEnd = new Date(req.body.selectedDateEventEnd).toISOString();;
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
      let eventDuration =
        (new Date(eventEnd) - new Date(eventStart)) / (1000 * 60 * 60 * 24);

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
          currentEnd.setDate(currentStart.getDate() + eventDuration);

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
              addEventDays(userInfo.id, currentStart, currentEnd);
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
              addEventDays(userInfo.id, currentStart, currentEnd);
            }

        
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
        addEventDays(userInfo.id, currentStart, currentEnd);

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
                addEventDays(userInfo.id, eventDateStart, eventDateEnd);
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
                addEventDays(userInfo.id, currentStart, currentEnd);
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
                addEventDays(userInfo.id, currentStart, currentEnd);
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
      addEventDays(userInfo.id, eventStart, eventEnd);
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
        addEventDays(userInfo.id, currentStart, currentEnd);
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
  const { eventId, offset } = req.params;

  try {
    if (!token) return res.status(401).json("Not logged in!");

    const userInfo = jwt.verify(token, "secretkey");

    const eventToDelete = await Event.findOneAndDelete({
      _id: eventId,
      userId: userInfo.id,
    });

    if (!eventToDelete) {
      return res.status(404).json("Event not found.");
    }

    const { eventStart, eventEnd } = eventToDelete;
    const offsetp= parseInt(offset, 10);
    let currentDate = new Date(eventStart.getTime() + offsetp);
   
    currentDate.setUTCHours(0, 0, 0, 0); 
    
    const endDate = new Date(eventEnd.getTime() + offsetp);
    endDate.setUTCHours(0, 0, 0, 0);

    

 

    do {
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      const day = currentDate.getDate();

      const existingEntry = await EventDays.findOne({
        month: currentMonth,
        year: currentYear,
        userId: userInfo.id,
      });

      if (existingEntry) {
        const dayEntry = existingEntry.days.find((d) => d.day === day);

        if (dayEntry) {
          dayEntry.count -= 1;

          if (dayEntry.count <= 0) {
            existingEntry.days = existingEntry.days.filter(
              (d) => d.day !== day
            );
          }

          await existingEntry.save();

          if (existingEntry.days.length === 0) {
            await EventDays.deleteOne({ _id: existingEntry._id });
          }
        }
      }

      currentDate.setDate(currentDate.getDate() + 1);
    } while (currentDate <= endDate);

    return res.status(200).json("Post has been deleted.");
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message || "Internal Server Error");
  }
};
