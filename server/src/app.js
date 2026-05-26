import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import testRoutes from "./routes/test.routes.js";
import projectRoutes from "./routes/project.routes.js";
import proposalRoutes from "./routes/proposal.routes.js";
import contractRoutes from "./routes/contract.routes.js";
import milestoneRoutes from "./routes/milestone.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import profileRoutes from "./routes/profile.routes.js";
import messageRoutes from "./routes/message.routes.js";
import invitationRoutes from "./routes/invitation.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import followRoutes from "./routes/follow.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/proposals", proposalRoutes);
app.use("/api/contracts", contractRoutes);
app.use("/api/milestones", milestoneRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/messages", messageRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/invitations", invitationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api", followRoutes);

app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send("TalentStage Backend Running 🚀");
});

export default app;
