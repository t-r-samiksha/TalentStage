import {
  hireFreelancerService,
  getMyContractsService,
getContractByIdService,
} from "../services/contract/contract.service.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

export const hireFreelancerController =
async (req, res) => {

  try {

    const contract =
      await hireFreelancerService({
        proposalId:
          req.body.proposalId,

        clientId:
          req.user.userId,
      });

    return successResponse(res, contract, "Freelancer hired successfully", 201);

  } catch (error) {

    return errorResponse(res, error.message, 400);

  }

};

export const getMyContractsController =
async (req, res) => {

  try {

    const contracts =
      await getMyContractsService(
        req.user.userId
      );

    return successResponse(res, contracts, "Contracts fetched successfully", 200);

  } catch (error) {

    return errorResponse(res, error.message, 400);

  }

};

export const getContractByIdController =
async (req, res) => {

  try {

    const contract =
      await getContractByIdService(
        req.params.id
      );

    return successResponse(res, contract, "Contract fetched successfully", 200);

  } catch (error) {

    return errorResponse(res, error.message, 404);

  }

};