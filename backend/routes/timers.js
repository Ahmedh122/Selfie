import express from "express";
import { getTimer, addTimer, deleteTimer } from "../controllers/timer.js";

const router = express.Router();

router.get("/getTimer", getTimer);
router.post("/addTimer", addTimer); // servira sempre solo un timer per utente
router.put("/addTimer/:id", addTimer); 
router.delete("/deleteTimer", deleteTimer); // 

export default router;


// bisogna mettere a posto la get, quando fai save, fai la get, se non c'è il timer, crei un nuovo timer, se c'è il timer, lo aggiorni