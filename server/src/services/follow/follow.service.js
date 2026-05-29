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

  // Fetch freelancer user profile to personalize name
  let freelancerName = "A freelancer";
  try {
    const freelancerUser = await prisma.user.findUnique({
      where: { id: freelancerId },
      include: { profile: true }
    });
    if (freelancerUser?.profile?.fullName) {
      freelancerName = freelancerUser.profile.fullName;
    } else if (freelancerUser?.email) {
      freelancerName = freelancerUser.email.split('@')[0];
    }
  } catch (err) {
    console.error(`[Follow Notification Profile Error] ${err.message}`);
  }

  // notify client
  await createNotificationService({
    userId: clientId,
    title: "New Follower",
    message: `${freelancerName} started following you.`,
    type: "FOLLOW_NOTIFICATION",
    freelancerId: freelancerId
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
            profile: {
              select: {
                fullName: true,
                bio: true,
                avatarUrl: true
              }
            },
            freelancerProfile: {
              select: {
                hourlyRate: true,
                totalEarned: true,
                rating: true
              }
            },
            userSkills: {
              include: {
                skill: true
              }
            }
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

  return followers.map(item => {
    const f = item.freelancer;
    return {
      id: f.id,
      email: f.email,
      fullName: f.profile?.fullName || f.email.split('@')[0],
      bio: f.profile?.bio || "",
      avatarUrl: f.profile?.avatarUrl || null,
      hourlyRate: f.freelancerProfile?.hourlyRate || null,
      totalEarned: f.freelancerProfile?.totalEarned || 0,
      rating: f.freelancerProfile?.rating || 0.0,
      skills: f.userSkills ? f.userSkills.map(us => us.skill.name) : []
    };
  });
};