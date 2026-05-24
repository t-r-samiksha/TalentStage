import express from "express";

import {
  hireFreelancerController,
  getMyContractsController,
getContractByIdController,
} from "../controllers/contract.controller.js";

import { authMiddleware }
from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/hire",
  authMiddleware,
  hireFreelancerController
);

router.get(
  "/my",
  authMiddleware,
  getMyContractsController
);

router.get(
  "/:id",
  authMiddleware,
  getContractByIdController
);

export default router;