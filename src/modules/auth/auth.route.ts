// src/modules/auth/auth.route.ts
import express from "express";
import { authController } from "./auth.controller";
export const authRoutes = express.Router();

// User registration route
authRoutes.post("/signup", authController.signup);