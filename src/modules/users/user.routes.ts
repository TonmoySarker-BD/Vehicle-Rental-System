// src/modules/users/user.routes.ts

import express, { Request, Response } from "express";
import { userControllers } from "./user.controller";
import auth from "../../middleware/auth";

const router = express.Router();

// Get all users
router.get("/", auth("admin"), userControllers.getAllUsers );

// Get single user by ID
router.get("/:id", userControllers.getUserById );

export const userRoutes = router;
