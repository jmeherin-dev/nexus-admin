import express from "express";
import { getUsers, createUser, deleteUser, updateUser } from "../controllers/userController.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";

const router = express.Router();

// ১. ডাটা দেখার জন্য শুধু লগইন থাইকা টোকেন থাকলেই হবে
router.get("/", authMiddleware, getUsers);

// ২. ক্রিয়েট, ডিলেট ও আপডেটের জন্য অবশ্যই Admin হতে হবে
router.post("/", authMiddleware, adminMiddleware, createUser);
router.delete("/:id", authMiddleware, adminMiddleware, deleteUser);
router.put("/:id", authMiddleware, adminMiddleware, updateUser);

export default router;