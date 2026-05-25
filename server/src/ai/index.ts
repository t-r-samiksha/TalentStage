import { Router } from 'express';
import rateLimit from 'express-rate-limit';

import portfolioRoutes from './routes/portfolioRoutes';
import proposalRoutes from './routes/proposalRoutes';
import matchRoutes from './routes/matchRoutes';
import skillRoutes from './routes/skillRoutes';

const router = Router();

// Rate limiting: max 30 requests per minute per IP
const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  message: { success: false, data: null, message: "Too many requests to AI endpoints, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all /ai routes
router.use('/ai', aiRateLimiter);

// Mount all routes. The internal files define their exact paths (e.g. /ai/review-portfolio, /skills/result)
router.use('/', portfolioRoutes);
router.use('/', proposalRoutes);
router.use('/', matchRoutes);
router.use('/', skillRoutes);

export default router;
