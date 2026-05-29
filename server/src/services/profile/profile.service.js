import prisma from "../../config/db.js";

export const getMyProfileService =
async (userId) => {

  const profile =
  await prisma.user.findUnique({

    where: {
      id: userId,
    },

    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,

      profile: true,

      freelancerProfile: true,

      userSkills: {
        include: {
          skill: true,
        },
      },
    },
  });
  return profile;
};

export const updateProfileService =
async ({
  userId,
  fullName,
  bio,
  avatarUrl,
}) => {

  const profile =
    await prisma.profile.upsert({

      where: {
        userId,
      },

      update: {
        fullName,
        bio,
        avatarUrl,
      },

      create: {
        userId,
        fullName,
        bio,
        avatarUrl,
      },
    });

  return profile;
};

export const updateFreelancerProfileService =
async ({
  userId,
  hourlyRate,
}) => {

  const freelancerProfile =
    await prisma.freelancerProfile.upsert({

      where: {
        userId,
      },

      update: {
        hourlyRate,
      },

      create: {
        userId,
        hourlyRate,
      },
    });

  return freelancerProfile;
};

export const addSkillService =
async ({
  userId,
  skillName,
}) => {

  skillName = skillName.trim().toLowerCase();

  let skill =
    await prisma.skill.findUnique({
      where: {
        name: skillName,
      },
    });

  if (!skill) {

    skill =
      await prisma.skill.create({
        data: {
          name: skillName,
        },
      });

  }

  const existingSkill =
  await prisma.userSkill.findFirst({

    where: {
      userId,
      skillId: skill.id,
    },
  });

if (existingSkill) {
  throw new Error(
    "Skill already added"
  );
}

  const userSkill =
    await prisma.userSkill.create({

      data: {
        userId,
        skillId: skill.id,
      },
    });

  return userSkill;
};

// GET CLIENT PROFILE FOR REPUTATION
export const getClientProfileService = async (clientId, currentUserId) => {
  const clientUser = await prisma.user.findUnique({
    where: { id: clientId },
    select: {
      id: true,
      email: true,
      createdAt: true,
      profile: true
    }
  });

  if (!clientUser) {
    throw new Error("Client not found");
  }

  // Get client's projects
  const projects = await prisma.project.findMany({
    where: { clientId },
    orderBy: { createdAt: "desc" }
  });

  // Get client's contracts
  const contracts = await prisma.contract.findMany({
    where: { clientId },
    include: {
      milestones: true
    }
  });

  // Calculate stats
  const totalProjectsPosted = projects.length;
  const totalProjectsCompleted = projects.filter(p => p.status === "COMPLETED").length;
  
  // Total Amount Spent: sum of APPROVED milestones
  let totalAmountSpent = 0;
  contracts.forEach(c => {
    c.milestones.forEach(m => {
      if (m.status === "APPROVED") {
        totalAmountSpent += m.amount;
      }
    });
  });

  // Average Project Budget
  const totalBudget = projects.reduce((acc, p) => acc + (p.budgetMax || 0), 0);
  const averageProjectBudget = projects.length > 0 ? Math.round(totalBudget / projects.length) : 0;

  const totalHires = contracts.length;
  const completedContracts = contracts.filter(c => c.status === "COMPLETED").length;
  const completionRate = contracts.length > 0 ? Math.round((completedContracts / contracts.length) * 100) : 100;

  // Repeat Hire Rate
  // Group contracts by freelancerId
  const freelancerCounts = {};
  contracts.forEach(c => {
    freelancerCounts[c.freelancerId] = (freelancerCounts[c.freelancerId] || 0) + 1;
  });
  const uniqueFreelancers = Object.keys(freelancerCounts).length;
  const repeatFreelancers = Object.values(freelancerCounts).filter(count => count > 1).length;
  const repeatHireRate = uniqueFreelancers > 0 ? Math.round((repeatFreelancers / uniqueFreelancers) * 100) : 0;

  // Followers Count
  const followersCount = await prisma.clientFollower.count({
    where: { clientId }
  });

  // Check if following
  let isFollowing = false;
  if (currentUserId && currentUserId !== clientId) {
    const followRecord = await prisma.clientFollower.findUnique({
      where: {
        clientId_freelancerId: {
          clientId,
          freelancerId: currentUserId
        }
      }
    });
    isFollowing = !!followRecord;
  }

  return {
    id: clientUser.id,
    email: clientUser.email,
    createdAt: clientUser.createdAt,
    fullName: clientUser.profile?.fullName || clientUser.email.split('@')[0],
    bio: clientUser.profile?.bio || "",
    avatarUrl: clientUser.profile?.avatarUrl || null,
    projects: projects.map(p => ({
      id: p.id,
      title: p.title,
      budgetMin: p.budgetMin,
      budgetMax: p.budgetMax,
      status: p.status,
      createdAt: p.createdAt
    })),
    stats: {
      totalProjectsPosted,
      totalProjectsCompleted,
      totalAmountSpent,
      averageProjectBudget,
      totalHires,
      completionRate,
      repeatHireRate,
      followersCount,
      isFollowing
    }
  };
};

// GET FREELANCER PROFILE FOR REPUTATION
export const getFreelancerProfileService = async (freelancerId) => {
  const freelancerUser = await prisma.user.findUnique({
    where: { id: freelancerId },
    select: {
      id: true,
      email: true,
      createdAt: true,
      profile: true,
      freelancerProfile: true
    }
  });

  if (!freelancerUser) {
    throw new Error("Freelancer not found");
  }

  // Get freelancer's contracts
  const contracts = await prisma.contract.findMany({
    where: { freelancerId },
    include: {
      project: true,
      client: {
        select: {
          id: true,
          email: true,
          profile: {
            select: {
              fullName: true
            }
          }
        }
      },
      milestones: true,
      review: true
    },
    orderBy: { createdAt: "desc" }
  });

  // Calculate stats
  const completedContractsCount = contracts.filter(c => c.status === "COMPLETED").length;
  const activeContractsCount = contracts.filter(c => c.status === "ACTIVE").length;

  let totalEarnings = 0;
  contracts.forEach(c => {
    c.milestones.forEach(m => {
      if (m.status === "APPROVED") {
        totalEarnings += m.amount;
      }
    });
  });

  // Verified skills count
  const verifiedSkillsCount = await prisma.userSkill.count({
    where: {
      userId: freelancerId,
      verified: true
    }
  });

  // Get all user skills
  const userSkills = await prisma.userSkill.findMany({
    where: { userId: freelancerId },
    include: { skill: true }
  });

  // Get all reviews
  const reviews = await prisma.review.findMany({
    where: { freelancerId },
    include: {
      client: {
        select: {
          id: true,
          email: true,
          profile: {
            select: {
              fullName: true,
              avatarUrl: true
            }
          }
        }
      },
      contract: {
        select: {
          project: {
            select: {
              title: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  // Calculate average rating
  const avgRating = reviews.length > 0
    ? parseFloat((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2))
    : freelancerUser.freelancerProfile?.rating || 0.0;

  return {
    id: freelancerUser.id,
    email: freelancerUser.email,
    createdAt: freelancerUser.createdAt,
    fullName: freelancerUser.profile?.fullName || freelancerUser.email.split('@')[0],
    bio: freelancerUser.profile?.bio || "",
    avatarUrl: freelancerUser.profile?.avatarUrl || null,
    freelancerProfile: {
      hourlyRate: freelancerUser.freelancerProfile?.hourlyRate || null,
      rating: avgRating,
      totalEarned: freelancerUser.freelancerProfile?.totalEarned || 0
    },
    stats: {
      completedContractsCount,
      activeContractsCount,
      totalEarnings,
      verifiedSkillsCount
    },
    skills: userSkills.map(us => ({
      id: us.skill.id,
      name: us.skill.name,
      verified: us.verified,
      score: us.score
    })),
    reviews: reviews.map(r => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
      projectName: r.contract?.project?.title || "Project",
      clientName: r.client?.profile?.fullName || r.client?.email.split('@')[0]
    })),
    contracts: contracts.map(c => ({
      id: c.id,
      projectName: c.project.title,
      clientName: c.client?.profile?.fullName || c.client?.email.split('@')[0],
      contractValue: c.milestones.reduce((acc, m) => acc + m.amount, 0),
      status: c.status,
      createdAt: c.createdAt
    }))
  };
};