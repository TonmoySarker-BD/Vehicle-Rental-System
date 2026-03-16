// src/modules/users/user.controller.ts

import { Request, Response } from "express";
import { userServices } from "./user.service";

// Get all users controller
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getAllUsers();
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch users",
    });
  }
};

// Get single user by ID controller
const getUserById = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id as string);
    try {
        const result = await userServices.getUserById(userId);
        if (!result) {
            return res.status(404).json({
                status: "error",
                message: "User not found",
            });
        }
        res.status(200).json({
            status: "success",
            data: result,
        });
    } catch (err) {
        console.error("Error fetching user by ID:", err);
        res.status(500).json({
            status: "error",
            message: "Failed to fetch user",
        });
    }
};

export const userControllers = { getAllUsers, getUserById };
