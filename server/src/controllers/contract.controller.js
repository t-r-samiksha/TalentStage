import {
  hireFreelancerService,
  getMyContractsService,
getContractByIdService,
} from "../services/contract/contract.service.js";

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

    return res.status(201).json({
      success: true,
      contract,
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }

};

export const getMyContractsController =
async (req, res) => {

  try {

    const contracts =
      await getMyContractsService(
        req.user.userId
      );

    return res.status(200).json({
      success: true,
      contracts,
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }

};

export const getContractByIdController =
async (req, res) => {

  try {

    const contract =
      await getContractByIdService(
        req.params.id
      );

    return res.status(200).json({
      success: true,
      contract,
    });

  } catch (error) {

    return res.status(404).json({
      success: false,
      message: error.message,
    });

  }

};