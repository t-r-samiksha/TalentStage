import express from "express";

import {
  getMyNotificationsController,
  markNotificationReadController,
} from "../controllers/notification.controller.js";

import { authMiddleware }
from "../middleware/auth.middleware.js";

const router = express.Router();

router.get(
  "/mine",
  authMiddleware,
  getMyNotificationsController
);

router.patch(
  "/:id/read",
  authMiddleware,
  markNotificationReadController
);

export default router;