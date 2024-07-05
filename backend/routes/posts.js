import express from "express";
import { getPosts, addPost, deletePost, getPublicPosts } from "../controllers/post.js";

const router = express.Router();

router.get("/getPosts", getPosts);
router.post("/", addPost);
router.delete("/:id", deletePost);
router.get("/getPublicPosts",getPublicPosts)

export default router;
