import express from "express";
import { getEvents, deleteEvent, getPublicPosts, addEvent, getAllEvents,getEventfromId } from "../controllers/event.js";

const router = express.Router();

router.get("/getEvents", getEvents);
router.get("/getEventfromId/:id", getEventfromId);
router.post("/", addEvent);
router.delete("/:id", deleteEvent);
router.get("/getPublicPosts",getPublicPosts);
router.get("/getAllEvents", getAllEvents);

export default router;
