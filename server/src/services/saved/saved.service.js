import prisma from "../../config/db.js";
import { createNotificationService } from "../notification/notification.service.js";

// SAVE FREELANCER
export const saveFreelancerService = async ({ clientId, freelancerId }) => {
  if (clientId === freelancerId) {
    throw new Error("Cannot save yourself");
  }

  // Verify freelancer exists
  const freelancer = await prisma.user.findUnique({
    where: { id: freelancerId },
    include: { freelancerProfile: true }
  });

  if (!freelancer || (freelancer.role !== "FREELANCER" && freelancer.role !== "BOTH")) {
    throw new Error("Target user is not a valid freelancer");
  }

  // Check if already saved
  const existingSave = await prisma.savedFreelancer.findUnique({
    where: {
      clientId_freelancerId: {
        clientId,
        freelancerId
      }
    }
  });

  if (existingSave) {
    throw new Error("Freelancer is already saved");
  }

  const saved = await prisma.savedFreelancer.create({
    data: {
      clientId,
      freelancerId
    }
  });

  // Get client details to personalize message
  const clientUser = await prisma.user.findUnique({
    where: { id: clientId },
    include: { profile: true }
  });
  const clientName = clientUser?.profile?.fullName || "A client";

  // Notify freelancer
  await createNotificationService({
    userId: freelancerId,
    title: "Profile Saved",
    message: `${clientName} has saved your profile to their list of candidates.`
  });

  return saved;
};

// REMOVE SAVED FREELANCER
export const removeSavedFreelancerService = async ({ clientId, freelancerId }) => {
  await prisma.savedFreelancer.delete({
    where: {
      clientId_freelancerId: {
        clientId,
        freelancerId
      }
    }
  });

  return true;
};

// GET SAVED FREELANCERS
export const getSavedFreelancersService = async (clientId) => {
  const saved = await prisma.savedFreelancer.findMany({
    where: {
      clientId
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
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  // Format to simplify structure for client consumption
  return saved.map(item => {
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
      skills: f.userSkills.map(us => us.skill.name)
    };
  });
};
