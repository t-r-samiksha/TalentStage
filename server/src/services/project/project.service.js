import prisma from "../../config/db.js";

export const createProjectService = async ({
  title,
  description,
  budgetMin,
  budgetMax,
  clientId,
}) => {

  const project = await prisma.project.create({
    data: {
      title,
      description,
      budgetMin,
      budgetMax,
      clientId,
    },
  });

  return project;
};

export const getAllProjectsService = async () => {

  const projects = await prisma.project.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return projects;
};

export const getProjectByIdService = async (
  projectId
) => {

  const project =
    await prisma.project.findUnique({
      where: {
        id: projectId,
      },

      include: {
        client: {
          select: {
            id: true,
            email: true,
          },
        },

        proposals: {
          include: {
            freelancer: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
      },
    });

  if (!project) {
    throw new Error("Project not found");
  }

  return project;
};