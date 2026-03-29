import express from "express";
import { getCurrentLocationWeather } from "../controllers/location.controller.js";

export const locationRouter = express.Router();

locationRouter.post("/weather", getCurrentLocationWeather);
