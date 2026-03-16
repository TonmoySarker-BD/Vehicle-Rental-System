// src/modules/users/user.controller.ts

import { Request, Response } from "express";
import { userServices } from "./user.service";

// Get all users controller - admin only
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

// Get single user by ID controller - admin and user himself
const getUserById = async (req: Request, res: Response) => {
  const userId = req.params.id;

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

export const userControllers = { getAllUsers, getUserById };
