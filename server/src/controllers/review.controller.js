import {
  completeContractService,
  createReviewService
} from "../services/review/review.service.js";

import { successResponse, errorResponse } from "../utils/apiResponse.js";

// COMPLETE CONTRACT
export const completeContractController = async (req, res) => {
  try {
    const { id } = req.params;

    const contract = await completeContractService({
      contractId: id,
      clientId: req.user.userId
    });

    return successResponse(res, contract, "Contract completed successfully", 200);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

// CREATE REVIEW
export const createReviewController = async (req, res) => {
  try {
    const { id } = req.params; // contract ID
    const { rating, comment } = req.body;

    if (rating === undefined) {
      throw new Error("rating is required");
    }

    const review = await createReviewService({
      contractId: id,
      clientId: req.user.userId,
      rating,
      comment
    });

    return successResponse(res, review, "Review submitted successfully", 201);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};
