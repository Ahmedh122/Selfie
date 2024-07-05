import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  desc: {
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
  channelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Channel", // Assuming you have a User model
  },
  channelname: {
    type: String,
    ref: "Channel", // Assuming you have a User model
  },
  position: {
    lat : {type: Number},
    lng : {type: Number},
  },

  islive: {
    type: Boolean,
    default: false,
  },

    views: {
    type: Number,
    default: 0,
  },

  viewedUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  Idreciver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },

  controvertial:{
    type: Boolean,
    default: false,
  },

  public: {
    type: Boolean,
    default: false,
  }, 
  
  vid: {
    type: String,
  },


});

const Post = mongoose.model("Post", postSchema);

export default Post;
