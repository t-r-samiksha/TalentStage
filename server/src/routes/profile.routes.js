import express from "express";

import {
  getMyProfileController,
  updateProfileController,
  updateFreelancerProfileController,
  addSkillController,
} from "../controllers/profile.controller.js";

import { authMiddleware }
from "../middleware/auth.middleware.js";

const router = express.Router();

router.get(
  "/me",
  authMiddleware,
  getMyProfileController
);

router.patch(
  "/me",
  authMiddleware,
  updateProfileController
);

router.patch(
  "/freelancer",
  authMiddleware,
  updateFreelancerProfileController
);

router.post(
  "/skills",
  authMiddleware,
  addSkillController
);

export default router;