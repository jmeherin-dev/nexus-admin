import express from "express";
import { loginUser, verifyOTP } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/verify-otp", verifyOTP);

export default router;