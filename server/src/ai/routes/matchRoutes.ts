import { Router, Request, Response } from 'express';
import { matchFreelancers } from '../matchEngine';

const router = Router();

router.post('/ai/match', async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectDescription, projectSkills, projectBudgetMin, projectBudgetMax, freelancers } = req.body;

    if (!freelancers || !Array.isArray(freelancers)) {
      res.status(400).json({ success: false, data: null, message: "Missing or invalid 'freelancers' field" });
      return;
    }

    const data = await matchFreelancers({
      projectDescription,
      projectSkills,
      projectBudgetMin,
      projectBudgetMax,
      freelancers
    });

    res.json({ success: true, data, message: "Matching completed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: (error as Error).message });
  }
});

export default router;
