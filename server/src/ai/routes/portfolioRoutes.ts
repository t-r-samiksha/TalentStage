import { Router, Request, Response } from 'express';
import { reviewPortfolio } from '../portfolioReviewer';

const router = Router();

router.post('/ai/review-portfolio', async (req: Request, res: Response): Promise<void> => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      res.status(400).json({ success: false, data: null, message: "Missing or invalid 'text' field" });
      return;
    }
    const data = await reviewPortfolio(text);
    res.json({ success: true, data, message: "Portfolio reviewed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: (error as Error).message });
  }
});

export default router;
