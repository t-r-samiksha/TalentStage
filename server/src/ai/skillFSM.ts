import { z } from 'zod';
import { callGemini } from './geminiClient';
import { parseAIJson } from './zodValidator';
import { buildQuestionGenerationPrompt } from './promptBuilder';

export type Difficulty = 'easy' | 'medium' | 'hard';

export const QuestionSchema = z.object({
  question: z.string(),
  options: z.array(z.string()).length(4),
  correctIndex: z.number().min(0).max(3),
  explanation: z.string(),
  difficulty: z.enum(['easy', 'medium', 'hard'])
});

export type QuestionResult = z.infer<typeof QuestionSchema>;

export async function generateQuestion(
  skill: string,
  difficulty: Difficulty,
  previousQuestions: string[]
): Promise<QuestionResult> {
  const prompt = buildQuestionGenerationPrompt(skill, difficulty, previousQuestions);
  const rawResponse = await callGemini(prompt, "You are an expert technical interviewer.");
  return parseAIJson(rawResponse, QuestionSchema);
}

export interface FSMState {
  skill: string;
  difficulty: Difficulty;
  isCorrect: boolean;
  currentScore: number;
  questionsAnswered: number;
}

export interface FSMResult {
  nextDifficulty: Difficulty;
  newScore: number;
  recommendation: string;
}

export function processAnswer(state: FSMState): FSMResult {
  let nextDifficulty: Difficulty = 'easy';
  let newScore = state.currentScore;
  let recommendation = "";

  if (state.isCorrect) {
    if (state.difficulty === 'easy') {
      nextDifficulty = 'medium';
      newScore += 1;
      recommendation = "Good job! Moving to medium questions.";
    } else if (state.difficulty === 'medium') {
      nextDifficulty = 'hard';
      newScore += 2;
      recommendation = "Great! Moving to hard questions.";
    } else {
      nextDifficulty = 'hard';
      newScore += 4;
      recommendation = "Excellent! Staying on hard questions.";
    }
  } else {
    if (state.difficulty === 'hard') {
      nextDifficulty = 'medium';
      recommendation = "Not quite. Let's try a medium question.";
    } else if (state.difficulty === 'medium') {
      nextDifficulty = 'easy';
      recommendation = "Incorrect. Moving down to an easy question.";
    } else {
      nextDifficulty = 'easy';
      recommendation = "Incorrect. Let's stick with easy questions to build fundamentals.";
    }
  }

  return { nextDifficulty, newScore, recommendation };
}

export function getSkillResult(skill: string, score: number, questionsAnswered: number) {
  const maxPossible = Math.max(1, questionsAnswered * 4);
  const normalizedPercent = Math.min(100, Math.round((score / maxPossible) * 100));

  let level = "Beginner";
  if (normalizedPercent <= 30) level = "Beginner";
  else if (normalizedPercent <= 60) level = "Intermediate";
  else if (normalizedPercent <= 85) level = "Advanced";
  else level = "Expert";

  return {
    skill,
    score,
    maxPossible,
    normalizedPercent,
    level,
    radarData: {
      label: skill,
      value: normalizedPercent
    }
  };
}
