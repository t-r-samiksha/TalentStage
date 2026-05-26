import { z }
from "zod";


// SEND INVITATION
export const inviteFreelancerSchema =
  z.object({

    projectId:
      z.string().uuid(),

    freelancerId:
      z.string().uuid(),

  });


// RESPOND INVITATION
export const respondInvitationSchema =
  z.object({

    status:
      z.enum([
        "ACCEPTED",
        "REJECTED",
      ]),

  });