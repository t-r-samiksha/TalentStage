import express from "express";

import {

  followClientController,

  unfollowClientController,

  getClientFollowersController,

} from "../controllers/follow.controller.js";

import {
  authMiddleware,
} from "../middleware/auth.middleware.js";

const router = express.Router();


// FOLLOW CLIENT
router.post(
  "/clients/:id/follow",
  authMiddleware,
  followClientController
);


// UNFOLLOW CLIENT
router.delete(
  "/clients/:id/follow",
  authMiddleware,
  unfollowClientController
);


// GET FOLLOWERS
router.get(
  "/clients/:id/followers",
  authMiddleware,
  getClientFollowersController
);

export default router;