import {

  inviteFreelancerService,

  getMyInvitationsService,

  respondInvitationService,

} from "../services/invitation/invitation.service.js";

import {

  successResponse,

  errorResponse,

} from "../utils/apiResponse.js";


// INVITE FREELANCER
export const inviteFreelancerController =
async (req, res) => {

  try {

    const invitation =
      await inviteFreelancerService({

        projectId:
          req.body.projectId,

        clientId:
          req.user.userId,

        freelancerId:
          req.body.freelancerId,

      });

    return successResponse(
      res,
      invitation,
      "Invitation sent",
      201
    );

  } catch (error) {

    return errorResponse(
      res,
      error.message,
      400
    );

  }

};


// GET MY INVITATIONS
export const getMyInvitationsController =
async (req, res) => {

  try {

    const invitations =
      await getMyInvitationsService(
        req.user.userId
      );

    return successResponse(
      res,
      invitations,
      "Invitations fetched"
    );

  } catch (error) {

    return errorResponse(
      res,
      error.message,
      400
    );

  }

};


// ACCEPT / REJECT INVITATION
export const respondInvitationController =
async (req, res) => {

  try {

    const invitation =
      await respondInvitationService({

        invitationId:
          req.params.id,

        userId:
          req.user.userId,

        status:
          req.body.status,

      });

    return successResponse(
      res,
      invitation,
      "Invitation updated"
    );

  } catch (error) {

    return errorResponse(
      res,
      error.message,
      400
    );

  }

};