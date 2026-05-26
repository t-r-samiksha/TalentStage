import {

  getClientDashboardService,

  getFreelancerDashboardService,

} from "../services/dashboard/dashboard.service.js";

import {

  successResponse,

  errorResponse,

} from "../utils/apiResponse.js";


// CLIENT DASHBOARD
export const getClientDashboardController =
async (req, res) => {

  try {

    const dashboard =
      await getClientDashboardService(
        req.user.userId
      );

    return successResponse(
      res,
      dashboard,
      "Client dashboard fetched"
    );

  } catch (error) {

    return errorResponse(
      res,
      error.message,
      400
    );

  }

};


// FREELANCER DASHBOARD
export const getFreelancerDashboardController =
async (req, res) => {

  try {

    const dashboard =
      await getFreelancerDashboardService(
        req.user.userId
      );

    return successResponse(
      res,
      dashboard,
      "Freelancer dashboard fetched"
    );

  } catch (error) {

    return errorResponse(
      res,
      error.message,
      400
    );

  }

};