import express from "express";
import {
  deleteProduct,
  getCourseById,
  getCourses,
} from "../controllers/courseController.js";
import { admin, protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.route("/").get(getCourses);
router.route("/:id").get(getCourseById).delete(protect, admin, deleteProduct);

export default router;
