import express from "express";
import { sendSMS, verifyOtp } from "../controllers/smsController.js";
const router = express.Router();

router.post("/send", sendSMS);
router.post("/verify", verifyOtp);
export default router;
