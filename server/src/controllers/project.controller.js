import {
  createProjectService,
  getAllProjectsService,
  getProjectByIdService,
} from "../services/project/project.service.js";

export const createProjectController = async (
  req,
  res
) => {

  try {

    const project = await createProjectService({
      ...req.body,
      clientId: req.user.userId,
    });

    return res.status(201).json({
      success: true,
      project,
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }

};

export const getAllProjectsController = async (
  req,
  res
) => {

  try {

    const projects =
      await getAllProjectsService();

    return res.status(200).json({
      success: true,
      projects,
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }

};

export const getProjectByIdController =
async (req, res) => {

  try {

    const project =
      await getProjectByIdService(
        req.params.id
      );

    return res.status(200).json({
      success: true,
      project,
    });

  } catch (error) {

    return res.status(404).json({
      success: false,
      message: error.message,
    });

  }

};