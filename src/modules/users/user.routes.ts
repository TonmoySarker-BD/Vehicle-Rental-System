// src/modules/users/user.routes.ts

import express, { Request, Response } from "express";
import { userControllers } from "./user.controller";

const router = express.Router();

// User registration route
router.post("/", userControllers.createUser );

// Get all users
router.get("/", userControllers.getAllUsers );

// Get single user by ID
router.get("/:id", userControllers.getUserById );

export const userRoutes = router;
