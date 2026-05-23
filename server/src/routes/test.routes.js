import express from "express";

import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get(
  "/protected",
  authMiddleware,
  (req, res) => {

    return res.json({
      success: true,
      message: "Protected route accessed",
      user: req.user,
    });

  }
);

export default router;