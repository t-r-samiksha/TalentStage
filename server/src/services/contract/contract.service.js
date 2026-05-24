import prisma from "../../config/db.js";

export const hireFreelancerService =
async ({
  proposalId,
  clientId,
}) => {

  // find proposal
  const proposal =
    await prisma.proposal.findUnique({
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
  if (
    proposal.project.clientId !== clientId
  ) {
    throw new Error(
      "Unauthorized action"
    );
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
  const contract =
    await prisma.contract.create({
      data: {
        projectId: proposal.projectId,

        clientId,

        freelancerId:
          proposal.freelancerId,
      },
    });

  return contract;
};