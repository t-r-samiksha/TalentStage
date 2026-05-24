import { signupService, loginService } from "../services/auth/auth.service.js";

import { generateToken } from "../utils/generateToken.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

export const signupController = async (req, res) => {

  try {

    const user = await signupService(req.body);

    const token = generateToken(user);

    return successResponse(
      res,
      {
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      },
      "Signup successful",
      201
    );

  } catch (error) {

    return errorResponse(res, error.message, 400);

  }

};

export const loginController = async (req, res) => {

  try {

    const user = await loginService(req.body);

    const token = generateToken(user);

    return successResponse(
      res,
      {
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      },
      "Login successful",
      200
    );

  } catch (error) {

    return errorResponse(res, error.message, 400);

  }

};