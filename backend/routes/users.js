import express from "express";
import { getUser,getUsers, updateUser  } from "../controllers/user.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.get("/find/:userId", getUser);
router.get("/find", getUsers);
router.put("/update", upload.single("file"), updateUser); 

export default router;
