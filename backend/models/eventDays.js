import mongoose from "mongoose";

const EventDaysSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  month: {type: Number, required: true },
  year:{type: Number, requred: true },
  days:[
    {
      day : {type: Number, required: true },
      count :{type: Number, default: 0 },
    },
  ],
});

const EventDays = mongoose.model("EventDays", EventDaysSchema);

export default EventDays;