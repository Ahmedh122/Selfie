import express from "express";
import { getPosts, deletePost, getPublicPosts, addEvent } from "../controllers/event.js";

const router = express.Router();

router.get("/getPosts", getPosts);
router.post("/", addEvent);
router.delete("/:id", deletePost);
router.get("/getPublicPosts",getPublicPosts)

export default router;
