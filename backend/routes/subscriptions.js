import express from "express";
import {
  getSubscriptions,
  addSubscription,
  deleteSubscription,
  getSubscription,
} from "../controllers/subscription.js";

const router = express.Router();

router.get("/subscriberslist", getSubscriptions);
router.get("/channellist", getSubscription);
router.post("/", addSubscription);
router.delete("/", deleteSubscription);

export default router;
