import prisma from "../../config/db.js";

import {
  createNotificationService,
} from "../notification/notification.service.js";


// INVITE FREELANCER
export const inviteFreelancerService =
async ({
  projectId,
  clientId,
  freelancerId,
}) => {

  // check project
  const project =
    await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

  if (!project) {
    throw new Error(
      "Project not found"
    );
  }

  // verify ownership
  if (
    project.clientId !== clientId
  ) {
    throw new Error(
      "Unauthorized"
    );
  }

  // prevent duplicate invite
  const existingInvitation =
    await prisma.invitation.findUnique({

      where: {
        projectId_freelancerId: {
          projectId,
          freelancerId,
        },
      },
    });

  if (existingInvitation) {
    throw new Error(
      "Invitation already sent"
    );
  }

  // create invitation
  const invitation =
    await prisma.invitation.create({

      data: {
        projectId,
        clientId,
        freelancerId,
      },
    });

  // send realtime notification
  await createNotificationService({

    userId: freelancerId,

    title: "Project Invitation",

    message:
      "You were invited to apply for a project.",
  });

  return invitation;
};


// GET MY INVITATIONS
export const getMyInvitationsService =
async (userId) => {

  const invitations =
    await prisma.invitation.findMany({

      where: {
        freelancerId: userId,
      },

      include: {
        project: true,

        client: {
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

  return invitations;
};


// RESPOND TO INVITATION
export const respondInvitationService =
async ({
  invitationId,
  userId,
  status,
}) => {

  const invitation =
    await prisma.invitation.findUnique({

      where: {
        id: invitationId,
      },
    });

  if (!invitation) {
    throw new Error(
      "Invitation not found"
    );
  }

  // only invited freelancer
  if (
    invitation.freelancerId !== userId
  ) {
    throw new Error(
      "Unauthorized"
    );
  }

  const updatedInvitation =
    await prisma.invitation.update({

      where: {
        id: invitationId,
      },

      data: {
        status,
      },
    });

  return updatedInvitation;
};