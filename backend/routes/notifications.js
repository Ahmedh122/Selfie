import express from "express";
import { sendNotif, deleteNotif, getNotif } from "../controllers/notification.js";

const router = express.Router();


router.post("/sendNotif/:userId",sendNotif);
router.delete("/deleteNotif/:id/", deleteNotif);
router.get("/getNotif",getNotif);


export default router;