import { Router, Request, Response } from 'express';
import { reviewPortfolio } from '../portfolioReviewer';
import { z } from 'zod';
import { logger } from '../../utils/logger';

const router = Router();

// Zod Schema validation for portfolio review
const PortfolioReviewSchema = z.object({
  text: z.string({
    required_error: "Portfolio text is required",
    invalid_type_error: "Portfolio text must be a string"
  }).min(5, "Portfolio text must be at least 5 characters long")
});

router.post('/review-portfolio', async (req: Request, res: Response): Promise<void> => {
  const startTime = Date.now();
  try {
    logger.info("Portfolio review request received", { body: req.body });

    // Validate body parameters
    const parseResult = PortfolioReviewSchema.safeParse(req.body);
    if (!parseResult.success) {
      const errorMsg = parseResult.error.errors.map(e => e.message).join(", ");
      logger.warn("Portfolio review validation failed", { error: errorMsg });
      res.status(400).json({ success: false, data: null, message: errorMsg });
      return;
    }

    const { text } = parseResult.data;
    const data = await reviewPortfolio(text);

    logger.info("Portfolio reviewed successfully", { latencyMs: Date.now() - startTime });
    res.json({ success: true, data, message: "Portfolio reviewed successfully" });
  } catch (error) {
    logger.error("Error during portfolio review", error, { latencyMs: Date.now() - startTime });
    res.status(500).json({ 
      success: false, 
      data: null, 
      message: error instanceof Error ? error.message : "Internal server error during portfolio review" 
    });
  }
});

export default router;
