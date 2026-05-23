import express from "express";

import {
  createProjectController,
  getAllProjectsController,
  getProjectByIdController,
} from "../controllers/project.controller.js";

import { authMiddleware }
from "../middleware/auth.middleware.js";

import { validate }
from "../middleware/validate.middleware.js";

import { createProjectSchema }
from "../validators/project.validator.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  createProjectController
);

router.get(
  "/",
  getAllProjectsController
);

router.get(
  "/:id",
  getProjectByIdController
);

router.post(
  "/",
  authMiddleware,
  validate(createProjectSchema),
  createProjectController
);

export default router;