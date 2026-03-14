// src/modules/users/user.service.ts

import { pool } from "../../config/db";
import bcrypt from "bcryptjs";

// User registration service
const createUser = async (
  name: string,
  email: string,
  password: string,
  phone: string,
  role: string,
) => {
  try {
    const query = `INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING *`;


    const values = [
      name,
      email.toLowerCase(),
      await bcrypt.hash(password, 10),
      phone,
      role || "customer",
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    console.error("Error creating user:", err);
    throw new Error("Failed to create user");
  }
};

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
  createUser,
  getAllUsers,
  getUserById,
};
