import jwt from "jsonwebtoken";
import Note from "../models/note.js";


export const getNotes = async (req, res) => {

  const token = req.cookies.accessToken;
  const userInfo = jwt.verify(token, "secretkey");
  const userId = userInfo.id;
  const category = req.params.category;
  console.log('category: ',category);

  if (category == null || category == "General") {
    try{
      if (!token) return res.status(401).json({ message: "Not logged in" });
  
      const notes = await Note.find({ userId: userId });
      res.status(200).json(notes);
  
    }
    catch (error) {
    res.status(404).json({ message: error.message });
  }
  }
  else {
    try{
      if (!token) return res.status(401).json({ message: "Not logged in" });
  
      const notes = await Note.find({ userId: userId, category: category });
      res.status(200).json(notes);
  
    }
    catch (error) {
    res.status(404).json({ message: error.message });
  }
  }

  
}

export const addNote = async (req, res) => {
 
  const token = req.cookies.accessToken;

  try {
    if (!token) return res.status(401).json("Not logged in!");

    const userInfo = jwt.verify(token, "secretkey");
    const position = req.body.position ? { x: req.body.position.x, y: req.body.position.y } : null;
    const newNote = new Note({
      userId: userInfo.id,
      title: req.body.title,
      content: req.body.content,
      position: position,
      category: req.body.category,
    });

    const savedNote = await newNote.save();

    return res.status(200).json({ message: "Post has been created.", noteId: savedNote._id });

  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message || "Internal Server Error");
  }
};

export const deleteNote = async (req, res) => {

  const token = req.cookies.accessToken;

  try {
    if (!token) return res.status(401).json("Not logged in!");

    const userInfo = jwt.verify(token, "secretkey");

    const deletedNote = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: userInfo.id,
    });

    if (deletedNote) {
      return res.status(200).json("Note has been deleted.");
    } else {
      return res.status(403).json("You can delete only your note.");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message || "Internal Server Error");
  }
};


export const updateNote = async (req, res) => {

  const token = req.cookies.accessToken;

  try {
    if (!token) return res.status(401).json("Not logged in!");

    const note = await Note.findOne({
      _id : req.params.id,
    });

    if (!note) {
      return res.status(404).json({ message: "note not found" });
    }

    const updateFields = {};

    updateFields.lastModifiedDate = Date.now();

    if (req.body.title) {
      updateFields.title = req.body.title;
    }

    if (req.body.content) {
      updateFields.content = req.body.content;
    }

    if (req.body.category) {
      updateFields.category = req.body.category;
    }

    if (req.body.position) {
      updateFields.position = {
        x: req.body.position.x,
        y: req.body.position.y,
      };
    }

    const updatedNote = await Note.findOneAndUpdate(
      { _id: req.params.id },
      { $set: updateFields },
      { new: true }
    );
    console.log("updatedNote");
    console.log(updatedNote);

    return res.status(200).json({
      message: "Note has been updated.",
      noteId: updatedNote._id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message || "Internal Server Error");
  }
};


export const duplicateNote = async (req, res) => {
  const token = req.cookies.accessToken;

  try {
    if (!token) return res.status(401).json("Not logged in!");

    const userInfo = jwt.verify(token, "secretkey");  // non serve perche posso prendere l'id direttamente dalla nota

    const note = await Note.findOne({
      _id: req.params.id,
    });
    if (!note) {
      return res.status(404).json({ message: "note not found" });
    }

    const newNote = new Note({
      userId: userInfo.id,
      title: note.title,
      content: note.content,
      position: note.position,
      category: note.category,
    });

    const savedNote = await newNote.save();

    return res.status(200).json({ message: "Note has been duplicated.", noteId: savedNote._id });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message || "Internal Server Error");
  }
}