import { signupService, loginService, sendOtpService, verifyOtpService } from "../services/auth/auth.service.js";
import { generateToken } from "../utils/generateToken.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

export const sendOtpController = async (req, res) => {
  try {
    const result = await sendOtpService(req.body);
    return successResponse(res, null, result.message, 200);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const verifyOtpController = async (req, res) => {
  try {
    const result = await verifyOtpService(req.body);
    return successResponse(res, null, result.message, 200);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const signupController = async (req, res) => {
  try {
    const user = await signupService(req.body);

    return successResponse(
      res,
      {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      },
      "Account created successfully.",
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