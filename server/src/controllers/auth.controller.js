import { signupService, loginService } from "../services/auth/auth.service.js";

import { generateToken } from "../utils/generateToken.js";

export const signupController = async (req, res) => {

  try {

    const user = await signupService(req.body);

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }

};

export const loginController = async (req, res) => {

  try {

    const user = await loginService(req.body);

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }

};