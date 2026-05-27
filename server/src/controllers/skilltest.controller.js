import {
  startSkillTestService,
  answerSkillQuestionService,
  getSkillTestResultService,
} from "../services/skilltest/skilltest.service.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";
import { z } from "zod";
import { logger } from "../utils/logger.js";

// Zod schemas for skill verification endpoints
const StartSkillTestSchema = z.object({
  skillName: z.string({
    required_error: "Skill name is required",
    invalid_type_error: "Skill name must be a string",
  }),
});

const AnswerSkillQuestionSchema = z.object({
  questionId: z.string({
    required_error: "Question ID is required",
    invalid_type_error: "Question ID must be a string",
  }).uuid("Question ID must be a valid UUID"),
  userAnswer: z.string({
    required_error: "User answer text is required",
    invalid_type_error: "User answer must be a string",
  }),
});

const GetSkillTestResultSchema = z.object({
  id: z.string().uuid("Test ID parameter must be a valid UUID"),
});

// START TEST
export const startSkillTestController = async (req, res) => {
  const startTime = Date.now();
  try {
    logger.info("startSkillTestController request received", { userId: req.user?.userId, body: req.body });

    // Validate body
    const parseResult = StartSkillTestSchema.safeParse(req.body);
    if (!parseResult.success) {
      const errorMsg = parseResult.error.errors.map((e) => e.message).join(", ");
      logger.warn("Start skill test validation failed", { error: errorMsg });
      return errorResponse(res, errorMsg, 400);
    }

    const test = await startSkillTestService({
      userId: req.user.userId,
      skillName: parseResult.data.skillName,
    });

    logger.info("Skill test started successfully", { testId: test.id, latencyMs: Date.now() - startTime });
    return successResponse(res, test, "Skill test started");
  } catch (error) {
    logger.error("Error starting skill test", error, { latencyMs: Date.now() - startTime });
    return errorResponse(res, error.message, 400);
  }
};

// ANSWER QUESTION
export const answerSkillQuestionController = async (req, res) => {
  const startTime = Date.now();
  try {
    logger.info("answerSkillQuestionController request received", { body: req.body });

    // Handle both property names for max frontend resilience (userAnswer or answer)
    const payload = {
      questionId: req.body.questionId,
      userAnswer: req.body.userAnswer !== undefined ? req.body.userAnswer : req.body.answer,
    };

    // Validate request
    const parseResult = AnswerSkillQuestionSchema.safeParse(payload);
    if (!parseResult.success) {
      const errorMsg = parseResult.error.errors.map((e) => e.message).join(", ");
      logger.warn("Answer question validation failed", { error: errorMsg });
      return errorResponse(res, errorMsg, 400);
    }

    const result = await answerSkillQuestionService({
      questionId: parseResult.data.questionId,
      userAnswer: parseResult.data.userAnswer,
    });

    logger.info("Answer question processed successfully", { latencyMs: Date.now() - startTime });
    return successResponse(res, result, "Answer submitted");
  } catch (error) {
    logger.error("Error answering skill question", error, { latencyMs: Date.now() - startTime });
    return errorResponse(res, error.message, 400);
  }
};

// GET RESULT
export const getSkillTestResultController = async (req, res) => {
  const startTime = Date.now();
  try {
    logger.info("getSkillTestResultController request received", { params: req.params });

    // Validate path param
    const parseResult = GetSkillTestResultSchema.safeParse(req.params);
    if (!parseResult.success) {
      const errorMsg = parseResult.error.errors.map((e) => e.message).join(", ");
      logger.warn("Get skill test result param validation failed", { error: errorMsg });
      return errorResponse(res, errorMsg, 400);
    }

    const result = await getSkillTestResultService(parseResult.data.id);

    logger.info("Skill test result fetched successfully", { testId: parseResult.data.id, latencyMs: Date.now() - startTime });
    return successResponse(res, result, "Skill test result fetched");
  } catch (error) {
    logger.error("Error fetching skill test result", error, { latencyMs: Date.now() - startTime });
    return errorResponse(res, error.message, 400);
  }
};