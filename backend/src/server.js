import dotenv from "dotenv";
import { createApp } from "./app.js";
import { connectDatabase } from "./config/database.js";

dotenv.config();

const app = createApp();
const port = Number(process.env.PORT || 5001);

async function startServer() {
  try {
    await connectDatabase();
  } catch (error) {
    console.warn("MongoDB connection failed. Running with in-memory fallback.");
    console.warn(error?.message || error);
  }

  const server = app.listen(port, () => {
    console.log(`Farmaid backend listening on http://localhost:${port}`);
  });

  server.on("error", (error) => {
    if (error?.code === "EADDRINUSE") {
      console.error(`Port ${port} is already in use. Stop duplicate backend process and retry.`);
      return;
    }

    console.error("Server startup error:", error);
  });
}

startServer();
