import prisma from "../../config/db.js";
import { getIO } from "../../socket/socket.js";

export const createNotificationService =
async ({
  userId,
  title,
  message,
}) => {

  const notification =
    await prisma.notification.create({

      data: {
        userId,
        title,
        message,
      },
    });

  try {

    const io = getIO();

    io.to(userId).emit(
      "new_notification",
      notification
    );

  } catch (error) {

    console.log(
      "Socket emit failed"
    );

  }

  return notification;
};

export const getMyNotificationsService = async (userId) => {
  const notifications = await prisma.notification.findMany({
    where: {
      userId,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return notifications;
};

export const markNotificationReadService = async (notificationId) => {
  const notification = await prisma.notification.update({
    where: {
      id: notificationId,
    },

    data: {
      isRead: true,
    },
  });

  return notification;
};
