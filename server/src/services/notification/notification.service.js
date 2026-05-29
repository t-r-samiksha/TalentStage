import prisma from "../../config/db.js";
import { getIO } from "../../socket/socket.js";

// HELPER TO HYDRATE METADATA FROM REAL-TIME DATABASE RECORDS
export const hydrateNotification = async (notification) => {
  const metadata = {};

  try {
    if (notification.projectId) {
      const project = await prisma.project.findUnique({
        where: { id: notification.projectId },
        include: {
          client: {
            include: {
              profile: true
            }
          }
        }
      });

      if (project) {
        metadata.project = {
          id: project.id,
          title: project.title,
          description: project.description,
          budgetMin: project.budgetMin,
          budgetMax: project.budgetMax,
          skills: project.skills || [],
          deadline: project.deadline || null,
          billingModel: project.billingModel || "Fixed Price",
          createdAt: project.createdAt
        };

        // Calculate Client Reputation stats dynamically using live database data
        const clientId = project.clientId;
        const clientUser = await prisma.user.findUnique({
          where: { id: clientId },
          include: { profile: true }
        });

        if (clientUser) {
          const projects = await prisma.project.findMany({
            where: { clientId }
          });
          const contracts = await prisma.contract.findMany({
            where: { clientId },
            include: { milestones: true }
          });
          const followersCount = await prisma.clientFollower.count({
            where: { clientId }
          });

          const totalProjectsPosted = projects.length;
          const totalProjectsCompleted = projects.filter(p => p.status === "COMPLETED").length;

          let totalAmountSpent = 0;
          contracts.forEach(c => {
            c.milestones.forEach(m => {
              if (m.status === "APPROVED") {
                totalAmountSpent += m.amount;
              }
            });
          });

          metadata.client = {
            id: clientUser.id,
            fullName: clientUser.profile?.fullName || clientUser.email.split('@')[0],
            avatarUrl: clientUser.profile?.avatarUrl || null,
            stats: {
              totalProjectsPosted,
              totalProjectsCompleted,
              totalAmountSpent,
              followersCount
            }
          };
        }
      }
    } else if (notification.clientId) {
      const clientUser = await prisma.user.findUnique({
        where: { id: notification.clientId },
        include: { profile: true }
      });
      if (clientUser) {
        // Calculate Client Reputation stats dynamically using live database data
        const clientId = notification.clientId;
        const projects = await prisma.project.findMany({
          where: { clientId }
        });
        const contracts = await prisma.contract.findMany({
          where: { clientId },
          include: { milestones: true }
        });
        const followersCount = await prisma.clientFollower.count({
          where: { clientId }
        });

        const totalProjectsPosted = projects.length;
        const totalProjectsCompleted = projects.filter(p => p.status === "COMPLETED").length;

        let totalAmountSpent = 0;
        contracts.forEach(c => {
          c.milestones.forEach(m => {
            if (m.status === "APPROVED") {
              totalAmountSpent += m.amount;
            }
          });
        });

        metadata.client = {
          id: clientUser.id,
          fullName: clientUser.profile?.fullName || clientUser.email.split('@')[0],
          avatarUrl: clientUser.profile?.avatarUrl || null,
          stats: {
            totalProjectsPosted,
            totalProjectsCompleted,
            totalAmountSpent,
            followersCount
          }
        };
      }
    }

    if (notification.freelancerId) {
      const freelancerUser = await prisma.user.findUnique({
        where: { id: notification.freelancerId },
        include: { profile: true }
      });
      if (freelancerUser) {
        metadata.freelancer = {
          id: freelancerUser.id,
          fullName: freelancerUser.profile?.fullName || freelancerUser.email.split('@')[0],
          avatarUrl: freelancerUser.profile?.avatarUrl || null
        };
      }
    }

    if (notification.contractId) {
      const contract = await prisma.contract.findUnique({
        where: { id: notification.contractId },
        include: {
          project: true
        }
      });
      if (contract) {
        metadata.contract = contract;
      }
    }

    if (notification.reviewId) {
      const review = await prisma.review.findUnique({
        where: { id: notification.reviewId }
      });
      if (review) {
        metadata.review = review;
      }
    }
  } catch (err) {
    console.error(`[Notification Hydration Error] Failed to hydrate references: ${err.message}`);
  }

  return {
    ...notification,
    metadata
  };
};

export const createNotificationService = async ({
  userId,
  title,
  message,
  type = null,
  projectId = null,
  contractId = null,
  messageThreadId = null,
  reviewId = null,
  clientId = null,
  freelancerId = null,
}) => {

  const notification = await prisma.notification.create({
    data: {
      userId,
      title,
      message,
      type,
      projectId,
      contractId,
      messageThreadId,
      reviewId,
      clientId,
      freelancerId,
    },
  });

  try {
    const io = getIO();
    
    // Hydrate the notification dynamically before emitting to frontend
    const hydrated = await hydrateNotification(notification);

    io.to(userId).emit("new_notification", hydrated);
  } catch (error) {
    console.log("Socket emit failed", error);
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

  // Dynamic live-hydrated notifications
  const hydrated = await Promise.all(
    notifications.map((n) => hydrateNotification(n))
  );

  return hydrated;
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

  // Return hydrated for consistency
  return hydrateNotification(notification);
};

export const markAllNotificationsReadService = async (userId) => {
  const result = await prisma.notification.updateMany({
    where: {
      userId,
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });

  return result;
};

