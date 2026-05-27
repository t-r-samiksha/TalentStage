import { Router, Request, Response } from 'express';
import { evaluateProposal } from '../proposalEvaluator';
import { z } from 'zod';
import { logger } from '../../utils/logger';

const router = Router();

// Zod Schema validation for proposal evaluation
const ProposalEvaluationSchema = z.object({
  projectDescription: z.string({
    required_error: "Project description is required",
    invalid_type_error: "Project description must be a string"
  }).min(5, "Project description must be at least 5 characters long"),
  
  proposalText: z.string({
    required_error: "Proposal cover letter text is required",
    invalid_type_error: "Proposal cover letter text must be a string"
  }).min(5, "Proposal cover letter text must be at least 5 characters long"),
  
  bidAmount: z.number({
    required_error: "Bid amount is required",
    invalid_type_error: "Bid amount must be a number"
  }).nonnegative("Bid amount must be non-negative"),

  timelineDays: z.number().optional(),
  projectBudgetMin: z.number().optional(),
  projectBudgetMax: z.number().optional()
});

router.post('/evaluate-proposal', async (req: Request, res: Response): Promise<void> => {
  const startTime = Date.now();
  try {
    logger.info("Proposal evaluation request received", { bidAmount: req.body?.bidAmount });

    // Validate body parameters
    const parseResult = ProposalEvaluationSchema.safeParse(req.body);
    if (!parseResult.success) {
      const errorMsg = parseResult.error.errors.map(e => e.message).join(", ");
      logger.warn("Proposal evaluation validation failed", { error: errorMsg });
      res.status(400).json({ success: false, data: null, message: errorMsg });
      return;
    }

    const { 
      projectDescription, 
      proposalText, 
      bidAmount, 
      timelineDays, 
      projectBudgetMin, 
      projectBudgetMax 
    } = parseResult.data;

    const data = await evaluateProposal({
      projectDescription,
      proposalText,
      bidAmount,
      timelineDays,
      projectBudgetMin,
      projectBudgetMax
    });
    
    logger.info("Proposal evaluated successfully", { latencyMs: Date.now() - startTime });
    res.json({ success: true, data, message: "Proposal evaluated successfully" });
  } catch (error) {
    logger.error("Error during proposal evaluation", error, { latencyMs: Date.now() - startTime });
    res.status(500).json({ 
      success: false, 
      data: null, 
      message: error instanceof Error ? error.message : "Internal server error during proposal evaluation" 
    });
  }
});

export default router;
