import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { getMe, updateMe } from "../controllers/users.controller.js";

export const usersRouter = express.Router();

usersRouter.get("/me", requireAuth, getMe);
usersRouter.put("/me", requireAuth, updateMe);
