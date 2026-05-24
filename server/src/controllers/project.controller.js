import {
  createProjectService,
  getAllProjectsService,
  getProjectByIdService,
} from "../services/project/project.service.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

export const createProjectController = async (
  req,
  res
) => {

  try {

    const project = await createProjectService({
      ...req.body,
      clientId: req.user.userId,
    });

    return successResponse(res, project, "Project created successfully", 201);

  } catch (error) {

    return errorResponse(res, error.message, 400);

  }

};

export const getAllProjectsController = async (
  req,
  res
) => {

  try {

    const projects =
      await getAllProjectsService();

    return successResponse(res, projects, "Projects fetched successfully", 200);

  } catch (error) {

    return errorResponse(res, error.message, 400);

  }

};

export const getProjectByIdController =
async (req, res) => {

  try {

    const project =
      await getProjectByIdService(
        req.params.id
      );

    return successResponse(res, project, "Project fetched successfully", 200);

  } catch (error) {

    return errorResponse(res, error.message, 404);

  }

};