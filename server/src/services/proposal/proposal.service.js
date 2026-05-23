import prisma from "../../config/db.js";

export const submitProposalService = async ({
  projectId,
  freelancerId,
  coverLetter,
  bidAmount,
  timelineDays,
}) => {

  // prevent duplicate proposal
  const existingProposal =
    await prisma.proposal.findUnique({
      where: {
        projectId_freelancerId: {
          projectId,
          freelancerId,
        },
      },
    });

  if (existingProposal) {
    throw new Error(
      "Proposal already submitted"
    );
  }

  const proposal =
    await prisma.proposal.create({
      data: {
        projectId,
        freelancerId,
        coverLetter,
        bidAmount,
        timelineDays,
      },
    });

  return proposal;
};

export const getMyProposalsService = async (
  freelancerId
) => {

  const proposals =
    await prisma.proposal.findMany({
      where: {
        freelancerId,
      },
      include: {
        project: true,
      },
    });

  return proposals;
};