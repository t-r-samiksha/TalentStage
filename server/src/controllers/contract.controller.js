import {
  hireFreelancerService,
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