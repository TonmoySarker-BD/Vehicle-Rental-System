// src/modules/users/user.controller.ts

import { Request, Response } from "express";
import { userServices } from "./user.service";

// 8. Get All Users controller - admin only
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getAllUsers();
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

// Get Single User by ID controller - admin and user himself
const getUserById = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    const result = await userServices.getUserById(userId as unknown as number);
    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
};

// 9. Update user profile controller - admin and user himself
const updateUser = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const { name, email, phone, role } = req.body;
  if (name === undefined && email === undefined && phone === undefined && role === undefined) {
    res.status(400).json({
      success: false,
      message: "No updatable fields provided",
    });
    return;
  }
  try {
    const result = await userServices.updateUser(
      userId as unknown as number,
      req.body,
    );
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result
    });
  } catch (err) {
    if (err instanceof Error && err.message === "User not found") {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }
    res.status(500).json({
      success: false,
      message: "Failed to update user profile",
    });
  }
};

// 10. Delete User controller - admin only
const deleteUser = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  try {
    await userServices.deleteUser(userId as unknown as number);
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    if (err instanceof Error && err.message === "User has active bookings") {
      res.status(409).json({
        success: false,
        message: "User has active bookings",
      });
      return;
    }
    if (err instanceof Error && err.message === "User not found") {
      res.status(404).json({  
        success: false,
        message: "User not found",
        error: err instanceof Error ? err.message : "Unknown error",
      });
      return;
    }
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
};

export const userController = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
