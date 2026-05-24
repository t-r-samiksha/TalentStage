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

  const userSkill =
    await prisma.userSkill.create({

      data: {
        userId,
        skillId: skill.id,
      },
    });

  return userSkill;
};