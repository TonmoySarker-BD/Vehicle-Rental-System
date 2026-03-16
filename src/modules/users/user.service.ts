// src/modules/users/user.service.ts

import { pool } from "../../config/db";

// Get all users service
const getAllUsers = async () => {
  try {
    const result = await pool.query("SELECT * FROM users");
    return result.rows;
  } catch (err) {
    console.error("Error fetching users:", err);
    throw new Error("Failed to fetch users");
  }
};

// Get single user by ID service
const getUserById = async (id: number) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows[0];
  } catch (err) {
    console.error("Error fetching user by ID:", err);
    throw new Error("Failed to fetch user");
  }
};

export const userServices = {
  getAllUsers,
  getUserById,
};
