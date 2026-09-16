import express from "express";
import { getUsers, createUser, deleteUser, updateUser } from "../controllers/userController.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js"; // 👈 ফাইল আপলোড মিডলওয়্যার ইমপোর্ট

const router = express.Router();

// ১. ডাটা দেখার জন্য টোকেন দিয়ে লগইন থাকতে হবে
router.get("/", authMiddleware, getUsers);

// ২. ক্রিয়েট করার সময় avatar ফিল্ড দিয়ে ছবি আপলোড করা যাবে (Admin Only)
router.post("/", authMiddleware, adminMiddleware, upload.single('avatar'), createUser);

// ৩. আপডেট করার সময়ও নতুন ছবি আপলোড করা যাবে (Admin Only)
router.put("/:id", authMiddleware, adminMiddleware, upload.single('avatar'), updateUser);

// ৪. ইউজার ডিলেট (Admin Only)
router.delete("/:id", authMiddleware, adminMiddleware, deleteUser);

export default router;