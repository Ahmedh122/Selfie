import express from "express";
import { getTimer, addTimer, deleteTimer,updateTimer } from "../controllers/timer.js";

const router = express.Router();

router.get("/getTimer", getTimer);
router.post("/addTimer", addTimer);
router.put("/updateTimer/:id", updateTimer); 
router.delete("/deleteTimer", deleteTimer);

export default router;
