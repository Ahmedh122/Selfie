import express from "express";
import {getNotes, addNote, deleteNote ,updateNote , duplicateNote} from "../controllers/note.js";

const router = express.Router();

router.get("/getNotes",getNotes);
router.post("/addNote",addNote);
router.delete("/deleteNote/:id", deleteNote);
router.put("/updateNote/:id", updateNote); // anche per la position
router.post("/duplicateNote/:id",duplicateNote);


export default router;
