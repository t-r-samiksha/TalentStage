import express from "express";

import {
  createMilestoneController,
  getContractMilestonesController,
  submitMilestoneController,
  approveMilestoneController,
  requestRevisionController,
} from "../controllers/milestone.controller.js";

import { authMiddleware }
from "../middleware/auth.middleware.js";

import upload
from "../middleware/upload.middleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  createMilestoneController
);

router.get(
  "/contract/:contractId",
  authMiddleware,
  getContractMilestonesController
);

router.patch(
  "/:id/submit",
  authMiddleware,
  upload.single("file"),
  submitMilestoneController
);

router.patch(
  "/:id/approve",
  authMiddleware,
  approveMilestoneController
);

router.patch(
  "/:id/revision",
  authMiddleware,
  requestRevisionController
);

export default router;