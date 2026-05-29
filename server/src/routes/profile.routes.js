import express from "express";

import {
  getMyProfileController,
  updateProfileController,
  updateFreelancerProfileController,
  addSkillController,
  getClientProfileController,
  getFreelancerProfileController,
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

router.get(
  "/client/:id",
  authMiddleware,
  getClientProfileController
);

router.get(
  "/freelancer/:id",
  authMiddleware,
  getFreelancerProfileController
);

export default router;