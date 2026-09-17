import express from "express";
import { getUsers, createUser, deleteUser, updateUser } from "../controllers/userController.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// ১. ডাটা দেখার জন্য টোকেন দিয়ে লগইন থাকতে হবে
router.get("/", authMiddleware, getUsers);

// ২. ক্রিয়েট করার রুট (Multer Error Wrapper সহ, যাতে ফাইল না পাঠালেও রিকোয়েস্ট না আটকে)
router.post(
  "/", 
  authMiddleware, 
  adminMiddleware, 
  (req, res, next) => {
    upload.single('avatar')(req, res, (err) => {
      if (err) {
        return res.status(400).json({ message: err.message || "File upload error" });
      }
      next();
    });
  }, 
  createUser
);

// ৩. আপডেট করার রুট
router.put(
  "/:id", 
  authMiddleware, 
  adminMiddleware, 
  (req, res, next) => {
    upload.single('avatar')(req, res, (err) => {
      if (err) {
        return res.status(400).json({ message: err.message || "File upload error" });
      }
      next();
    });
  }, 
  updateUser
);

// ৪. ইউজার ডিলেট (Admin Only)
router.delete("/:id", authMiddleware, adminMiddleware, deleteUser);

export default router;