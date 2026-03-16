// src/modules/users/user.routes.ts

import express, { Request, Response } from "express";
import { userControllers } from "./user.controller";
import auth from "../../middleware/auth";

const router = express.Router();

// Get all users admin only
router.get("/", auth("admin"), userControllers.getAllUsers );

// Get single user by ID  admin and user himself
router.get("/:id", auth("admin", "customer"), userControllers.getUserById );

export const userRoutes = router;
