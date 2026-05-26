import {

  startSkillTestService,

  answerSkillQuestionService,

  getSkillTestResultService,

} from "../services/skilltest/skilltest.service.js";

import {

  successResponse,

  errorResponse,

} from "../utils/apiResponse.js";


// START TEST
export const startSkillTestController =
async (req, res) => {

  try {

    const test =
      await startSkillTestService({

        userId:
          req.user.userId,

        skillId:
          req.body.skillId,
      });

    return successResponse(
      res,
      test,
      "Skill test started"
    );

  } catch (error) {

    return errorResponse(
      res,
      error.message,
      400
    );

  }

};


// ANSWER QUESTION
export const answerSkillQuestionController =
async (req, res) => {

  try {

    const result =
      await answerSkillQuestionService({

        questionId:
          req.body.questionId,

        userAnswer:
          req.body.userAnswer,
      });

    return successResponse(
      res,
      result,
      "Answer submitted"
    );

  } catch (error) {

    return errorResponse(
      res,
      error.message,
      400
    );

  }

};


// GET RESULT
export const getSkillTestResultController =
async (req, res) => {

  try {

    const result =
      await getSkillTestResultService(
        req.params.id
      );

    return successResponse(
      res,
      result,
      "Skill test result fetched"
    );

  } catch (error) {

    return errorResponse(
      res,
      error.message,
      400
    );

  }

};