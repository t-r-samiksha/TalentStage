import { Router, Request, Response } from 'express';
import { evaluateProposal } from '../proposalEvaluator';

const router = Router();

router.post('/ai/evaluate-proposal', async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectDescription, proposalText, bidAmount, timelineDays, projectBudgetMin, projectBudgetMax } = req.body;
    
    if (!projectDescription || !proposalText || bidAmount === undefined) {
       res.status(400).json({ success: false, data: null, message: "Missing required fields" });
       return;
    }

    const data = await evaluateProposal({
      projectDescription,
      proposalText,
      bidAmount,
      timelineDays,
      projectBudgetMin,
      projectBudgetMax
    });
    
    res.json({ success: true, data, message: "Proposal evaluated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: (error as Error).message });
  }
});

export default router;
