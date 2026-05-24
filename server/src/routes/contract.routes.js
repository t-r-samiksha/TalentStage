import express from "express";

import {
  hireFreelancerController,
} from "../controllers/contract.controller.js";

import { authMiddleware }
from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/hire",
  authMiddleware,
  hireFreelancerController
);

export default router;