import express from "express";
import {
  completeContractController,
  createReviewController
} from "../controllers/review.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.patch("/contracts/:id/complete", authMiddleware, completeContractController);
router.post("/contracts/:id/review", authMiddleware, createReviewController);

export default router;
