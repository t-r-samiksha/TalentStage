import express from "express";

import {
  getWalletController,
} from "../controllers/ledger.controller.js";

import {
  authMiddleware,
} from "../middleware/auth.middleware.js";

const router = express.Router();


router.get(
  "/wallet",
  authMiddleware,
  getWalletController
);

export default router;