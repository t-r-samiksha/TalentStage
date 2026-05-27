import express from "express";

import {
  signupController,
  loginController,
  sendOtpController,
  verifyOtpController,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signupController);
router.post("/login", loginController);
router.post("/send-otp", sendOtpController);
router.post("/verify-otp", verifyOtpController);

export default router;