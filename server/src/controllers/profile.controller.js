import {
  getMyProfileService,
  updateProfileService,
  updateFreelancerProfileService,
  addSkillService,
  getClientProfileService,
  getFreelancerProfileService,
} from "../services/profile/profile.service.js";

import {
  successResponse,
  errorResponse,
} from "../utils/apiResponse.js";

export const getMyProfileController =
async (req, res) => {

  try {

    const profile =
      await getMyProfileService(
        req.user.userId
      );

    return successResponse(
      res,
      profile,
      "Profile fetched"
    );

  } catch (error) {

    return errorResponse(
      res,
      error.message,
      400
    );

  }

};

export const updateProfileController =
async (req, res) => {

  try {

    const profile =
      await updateProfileService({
        userId:
          req.user.userId,

        ...req.body,
      });

    return successResponse(
      res,
      profile,
      "Profile updated"
    );

  } catch (error) {

    return errorResponse(
      res,
      error.message,
      400
    );

  }

};

export const updateFreelancerProfileController =
async (req, res) => {

  try {

    const profile =
      await updateFreelancerProfileService({

        userId:
          req.user.userId,

        ...req.body,
      });

    return successResponse(
      res,
      profile,
      "Freelancer profile updated"
    );

  } catch (error) {

    return errorResponse(
      res,
      error.message,
      400
    );

  }

};

export const addSkillController =
async (req, res) => {

  try {

    const skill =
      await addSkillService({

        userId:
          req.user.userId,

        skillName:
          req.body.skillName,
      });

    return successResponse(
      res,
      skill,
      "Skill added",
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

// GET CLIENT PROFILE FOR REPUTATION
export const getClientProfileController = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user?.userId;

    const profile = await getClientProfileService(id, currentUserId);

    return successResponse(res, profile, "Client profile fetched successfully", 200);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

// GET FREELANCER PROFILE FOR REPUTATION
export const getFreelancerProfileController = async (req, res) => {
  try {
    const { id } = req.params;

    const profile = await getFreelancerProfileService(id);

    return successResponse(res, profile, "Freelancer profile fetched successfully", 200);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};