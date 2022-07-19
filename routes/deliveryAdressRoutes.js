import express from "express";
import {
  addDeliverAdress,
  deleteAdress,
  getMyAdresses,
  updateAdress,
} from "../controllers/deliveryController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.route("/").post(protect, addDeliverAdress);
router.route("/myadresses").get(protect, getMyAdresses);
router.route("/:id").delete(protect, deleteAdress).put(protect, updateAdress);
export default router;
