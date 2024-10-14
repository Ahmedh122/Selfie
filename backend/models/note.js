import mongoose from "mongoose";

const noteschema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming you have a User model
    required: true,
  },
  noteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Note", // Assuming you have a Post model
    required: true,
  },
  creationDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  lastModifiedDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  position: {
    type: {
      x: Number,
      y: Number,
    },
    required: true,
  },
  category: {
    type: String,
  },
});

const Note = mongoose.model("Like", noteschema);

export default Note;
