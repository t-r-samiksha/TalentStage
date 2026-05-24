import {
  getMyProfileService,
  updateProfileService,
  updateFreelancerProfileService,
  addSkillService,
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