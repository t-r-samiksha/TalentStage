import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("Internal Server Error: JWT_SECRET configuration is missing.");
  }

  // Restrict token payload strictly to sanitised fields
  return jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d", // production standard session expiry
    }
  );
};