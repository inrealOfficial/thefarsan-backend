import express from "express";
import { sendAnCustomEmail } from "../controllers/sendAnEmailController.js";

import { admin, protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.route("/").get(protect, admin, sendAnCustomEmail);

export default router;
