import prisma from "../../config/db.js";


// START TEST
export const startSkillTestService =
async ({
  userId,
  skillId,
}) => {

  const test =
    await prisma.skillTest.create({

      data: {

        userId,

        skillId,
      },
    });

  // create first EASY question
  await prisma.skillQuestion.create({

    data: {

      skillTestId:
        test.id,

      question:
        "What is JavaScript?",

      answer:
        "programming language",

      difficulty:
        "EASY",
    },
  });

  return test;
};


// SUBMIT ANSWER
export const answerSkillQuestionService =
async ({
  questionId,
  userAnswer,
}) => {

  const question =
    await prisma.skillQuestion.findUnique({

      where: {
        id: questionId,
      },

      include: {
        skillTest: true,
      },
    });

  if (!question) {

    throw new Error(
      "Question not found"
    );

  }

  // evaluate answer
  const isCorrect =
    question.answer
      .toLowerCase()
      .includes(
        userAnswer.toLowerCase()
      );

  // save answer
  await prisma.skillQuestion.update({

    where: {
      id: questionId,
    },

    data: {

      userAnswer,

      isCorrect,
    },
  });

  // scoring
  let nextDifficulty =
    question.skillTest.currentDifficulty;

  let scoreIncrement = 0;

  if (isCorrect) {

    scoreIncrement = 10;

    if (
      nextDifficulty === "EASY"
    ) {

      nextDifficulty =
        "MEDIUM";

    } else if (
      nextDifficulty === "MEDIUM"
    ) {

      nextDifficulty =
        "HARD";

    }

  } else {

    if (
      nextDifficulty === "HARD"
    ) {

      nextDifficulty =
        "MEDIUM";

    } else if (
      nextDifficulty === "MEDIUM"
    ) {

      nextDifficulty =
        "EASY";

    }

  }

  // update test
  const updatedTest =
    await prisma.skillTest.update({

      where: {
        id:
          question.skillTest.id,
      },

      data: {

        currentDifficulty:
          nextDifficulty,

        score: {
          increment:
            scoreIncrement,
        },
      },
    });

  // generate next question
  await prisma.skillQuestion.create({

    data: {

      skillTestId:
        updatedTest.id,

      question:
        `Sample ${nextDifficulty} question`,

      answer:
        "sample answer",

      difficulty:
        nextDifficulty,
    },
  });

  return updatedTest;
};


// GET RESULT
export const getSkillTestResultService =
async (testId) => {

  const test =
    await prisma.skillTest.findUnique({

      where: {
        id: testId,
      },

      include: {
        questions: true,
        skill: true,
      },
    });

  return test;
};