import { Router, Request, Response } from 'express';
import { matchFreelancers } from '../matchEngine';
import { z } from 'zod';
import { logger } from '../../utils/logger';

const router = Router();

// Zod Schema validation for matchmaking
const MatchSchema = z.object({
  projectDescription: z.string().optional(),
  projectSkills: z.array(z.string()).optional(),
  projectBudgetMin: z.number().optional(),
  projectBudgetMax: z.number().optional(),
  freelancers: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      bio: z.string().optional().default(""),
      skills: z.array(z.string()).optional().default([]),
      hourlyRate: z.number().optional().default(100),
      rating: z.number().optional().default(0),
      portfolioSummary: z.string().optional().default(""),
      verifiedSkills: z.array(z.string()).optional().default([])
    })
  ).nonempty("At least one freelancer is required for matching")
});

router.post('/match', async (req: Request, res: Response): Promise<void> => {
  const startTime = Date.now();
  try {
    logger.info("Match request received", { freelancersCount: req.body?.freelancers?.length });

    // Validate body parameters
    const parseResult = MatchSchema.safeParse(req.body);
    if (!parseResult.success) {
      const errorMsg = parseResult.error.errors.map(e => e.message).join(", ");
      logger.warn("Match validation failed", { error: errorMsg });
      res.status(400).json({ success: false, data: null, message: errorMsg });
      return;
    }

    const { projectDescription, projectSkills, projectBudgetMin, projectBudgetMax, freelancers } = parseResult.data;

    const data = await matchFreelancers({
      projectDescription,
      projectSkills,
      projectBudgetMin,
      projectBudgetMax,
      freelancers
    });

    logger.info("Matching completed successfully", { latencyMs: Date.now() - startTime });
    res.json({ success: true, data, message: "Matching completed successfully" });
  } catch (error) {
    logger.error("Error during match evaluation", error, { latencyMs: Date.now() - startTime });
    res.status(500).json({ 
      success: false, 
      data: null, 
      message: error instanceof Error ? error.message : "Internal server error during matchmaking" 
    });
  }
});

export default router;
