import {
  getMyNotificationsService,
  markNotificationReadService,
  markAllNotificationsReadService,
} from "../services/notification/notification.service.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

export const getMyNotificationsController =
async (req, res) => {

  try {

    const notifications =
      await getMyNotificationsService(
        req.user.userId
      );

    return successResponse(res, notifications, "Notifications fetched successfully", 200);

  } catch (error) {

    return errorResponse(res, error.message, 400);

  }

};

export const markNotificationReadController =
async (req, res) => {

  try {

    const notification =
      await markNotificationReadService(
        req.params.id
      );

    return successResponse(res, notification, "Notification marked as read successfully", 200);

  } catch (error) {

    return errorResponse(res, error.message, 400);

  }

};

export const markAllNotificationsReadController =
async (req, res) => {

  try {

    const result =
      await markAllNotificationsReadService(
        req.user.userId
      );

    return successResponse(res, result, "All notifications marked as read successfully", 200);

  } catch (error) {

    return errorResponse(res, error.message, 400);

  }

};