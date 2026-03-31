import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth.js";
import { usersRouter } from "./routes/users.js";
import { aiRouter } from "./routes/ai.js";
import { adminRouter } from "./routes/admin.js";
import { settingsRouter } from "./routes/settings.js";
import { locationRouter } from "./routes/location.js";
import { activityRouter } from "./routes/activity.js";
import { dashboardRouter } from "./routes/dashboard.js";
import { farmersRouter } from "./routes/farmers.js";
import { fail, ok } from "./utils/response.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
      credentials: true,
    }),
  );

  app.use(express.json({ limit: "2mb" }));

  app.get("/api/health", (_, res) => {
    return ok(res, { service: "farmaid-backend", status: "up" });
  });

  app.use("/api/auth", authRouter);
  app.use("/api/users", usersRouter);
  app.use("/api", aiRouter);
  app.use("/api/location", locationRouter);
  app.use("/api/activity", activityRouter);
  app.use("/api/dashboard", dashboardRouter);
  app.use("/api/farmers", farmersRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api/settings", settingsRouter);

  app.use((_, res) => fail(res, "Not Found", 404));

  app.use((err, _, res, __) => {
    console.error(err);
    return fail(res, "Internal server error", 500);
  });

  return app;
}
