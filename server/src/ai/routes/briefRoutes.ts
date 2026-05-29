import { Router, Request, Response } from 'express';
import { buildBriefGenerationPrompt } from '../promptBuilder';
import { callGemini } from '../geminiClient';
import { parseAIJson } from '../zodValidator';
import { z } from 'zod';
import { logger } from '../../utils/logger';

const router = Router();

// Zod Schema validation for brief generation request
const BriefRequestSchema = z.object({
  title: z.string({
    required_error: "Project title is required",
    invalid_type_error: "Project title must be a string"
  }).min(3, "Project title must be at least 3 characters long"),
  skills: z.array(z.string()).optional().default([]),
  budgetMin: z.number().optional().default(0),
  budgetMax: z.number().optional().default(0),
  deadline: z.string().optional().default(''),
  billingModel: z.string().optional().default('fixed')
});

// Zod Schema validation for brief generation response
const BriefResponseSchema = z.object({
  description: z.string(),
  deliverables: z.array(
    z.object({
      text: z.string(),
      weight: z.string()
    })
  ),
  milestones: z.array(
    z.object({
      phase: z.string(),
      days: z.string()
    })
  ),
  timeline: z.string().optional().default(''),
  recommendedSkills: z.array(z.string()),
  risks: z.array(z.string())
});

router.post('/generate-brief', async (req: Request, res: Response): Promise<void> => {
  const startTime = Date.now();
  try {
    logger.info("AI Brief generation request received", { body: req.body });

    // Validate body parameters
    const parseResult = BriefRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      const errorMsg = parseResult.error.errors.map(e => e.message).join(", ");
      logger.warn("Brief generation validation failed", { error: errorMsg });
      res.status(400).json({ success: false, data: null, message: errorMsg });
      return;
    }

    const { title, skills, budgetMin, budgetMax, deadline, billingModel } = parseResult.data;
    const prompt = buildBriefGenerationPrompt({
      title,
      skills,
      budgetMin,
      budgetMax,
      deadline,
      billingModel
    });

    const rawResponse = await callGemini(prompt, "You are an expert technical product manager writing detailed job specifications.");
    const data = parseAIJson(rawResponse, BriefResponseSchema);

    logger.info("AI Brief generated successfully", { latencyMs: Date.now() - startTime });
    res.json({ success: true, data, message: "AI Brief generated successfully" });
  } catch (error) {
    logger.error("Error during brief generation", error, { latencyMs: Date.now() - startTime });
    res.status(500).json({ 
      success: false, 
      data: null, 
      message: error instanceof Error ? error.message : "Internal server error during brief generation" 
    });
  }
});

export default router;
