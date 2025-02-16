import express from "express";
import {

  addFriend,


} from "../controllers/friends.js";

const router = express.Router();



router.post("/:userId", addFriend);


export default router;
