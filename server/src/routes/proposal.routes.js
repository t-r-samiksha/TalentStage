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

import { authorizeRoles }
from "../middleware/role.middleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  authorizeRoles("FREELANCER"),
  validate(submitProposalSchema),
  submitProposalController
);

router.get(
  "/mine",
  authMiddleware,
  authorizeRoles("FREELANCER"),
  getMyProposalsController
);

export default router;