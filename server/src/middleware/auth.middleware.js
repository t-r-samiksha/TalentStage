import jwt from "jsonwebtoken";
import prisma from "../config/db.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access Denied: No token provided or malformed authorization header",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error: Token verification is unconfigured",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from DB to verify existence, verification state, and correct role
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Access Denied: User account no longer exists",
      });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: "Access Denied: Please verify your email before logging in",
      });
    }

    // Attach verified user profile info to the request object
    req.user = {
      id: user.id,
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    let message = "Access Denied: Invalid or expired session token";
    if (error.name === "TokenExpiredError") {
      message = "Access Denied: Session token has expired";
    }
    return res.status(401).json({
      success: false,
      message,
    });
  }
};