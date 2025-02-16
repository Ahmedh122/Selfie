import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  surname: {
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
  profilePic: {
    type: String,
  },
  coverPic: {
    type: String,
  },

  Birthday :{
    type: Date,
  },

  Bio : {
    type : String, 
  },
});

const User = mongoose.model("User", userSchema);

export default User;
