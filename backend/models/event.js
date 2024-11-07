import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    //required: true,
  },
  img: {
    type: String,
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

  description:{
    type: String, 
   },


  public: {
    type: Boolean,
    default: false,
  },
});

const Event = mongoose.model("Post", eventSchema);

export default Event;
