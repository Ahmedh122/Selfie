import mongoose from "mongoose";

const EventDaysSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  month: {type: Number},
  year:{type: Number},
  days:{type: Array}
});

const EventDays = mongoose.model("EventDays", EventDaysSchema);

export default EventDays;