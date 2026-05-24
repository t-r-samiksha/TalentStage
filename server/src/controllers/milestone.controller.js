import {
  createMilestoneService,
  getContractMilestonesService,
  submitMilestoneService,
  approveMilestoneService,
  requestRevisionService,
} from "../services/milestone/milestone.service.js";

export const createMilestoneController =
async (req, res) => {

  try {

    const milestone =
      await createMilestoneService(
        req.body
      );

    return res.status(201).json({
      success: true,
      milestone,
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }

};

export const getContractMilestonesController =
async (req, res) => {

  try {

    const milestones =
      await getContractMilestonesService(
        req.params.contractId
      );

    return res.status(200).json({
      success: true,
      milestones,
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }

};

export const submitMilestoneController =
async (req, res) => {

  try {

    const milestone =
      await submitMilestoneService(
        req.params.id
      );

    return res.status(200).json({
      success: true,
      milestone,
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }

};

export const approveMilestoneController =
async (req, res) => {

  try {

    const milestone =
      await approveMilestoneService(
        req.params.id
      );

    return res.status(200).json({
      success: true,
      milestone,
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }

};

export const requestRevisionController =
async (req, res) => {

  try {

    const milestone =
      await requestRevisionService(
        req.params.id
      );

    return res.status(200).json({
      success: true,
      milestone,
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }

};