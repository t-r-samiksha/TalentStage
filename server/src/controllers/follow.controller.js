import {

  followClientService,

  unfollowClientService,

  getClientFollowersService,

} from "../services/follow/follow.service.js";

import {

  successResponse,

  errorResponse,

} from "../utils/apiResponse.js";


// FOLLOW CLIENT
export const followClientController =
async (req, res) => {

  try {

    const follow =
      await followClientService({

        clientId:
          req.params.id,

        freelancerId:
          req.user.userId,
      });

    return successResponse(
      res,
      follow,
      "Client followed successfully"
    );

  } catch (error) {

    return errorResponse(
      res,
      error.message,
      400
    );

  }

};


// UNFOLLOW CLIENT
export const unfollowClientController =
async (req, res) => {

  try {

    await unfollowClientService({

      clientId:
        req.params.id,

      freelancerId:
        req.user.userId,
    });

    return successResponse(
      res,
      null,
      "Client unfollowed successfully"
    );

  } catch (error) {

    return errorResponse(
      res,
      error.message,
      400
    );

  }

};


// GET FOLLOWERS
export const getClientFollowersController =
async (req, res) => {

  try {

    const followers =
      await getClientFollowersService(
        req.params.id
      );

    return successResponse(
      res,
      followers,
      "Followers fetched successfully"
    );

  } catch (error) {

    return errorResponse(
      res,
      error.message,
      400
    );

  }

};