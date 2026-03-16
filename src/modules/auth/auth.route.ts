// src/modules/auth/auth.route.ts
import express from "express";
import { authController } from "./auth.controller";
export const authRoutes = express.Router();

// 1. User registration route
authRoutes.post("/signup", authController.signup);
// 2. User login route
authRoutes.post("/signin", authController.signIn);