import express from "express";
import { getQuota, modifyQuota } from "../controllers/quota.js";

const router = express.Router();

router.get("/:userId", getQuota);
router.post("/", modifyQuota);


export default router;
