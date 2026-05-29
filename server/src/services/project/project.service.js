import prisma from "../../config/db.js";
import { createNotificationService } from "../notification/notification.service.js";

export const createProjectService = async ({
  title,
  description,
  budgetMin,
  budgetMax,
  clientId,
  skills,
  deadline,
  billingModel,
}) => {

  const project = await prisma.project.create({
    data: {
      title,
      description,
      budgetMin,
      budgetMax,
      clientId,
      skills: skills || [],
      deadline: deadline ? new Date(deadline) : null,
      billingModel: billingModel || "Fixed Price",
    },
  });

  try {
    // Fetch client user profile to get their name
    const clientUser = await prisma.user.findUnique({
      where: { id: clientId },
      include: { profile: true }
    });
    const clientName = clientUser?.profile?.fullName || "A client you follow";

    // Find all followers
    const followers = await prisma.clientFollower.findMany({
      where: { clientId }
    });

    // Notify each follower
    for (const f of followers) {
      await createNotificationService({
        userId: f.freelancerId,
        title: "New Project Posted",
        message: `${clientName} posted a new project: "${title}".`,
        type: "NEW_PROJECT",
        projectId: project.id,
        clientId: clientId
      });
    }
  } catch (error) {
    console.error(`[Project Post Notification Error] Failed to notify followers: ${error.message}`);
  }

  return project;
};

export const getAllProjectsService = async () => {

  const projects = await prisma.project.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      client: {
        select: {
          id: true,
          email: true,
          profile: {
            select: {
              fullName: true,
            },
          },
        },
      },
      proposals: {
        select: {
          id: true,
        },
      },
    },
  });

  return projects;
};

export const getProjectByIdService = async (
  projectId
) => {

  const project =
    await prisma.project.findUnique({
      where: {
        id: projectId,
      },

      include: {
        client: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                fullName: true,
              },
            },
          },
        },

        proposals: {
          include: {
            freelancer: {
              select: {
                id: true,
                email: true,
                profile: {
                  select: {
                    fullName: true,
                  },
                },
              },
            },
          },
        },
      },
    });

  if (!project) {
    throw new Error("Project not found");
  }

  return project;
};