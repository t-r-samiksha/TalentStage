import express from "express";

import {

  startSkillTestController,

  answerSkillQuestionController,

  getSkillTestResultController,

} from "../controllers/skilltest.controller.js";

import {
  authMiddleware,
} from "../middleware/auth.middleware.js";

const router = express.Router();


// START TEST
router.post(
  "/skills/test/start",
  authMiddleware,
  startSkillTestController
);


// ANSWER QUESTION
router.post(
  "/skills/test/answer",
  authMiddleware,
  answerSkillQuestionController
);


// GET RESULT
router.get(
  "/skills/test/result/:id",
  authMiddleware,
  getSkillTestResultController
);

export default router;