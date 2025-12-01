import express from "express";
import { addRecord, getRecords } from "../controllers/giziController.js";

const router = express.Router();

router.post("/add", addRecord);
router.get("/list", getRecords);

export default router;
