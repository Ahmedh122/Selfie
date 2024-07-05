import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    required: true,
  },
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
  },
  password: {
    type: String,
    length: 60,
    trim: true,
    required: true,
  },
  city: {
    type: String,
  },
  website: {
    type: String,
  },
  profilePic: {
    type: String,
  },
  coverPic: {
    type: String,
  },
  islive: {
    type: Boolean,
    default: false,
  },
  routeCoordinates: {
    type: [[Number]],
  },
  isNormal: {
    type: Boolean,
    default: true,
  },
  isPro: {
    type: Boolean,
    default: false,
  },
  isMod: {
    type: Boolean,
    default: false,
  },
  // Add other fields as needed
});

const User = mongoose.model("User", userSchema);

export default User;
