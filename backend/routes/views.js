import express from "express";
import { addView } from "../controllers/views.js";



const router = express.Router();


router.post("/", addView);

export default router;