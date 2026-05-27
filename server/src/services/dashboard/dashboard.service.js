import prisma from "../../config/db.js";


export const getClientDashboardService =
async (userId) => {

  // projects
  const projects =
    await prisma.project.findMany({

      where: {
        clientId: userId,
      },

      include: {
        proposals: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

  // contracts
  const contracts =
    await prisma.contract.findMany({

      where: {
        clientId: userId,
      },

      include: {
        freelancer: {
          select: {
            id: true,
            email: true,
          },
        },
        milestones: true,
      },
    });

  // notifications
  const notifications =
    await prisma.notification.findMany({

      where: {
        userId,
      },

      orderBy: {
        createdAt: "desc",
      },

      take: 10,
    });

  return {

    projects,

    contracts,

    notifications,

    totalProjects:
      projects.length,

    totalContracts:
      contracts.length,
  };
};

export const getFreelancerDashboardService =
async (userId) => {

  // proposals
  const proposals =
    await prisma.proposal.findMany({

      where: {
        freelancerId: userId,
      },

      include: {
        project: true,
      },

      orderBy: {
        id: "desc",
      },
    });

  // contracts
  const contracts =
    await prisma.contract.findMany({

      where: {
        freelancerId: userId,
      },

      include: {
        project: {
          include: {
            client: {
              select: {
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

  // invitations
  const invitations =
    await prisma.invitation.findMany({

      where: {
        freelancerId: userId,
      },

      include: {
        project: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

  // notifications
  const notifications =
    await prisma.notification.findMany({

      where: {
        userId,
      },

      orderBy: {
        createdAt: "desc",
      },

      take: 10,
    });

  return {

    proposals,

    contracts,

    invitations,

    notifications,

    totalContracts:
      contracts.length,

    totalInvitations:
      invitations.length,
  };
};