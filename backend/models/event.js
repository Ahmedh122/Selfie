import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
  
  },
  img: {
    type: String,
  },
  type:{
    type: String, 
    default:"event",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming you have a User model
  },

  eventStart: {
    type: Date,
  },

  eventEnd: {
    type: Date,
  },

  description: {
    type: String,
  },

  public: {
    type: Boolean,
    default: false,
  },

  type :{
    type: String,
  },
  pomodoro :{
    type :Boolean,
  },

  pomodoroHours :{
    type: Number,
  },
  pomodoroMinutes :{
    type: Number, 
  },

  frequenza :{
    type : String,
  },

  endFrequenza :{
    type :Date,
  },
 
  
});

const Event = mongoose.model("Event", eventSchema);

export default Event;
