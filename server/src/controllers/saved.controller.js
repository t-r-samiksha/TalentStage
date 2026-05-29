import {
  saveFreelancerService,
  removeSavedFreelancerService,
  getSavedFreelancersService
} from "../services/saved/saved.service.js";

import { successResponse, errorResponse } from "../utils/apiResponse.js";

// SAVE FREELANCER
export const saveFreelancerController = async (req, res) => {
  try {
    const { freelancerId } = req.body;
    if (!freelancerId) {
      throw new Error("freelancerId is required");
    }

    const saved = await saveFreelancerService({
      clientId: req.user.userId,
      freelancerId
    });

    return successResponse(res, saved, "Freelancer saved successfully", 201);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

// REMOVE SAVED FREELANCER
export const removeSavedFreelancerController = async (req, res) => {
  try {
    const { id } = req.params;

    await removeSavedFreelancerService({
      clientId: req.user.userId,
      freelancerId: id
    });

    return successResponse(res, null, "Freelancer removed from saved list successfully", 200);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

// GET SAVED FREELANCERS
export const getSavedFreelancersController = async (req, res) => {
  try {
    const saved = await getSavedFreelancersService(req.user.userId);
    return successResponse(res, saved, "Saved freelancers fetched successfully", 200);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};
