import express from "express";

import {
  submitProposalController,
  getMyProposalsController,
} from "../controllers/proposal.controller.js";

import { validate }
from "../middleware/validate.middleware.js";

import { submitProposalSchema }
from "../validators/proposal.validator.js";

import { authMiddleware }
from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  submitProposalController
);

router.get(
  "/mine",
  authMiddleware,
  getMyProposalsController
);

router.post(
  "/",
  authMiddleware,
  validate(submitProposalSchema),
  submitProposalController
);

export default router;