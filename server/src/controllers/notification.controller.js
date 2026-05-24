import {
  getMyNotificationsService,
  markNotificationReadService,
} from "../services/notification/notification.service.js";

export const getMyNotificationsController =
async (req, res) => {

  try {

    const notifications =
      await getMyNotificationsService(
        req.user.userId
      );

    return res.status(200).json({
      success: true,
      notifications,
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }

};

export const markNotificationReadController =
async (req, res) => {

  try {

    const notification =
      await markNotificationReadService(
        req.params.id
      );

    return res.status(200).json({
      success: true,
      notification,
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }

};