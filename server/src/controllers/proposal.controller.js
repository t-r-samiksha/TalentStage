import {
  submitProposalService,
  getMyProposalsService,
} from "../services/proposal/proposal.service.js";

export const submitProposalController =
async (req, res) => {

  try {

    const proposal =
      await submitProposalService({
        ...req.body,
        freelancerId: req.user.userId,
      });

    return res.status(201).json({
      success: true,
      proposal,
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }

};

export const getMyProposalsController =
async (req, res) => {

  try {

    const proposals =
      await getMyProposalsService(
        req.user.userId
      );

    return res.status(200).json({
      success: true,
      proposals,
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }

};