import prisma from "../../config/db.js";
import { getIO } from "../../socket/socket.js";

export const createMilestoneService = async ({ contractId, title, amount }) => {
  const milestone = await prisma.milestone.create({
    data: {
      contractId,
      title,
      amount,
    },
  });

  return milestone;
};

export const getContractMilestonesService = async (contractId) => {
  const milestones = await prisma.milestone.findMany({
    where: {
      contractId,
    },

    orderBy: {
      id: "desc",
    },
  });

  return milestones;
};

export const submitMilestoneService = async ({
  milestoneId,
  submissionText,
  submissionFileUrl,
}) => {
  const milestone = await prisma.milestone.update({
    where: {
      id: milestoneId,
    },

    data: {
      status: "SUBMITTED",

      submissionText,

      submissionFileUrl,

      submittedAt: new Date(),
    },
  });

  try {
    const io = getIO();

    io.to(milestone.contractId).emit("milestone:submitted", milestone);
  } catch (error) {
    console.log("Socket emit failed");
  }

  return milestone;
};

export const approveMilestoneService = async (milestoneId) => {
  const milestone = await prisma.milestone.update({
    where: {
      id: milestoneId,
    },

    data: {
      status: "APPROVED",
    },
  });

  try {
    const io = getIO();

    io.to(milestone.contractId).emit("milestone:approved", milestone);
  } catch (error) {
    console.log("Socket emit failed");
  }

  return milestone;
};

export const requestRevisionService = async (milestoneId) => {
  const milestone = await prisma.milestone.update({
    where: {
      id: milestoneId,
    },

    data: {
      status: "REVISION_REQUESTED",
    },
  });

  try {
    const io = getIO();

    io.to(milestone.contractId).emit("milestone:revision_requested", milestone);
  } catch (error) {
    console.log("Socket emit failed");
  }

  return milestone;
};
