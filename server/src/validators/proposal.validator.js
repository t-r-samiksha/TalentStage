import { z } from "zod";

export const submitProposalSchema =
z.object({

  projectId: z.string(),

  coverLetter: z.string().min(10),

  bidAmount: z.number().positive(),

  timelineDays: z.number().positive(),

});