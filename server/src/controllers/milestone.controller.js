import {
  createMilestoneService,
  getContractMilestonesService,
  submitMilestoneService,
  approveMilestoneService,
  requestRevisionService,
} from "../services/milestone/milestone.service.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

export const createMilestoneController =
async (req, res) => {

  try {

    const milestone =
      await createMilestoneService(
        req.body
      );

    return successResponse(res, milestone, "Milestone created successfully", 201);

  } catch (error) {

    return errorResponse(res, error.message, 400);

  }

};

export const getContractMilestonesController =
async (req, res) => {

  try {

    const milestones =
      await getContractMilestonesService(
        req.params.contractId
      );

    return successResponse(res, milestones, "Milestones fetched successfully", 200);

  } catch (error) {

    return errorResponse(res, error.message, 400);

  }

};

export const submitMilestoneController =
async (req, res) => {

  try {

    const milestone =
      await submitMilestoneService(
        req.params.id
      );

    return successResponse(res, milestone, "Milestone submitted successfully", 200);

  } catch (error) {

    return errorResponse(res, error.message, 400);

  }

};

export const approveMilestoneController =
async (req, res) => {

  try {

    const milestone =
      await approveMilestoneService(
        req.params.id
      );

    return successResponse(res, milestone, "Milestone approved successfully", 200);

  } catch (error) {

    return errorResponse(res, error.message, 400);

  }

};

export const requestRevisionController =
async (req, res) => {

  try {

    const milestone =
      await requestRevisionService(
        req.params.id
      );

    return successResponse(res, milestone, "Revision requested successfully", 200);

  } catch (error) {

    return errorResponse(res, error.message, 400);

  }

};