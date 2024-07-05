import express from "express";
import { getChannel, addChannel, deleteChannel, getChannellist , modifyChannel } from "../controllers/channel.js";

const router = express.Router();

router.get("/find/:channelname", getChannel);
router.post("/", addChannel);
router.delete("/:id", deleteChannel);
router.get("/", getChannellist);
router.put("/", modifyChannel);

export default router;
