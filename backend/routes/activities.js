import express from "express";
import { createActivity , getActivities,getSubActivities, updateParticipantStatus} from "../controllers/activity.js";

const router = express.Router();

router.post("/", createActivity);
router.get("/getActivities", getActivities);
router.get("/getSubActivities", getSubActivities);
router.put(
  "/:activityId/subactivities/:subActivityId/participants/:userId/",
  updateParticipantStatus
);

export default router;