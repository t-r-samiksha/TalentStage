import express from "express";
import {
  saveFreelancerController,
  removeSavedFreelancerController,
  getSavedFreelancersController
} from "../controllers/saved.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, saveFreelancerController);
router.get("/", authMiddleware, getSavedFreelancersController);
router.delete("/:id", authMiddleware, removeSavedFreelancerController);

export default router;
