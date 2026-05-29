import { z } from "zod";

export const createProjectSchema = z.object({
  title: z.string().min(3),

  description: z.string().min(10),

  budgetMin: z.number().positive(),

  budgetMax: z.number().positive(),

  skills: z.array(z.string()).optional(),

  deadline: z.string().optional().nullable(),

  billingModel: z.string().optional(),
});