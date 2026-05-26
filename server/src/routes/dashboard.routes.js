import express from "express";

import {

  getClientDashboardController,

  getFreelancerDashboardController,

} from "../controllers/dashboard.controller.js";

import {
  authMiddleware,
} from "../middleware/auth.middleware.js";

const router = express.Router();


// CLIENT DASHBOARD
router.get(
  "/client",
  authMiddleware,
  getClientDashboardController
);


// FREELANCER DASHBOARD
router.get(
  "/freelancer",
  authMiddleware,
  getFreelancerDashboardController
);

export default router;