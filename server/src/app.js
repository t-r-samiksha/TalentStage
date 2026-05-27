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
import ledgerRoutes from "./routes/ledger.routes.js";
import skillTestRoutes from "./routes/skilltest.routes.js";
import aiRouter from "./ai/index.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 200,

  message: "Too many requests",
});

// Secure Dynamic CORS options supporting environment-variable whitelist control and preflights
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map(o => o.trim())
  : ["http://localhost:5173", "http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (
        allowedOrigins.includes("*") || 
        allowedOrigins.includes(origin) ||
        process.env.NODE_ENV !== "production"
      ) {
        callback(null, true);
      } else {
        console.warn(`[CORS Blocked] Request from origin: ${origin} rejected.`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);

app.use(helmet());

app.use(limiter);

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
app.use("/api/ledger", ledgerRoutes);
app.use("/api", skillTestRoutes);
app.use("/api/ai", aiRouter);

app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send("TalentStage Backend Running 🚀");
});

export default app;
