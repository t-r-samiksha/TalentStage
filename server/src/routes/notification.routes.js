import express from "express";

import {
  getMyNotificationsController,
  markNotificationReadController,
  markAllNotificationsReadController,
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
  "/read-all",
  authMiddleware,
  markAllNotificationsReadController
);

router.patch(
  "/:id/read",
  authMiddleware,
  markNotificationReadController
);

export default router;