// src/modules/users/user.routes.ts

import express, { Request, Response } from "express";
import auth from "../../middleware/auth";
import { userController } from "./user.controller";

const router = express.Router();

// Get all users admin only
router.get("/", auth("admin"), userController.getAllUsers );

// Get single user by ID  admin and user himself
router.get("/:userId", auth("admin", "customer"), userController.getUserById );

// Update user profile - admin and user himself
router.put("/:userId", auth("admin", "customer"), userController.updateUser );

// Delete user - admin only
router.delete("/:userId", auth("admin"), userController.deleteUser );

export const userRoutes = router;
