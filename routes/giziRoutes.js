import express from "express";
import { addRecord, getRecords, updateRecord, getOneRecord, deleteRecord } from "../controllers/giziController.js";
const router = express.Router();

// Routes API
router.post("/add", addRecord);
router.get("/list", getRecords);
router.get("/get/:id", getOneRecord);
router.put("/update/:id", updateRecord);

// 👉 Tambahin ini
router.delete("/delete/:id", deleteRecord);

export default router