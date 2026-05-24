import {
  submitProposalService,
  getMyProposalsService,
} from "../services/proposal/proposal.service.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

export const submitProposalController =
async (req, res) => {

  try {

    const proposal =
      await submitProposalService({
        ...req.body,
        freelancerId: req.user.userId,
      });

    return successResponse(res, proposal, "Proposal submitted successfully", 201);

  } catch (error) {

    return errorResponse(res, error.message, 400);

  }

};

export const getMyProposalsController =
async (req, res) => {

  try {

    const proposals =
      await getMyProposalsService(
        req.user.userId
      );

    return successResponse(res, proposals, "Proposals fetched successfully", 200);

  } catch (error) {

    return errorResponse(res, error.message, 400);

  }

};