import prisma from "../../config/db.js";

export const createMilestoneService =
async ({
  contractId,
  title,
  amount,
}) => {

  const milestone =
    await prisma.milestone.create({
      data: {
        contractId,
        title,
        amount,
      },
    });

  return milestone;
};

export const getContractMilestonesService =
async (contractId) => {

  const milestones =
    await prisma.milestone.findMany({
      where: {
        contractId,
      },

      orderBy: {
        id: "desc",
      },
    });

  return milestones;
};

export const submitMilestoneService =
async (milestoneId) => {

  const milestone =
    await prisma.milestone.update({

      where: {
        id: milestoneId,
      },

      data: {
        status: "SUBMITTED",
      },
    });

  return milestone;
};

export const approveMilestoneService =
async (milestoneId) => {

  const milestone =
    await prisma.milestone.update({

      where: {
        id: milestoneId,
      },

      data: {
        status: "APPROVED",
      },
    });

  return milestone;
};

export const requestRevisionService =
async (milestoneId) => {

  const milestone =
    await prisma.milestone.update({

      where: {
        id: milestoneId,
      },

      data: {
        status:
          "REVISION_REQUESTED",
      },
    });

  return milestone;
};  