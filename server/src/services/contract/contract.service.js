import prisma from "../../config/db.js";
import { createNotificationService } from "../notification/notification.service.js";

export const hireFreelancerService = async ({ proposalId, clientId }) => {
  // find proposal
  const proposal = await prisma.proposal.findUnique({
    where: {
      id: proposalId,
    },

    include: {
      project: true,
    },
  });

  if (!proposal) {
    throw new Error("Proposal not found");
  }

  // verify ownership
  if (proposal.project.clientId !== clientId) {
    throw new Error("Unauthorized action");
  }

  // update proposal status
  await prisma.proposal.update({
    where: {
      id: proposalId,
    },

    data: {
      status: "ACCEPTED",
    },
  });

  // update project status
  await prisma.project.update({
    where: {
      id: proposal.projectId,
    },

    data: {
      status: "IN_PROGRESS",
    },
  });

  // create contract
  const contract = await prisma.contract.create({
    data: {
      projectId: proposal.projectId,

      clientId,

      freelancerId: proposal.freelancerId,
    },
  });

  await createNotificationService({
    userId: proposal.freelancerId,

    title: "Proposal Accepted",

    message: "Client hired you for the project.",
  });

  return contract;
};

export const getMyContractsService = async (userId) => {
  const contracts = await prisma.contract.findMany({
    where: {
      OR: [
        {
          clientId: userId,
        },
        {
          freelancerId: userId,
        },
      ],
    },

    include: {
      project: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return contracts;
};

export const getContractByIdService = async (contractId) => {
  const contract = await prisma.contract.findUnique({
    where: {
      id: contractId,
    },

    include: {
      project: true,

      client: {
        select: {
          id: true,
          email: true,
        },
      },

      freelancer: {
        select: {
          id: true,
          email: true,
        },
      },

      milestones: true,
    },
  });

  if (!contract) {
    throw new Error("Contract not found");
  }

  return contract;
};
