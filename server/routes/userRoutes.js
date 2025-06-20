import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  markBookAsRead
} from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.post("/read/:bookId", protect, markBookAsRead);

export default router;
