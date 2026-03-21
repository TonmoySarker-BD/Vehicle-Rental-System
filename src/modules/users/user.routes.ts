// src/modules/users/user.routes.ts

import express, { Request, Response } from "express";
import auth from "../../middleware/auth";
import { userController } from "./user.controller";

const router = express.Router();

// 8. Get All Users admin only
router.get("/", auth("admin"), userController.getAllUsers );

// 9. Update User - admin and user himself
router.put("/:userId", auth("admin", "customer"), userController.updateUser );

// Get single user by ID  admin and user himself
// router.get("/:userId", auth("admin", "customer"), userController.getUserById );


// 10. Delete User - admin only
router.delete("/:userId", auth("admin"), userController.deleteUser );

export const userRoutes = router;