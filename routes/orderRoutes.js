import express from "express";
import {
  addOrderItems,
  deleteOrder,
  getAllOrders,
  getMyOrders,
  getOrderById,
  updateOrderStage,
  updateOrderToDelivered,
  updateOrderToPaid,
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
const router = express.Router();

router
  .route("/")
  .post(protect, addOrderItems)
  .get(protect, admin, getAllOrders);
router.route("/myorders").get(protect, getMyOrders);
router.route("/:id").get(protect, getOrderById);

router.route("/:id").delete(protect, admin, deleteOrder);
router.route("/:id/pay").put(protect, updateOrderToPaid);
router.route("/:id/delivered").put(protect, admin, updateOrderToDelivered);
router.route("/:id/Stage").put(protect, admin, updateOrderStage);

export default router;
