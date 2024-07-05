import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({

    admin:{
     type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    },
  channelname: {
    type: String,
    trim: true,
    required: true,
  },
  channelPic: {
    type: String,
  },
  coverPic: {
    type: String,
  },
  isHashtag: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },

  // Add other fields as needed
});

const Channel = mongoose.model("Channel", channelSchema);

export default Channel;