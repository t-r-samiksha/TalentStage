import express from "express";

import {
  sendMessageController,
  getMessagesController,
} from "../controllers/message.controller.js";

import {
  authMiddleware,
} from "../middleware/auth.middleware.js";

import { validate }
from "../middleware/validate.middleware.js";

import {
  sendMessageSchema,
} from "../validators/message.validator.js";

import { upload }
from "../middleware/upload.middleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  upload.single("attachment"),
  validate(sendMessageSchema),
  sendMessageController
);

router.get(
  "/:contractId",
  authMiddleware,
  getMessagesController
);

export default router;