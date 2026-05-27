import { Router, Request, Response } from 'express';
import { generateQuestion, processAnswer, getSkillResult, Difficulty } from '../skillFSM';

const router = Router();

router.post('/ai/generate-question', async (req: Request, res: Response): Promise<void> => {
  try {
    const { skill, difficulty, previousQuestions } = req.body;

    if (!skill || !difficulty) {
      res.status(400).json({ success: false, data: null, message: "Missing required fields" });
      return;
    }

    const data = await generateQuestion(skill, difficulty as Difficulty, previousQuestions || []);
    res.json({ success: true, data, message: "Question generated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: (error as Error).message });
  }
});

router.post('/ai/submit-answer', (req: Request, res: Response): void => {
  try {
    const { skill, difficulty, isCorrect, currentScore, questionsAnswered } = req.body;

    if (difficulty === undefined || isCorrect === undefined) {
      res.status(400).json({ success: false, data: null, message: "Missing required fields" });
      return;
    }

    const data = processAnswer({ 
      skill, 
      difficulty: difficulty as Difficulty, 
      isCorrect, 
      currentScore: currentScore || 0, 
      questionsAnswered: questionsAnswered || 0 
    });
    res.json({ success: true, data, message: "Answer processed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: (error as Error).message });
  }
});

router.get('/skills/result', (req: Request, res: Response): void => {
  try {
    const skill = req.query.skill as string;
    const score = parseInt(req.query.score as string, 10);
    const questionsAnswered = parseInt(req.query.questionsAnswered as string, 10);

    if (!skill || isNaN(score) || isNaN(questionsAnswered)) {
      res.status(400).json({ success: false, data: null, message: "Invalid query parameters" });
      return;
    }

    const data = getSkillResult(skill, score, questionsAnswered);
    res.json({ success: true, data, message: "Skill results calculated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: (error as Error).message });
  }
});

export default router;
