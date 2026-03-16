// src/modules/users/user.service.ts

import { pool } from "../../config/db";

// Get all users service
const getAllUsers = async () => {
  try {
    const result = await pool.query("SELECT * FROM users");
    
    const safeResult = result.rows.map((user) => {
      const { password, ...safeUser } = user;

      return {id: safeUser.id, name: safeUser.name, email: safeUser.email, phone: safeUser.phone, role: safeUser.role };
    });

    return safeResult;
  } catch (err) {
    throw new Error("Failed to fetch users");
  }
};

// Get single user by ID service - admin and user himself
const getUserById = async (id: number) => {

  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    const { password, ...safeUser } = result.rows[0];
    return {id: safeUser.id, name: safeUser.name, email: safeUser.email, phone: safeUser.phone, role: safeUser.role };
  } catch (err) {
    throw new Error("Failed to fetch user");
  }
};

export const userServices = {
  getAllUsers,
  getUserById,
};
