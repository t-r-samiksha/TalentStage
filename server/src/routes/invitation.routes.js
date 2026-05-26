import express from "express";

import {

  inviteFreelancerController,

  getMyInvitationsController,

  respondInvitationController,

} from "../controllers/invitation.controller.js";

import {
  authMiddleware,
} from "../middleware/auth.middleware.js";

import { validate }
from "../middleware/validate.middleware.js";

import {

  inviteFreelancerSchema,

  respondInvitationSchema,

} from "../validators/invitation.validator.js";

const router = express.Router();


// SEND INVITATION
router.post(
  "/",
  authMiddleware,
  validate(
    inviteFreelancerSchema
  ),
  inviteFreelancerController
);


// GET MY INVITATIONS
router.get(
  "/",
  authMiddleware,
  getMyInvitationsController
);


// ACCEPT / REJECT INVITATION
router.patch(
  "/:id/respond",
  authMiddleware,
  validate(
    respondInvitationSchema
  ),
  respondInvitationController
);

export default router;