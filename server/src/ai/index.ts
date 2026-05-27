import { Router } from 'express';
import rateLimit from 'express-rate-limit';

import portfolioRoutes from './routes/portfolioRoutes';
import proposalRoutes from './routes/proposalRoutes';
import matchRoutes from './routes/matchRoutes';

const router = Router();

// Rate limiting: max 30 requests per minute per IP for AI endpoints
const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  message: { success: false, data: null, message: "Too many requests to AI endpoints, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all mounted AI routes
router.use(aiRateLimiter);

// Mount public AI routes
router.use('/', portfolioRoutes);
router.use('/', proposalRoutes);
router.use('/', matchRoutes);

export default router;
