import express from "express";
import {getNotes, addNote, deleteNote ,updateNote , duplicateNote} from "../controllers/note.js";

const router = express.Router();

router.get("/getNotes",getNotes);
router.post("/addNote",addNote);
router.delete("/deleteNote", deleteNote);
router.put("/updateNote", updateNote); // anche per la position
router.post("/duplicateNote",duplicateNote);


export default router;
