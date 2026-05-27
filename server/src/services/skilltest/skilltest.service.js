import prisma from "../../config/db.js";
import { generateQuestion, processAnswer, getSkillResult } from "../../ai/skillFSM.ts";
import { logger } from "../../utils/logger.js";

// Helper to parse question JSON safely
function parseQuestionContent(questionField) {
  try {
    return JSON.parse(questionField);
  } catch (e) {
    return { text: questionField, options: [], explanation: "" };
  }
}

// START TEST
export const startSkillTestService = async ({ userId, skillName }) => {
  logger.info("Starting skill test service", { userId, skillName });

  const normalizedName = skillName.trim().toLowerCase();

  // 1. Fetch or create skill
  let skill = await prisma.skill.findUnique({
    where: { name: normalizedName },
  });

  if (!skill) {
    skill = await prisma.skill.create({
      data: { name: normalizedName },
    });
  }

  // 2. Create SkillTest record
  const test = await prisma.skillTest.create({
    data: {
      userId,
      skillId: skill.id,
      currentDifficulty: "EASY",
      score: 0,
      completed: false,
    },
  });

  // 3. Generate first EASY question internally using Gemini
  logger.info("Generating first question with Gemini", { skill: skill.name });
  const geminiQuestion = await generateQuestion(skill.name, "easy", []);

  // 4. Save question to database
  const question = await prisma.skillQuestion.create({
    data: {
      skillTestId: test.id,
      question: JSON.stringify({
        text: geminiQuestion.question,
        options: geminiQuestion.options,
        explanation: geminiQuestion.explanation,
      }),
      answer: geminiQuestion.options[geminiQuestion.correctIndex],
      difficulty: "EASY",
    },
  });

  logger.info("First question saved and skill test started successfully", { testId: test.id, questionId: question.id });

  return {
    ...test,
    questions: [
      {
        id: question.id,
        question: geminiQuestion.question,
        options: geminiQuestion.options,
        difficulty: "EASY",
      },
    ],
  };
};

// SUBMIT ANSWER
export const answerSkillQuestionService = async ({ questionId, userAnswer }) => {
  logger.info("Submitting answer to skill question", { questionId, userAnswer });

  // 1. Fetch active question
  const question = await prisma.skillQuestion.findUnique({
    where: { id: questionId },
    include: {
      skillTest: {
        include: {
          skill: true,
          questions: true,
        },
      },
    },
  });

  if (!question) {
    logger.warn("Question not found during answer submittal", { questionId });
    throw new Error("Question not found");
  }

  if (question.userAnswer !== null) {
    logger.warn("Question was already answered", { questionId });
    throw new Error("Question already answered");
  }

  if (question.skillTest.completed) {
    logger.warn("Skill test is already completed", { testId: question.skillTest.id });
    throw new Error("Skill test is already completed");
  }

  // 2. Evaluate answer correctness
  const isCorrect = question.answer.trim().toLowerCase() === userAnswer.trim().toLowerCase();

  // 3. Count total questions answered so far
  const answeredQuestions = question.skillTest.questions.filter((q) => q.userAnswer !== null);
  const questionsAnsweredCount = answeredQuestions.length + 1;

  // 4. Run FSM transition
  const fsmDifficulty = question.difficulty.toLowerCase(); // 'easy' | 'medium' | 'hard'
  logger.info("Running FSM processAnswer transition", {
    skill: question.skillTest.skill.name,
    difficulty: fsmDifficulty,
    isCorrect,
    currentScore: question.skillTest.score,
    questionsAnswered: questionsAnsweredCount,
  });

  const fsmResult = processAnswer({
    skill: question.skillTest.skill.name,
    difficulty: fsmDifficulty,
    isCorrect,
    currentScore: question.skillTest.score,
    questionsAnswered: questionsAnsweredCount,
  });

  // 5. Save the submitted answer to the DB
  await prisma.skillQuestion.update({
    where: { id: questionId },
    data: {
      userAnswer,
      isCorrect,
    },
  });

  // 6. Complete test if limit reached (e.g. 5 questions)
  const TEST_QUESTION_LIMIT = 5;
  let updatedTest;
  let nextQuestionData = null;

  if (questionsAnsweredCount >= TEST_QUESTION_LIMIT) {
    logger.info("Skill test completed limit reached", { testId: question.skillTest.id });

    // Mark test as completed and update final score
    updatedTest = await prisma.skillTest.update({
      where: { id: question.skillTest.id },
      data: {
        score: fsmResult.newScore,
        completed: true,
      },
    });
  } else {
    // Test continues: save score and difficulty and generate next question
    const nextDifficultyDb = fsmResult.nextDifficulty.toUpperCase(); // 'EASY' | 'MEDIUM' | 'HARD'

    updatedTest = await prisma.skillTest.update({
      where: { id: question.skillTest.id },
      data: {
        score: fsmResult.newScore,
        currentDifficulty: nextDifficultyDb,
      },
    });

    // Extract previous questions to avoid duplicates in Gemini prompt
    const previousQuestionTexts = question.skillTest.questions.map((q) => {
      const parsed = parseQuestionContent(q.question);
      return parsed.text || q.question;
    });

    logger.info("Generating next question with Gemini", {
      skill: question.skillTest.skill.name,
      difficulty: fsmResult.nextDifficulty,
    });

    const nextGeminiQuestion = await generateQuestion(
      question.skillTest.skill.name,
      fsmResult.nextDifficulty,
      previousQuestionTexts
    );

    // Save the new question
    const nextQuestion = await prisma.skillQuestion.create({
      data: {
        skillTestId: question.skillTest.id,
        question: JSON.stringify({
          text: nextGeminiQuestion.question,
          options: nextGeminiQuestion.options,
          explanation: nextGeminiQuestion.explanation,
        }),
        answer: nextGeminiQuestion.options[nextGeminiQuestion.correctIndex],
        difficulty: nextDifficultyDb,
      },
    });

    nextQuestionData = {
      id: nextQuestion.id,
      question: nextGeminiQuestion.question,
      options: nextGeminiQuestion.options,
      difficulty: nextDifficultyDb,
    };
  }

  return {
    ...updatedTest,
    recommendation: fsmResult.recommendation,
    nextQuestion: nextQuestionData,
  };
};

// GET RESULT
export const getSkillTestResultService = async (testId) => {
  logger.info("Fetching skill test result", { testId });

  // 1. Fetch completed test details
  const test = await prisma.skillTest.findUnique({
    where: { id: testId },
    include: {
      questions: true,
      skill: true,
    },
  });

  if (!test) {
    logger.warn("Skill test not found", { testId });
    throw new Error("Skill test not found");
  }

  // 2. Call FSM score calculation
  const questionsAnswered = test.questions.filter((q) => q.userAnswer !== null).length;
  const resultData = getSkillResult(test.skill.name, test.score, questionsAnswered);

  // 3. Upsert UserSkill record based on test outcome
  // If user achieves intermediate or above status (>=50% normalized score), verify user skill.
  const isVerified = resultData.normalizedPercent >= 50;
  logger.info("Upserting UserSkill attestation status", {
    userId: test.userId,
    skillId: test.skillId,
    score: resultData.normalizedPercent,
    isVerified,
  });

  await prisma.userSkill.upsert({
    where: {
      userId_skillId: {
        userId: test.userId,
        skillId: test.skillId,
      },
    },
    update: {
      verified: isVerified,
      score: resultData.normalizedPercent,
    },
    create: {
      userId: test.userId,
      skillId: test.skillId,
      verified: isVerified,
      score: resultData.normalizedPercent,
    },
  });

  // 4. Return parsed questions along with result statistics
  const formattedQuestions = test.questions.map((q) => {
    const parsed = parseQuestionContent(q.question);
    return {
      id: q.id,
      question: parsed.text || q.question,
      options: parsed.options || [],
      explanation: parsed.explanation || "",
      userAnswer: q.userAnswer,
      correctAnswer: q.answer,
      isCorrect: q.isCorrect,
      difficulty: q.difficulty,
    };
  });

  return {
    test: {
      id: test.id,
      completed: test.completed,
      score: test.score,
      currentDifficulty: test.currentDifficulty,
      createdAt: test.createdAt,
    },
    result: resultData,
    questions: formattedQuestions,
  };
};