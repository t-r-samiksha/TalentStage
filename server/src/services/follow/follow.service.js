import prisma from "../../config/db.js";

import {
  createNotificationService,
} from "../notification/notification.service.js";


// FOLLOW CLIENT
export const followClientService =
async ({
  clientId,
  freelancerId,
}) => {

  // prevent self-follow
  if (clientId === freelancerId) {

    throw new Error(
      "Cannot follow yourself"
    );

  }

  // check existing follow
  const existingFollow =
    await prisma.clientFollower.findUnique({

      where: {

        clientId_freelancerId: {
          clientId,
          freelancerId,
        },
      },
    });

  if (existingFollow) {

    throw new Error(
      "Already following"
    );

  }

  // create follow
  const follow =
    await prisma.clientFollower.create({

      data: {
        clientId,
        freelancerId,
      },
    });

  // notify client
  await createNotificationService({

    userId: clientId,

    title: "New Follower",

    message:
      "A freelancer started following you",
  });

  return follow;
};


// UNFOLLOW CLIENT
export const unfollowClientService =
async ({
  clientId,
  freelancerId,
}) => {

  await prisma.clientFollower.delete({

    where: {

      clientId_freelancerId: {
        clientId,
        freelancerId,
      },
    },
  });

  return true;
};


// GET CLIENT FOLLOWERS
export const getClientFollowersService =
async (clientId) => {

  const followers =
    await prisma.clientFollower.findMany({

      where: {
        clientId,
      },

      include: {

        freelancer: {

          select: {
            id: true,
            email: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

  return followers;
};