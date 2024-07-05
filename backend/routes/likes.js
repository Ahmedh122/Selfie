import express from "express";
import {getLikes, addLike, deleteLike,getDislikes, addDislike, deleteDislike} from "../controllers/like.js";

const router = express.Router();

router.get("/getLike",getLikes);
router.post("/addLike",addLike);
router.delete("/deleteLike", deleteLike);

router.get("/getDislike", getDislikes);
router.post("/addDislike", addDislike);
router.delete("/deleteDislike", deleteDislike);

export default router;
