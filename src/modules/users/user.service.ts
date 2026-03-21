// src/modules/users/user.service.ts

import { pool } from "../../config/db";

// 8. Get all users service
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
    if (result.rows.length === 0) {
      throw new Error("User not found");
    }
    const { password, ...safeUser } = result.rows[0];
    return {id: safeUser.id, name: safeUser.name, email: safeUser.email, phone: safeUser.phone, role: safeUser.role };
  } catch (err) {
    throw new Error("Failed to fetch user");
  }
};

// 9. Update user profile service - admin and user himself
const updateUser = async (id: number, userData: any) => {
  const { name, email, phone, role } = userData;
  try {
    const updates: string[] = [];
    const values: any[] = [];
    let index = 1;

    if (name !== undefined) {
      updates.push(`name = $${index++}`);
      values.push(name);
    }

    if (email !== undefined) {
      updates.push(`email = $${index++}`);
      values.push(email);
    }

    if (phone !== undefined) {
      updates.push(`phone = $${index++}`);
      values.push(phone);
    }

    if (role !== undefined) {
      updates.push(`role = $${index++}`);
      values.push(role);
    }

    updates.push("updated_at = NOW()");
    const query = `UPDATE users SET ${updates.join(", ")} WHERE id = $${index} RETURNING *`;
    values.push(id);

    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      throw new Error("User not found");
    }
    const { password, ...safeUser } = result.rows[0];
    return {id: safeUser.id, name: safeUser.name, email: safeUser.email, phone: safeUser.phone, role: safeUser.role };
  } catch (err) {
    throw new Error("Failed to update user profile");
  }
};

// 10. Delete user service - admin only
const deleteUser = async (id: number) => {
  try {
    const activeBookingResult = await pool.query(
      "SELECT 1 FROM bookings WHERE customer_id = $1 AND status = 'active' LIMIT 1",
      [id],
    );

    if (activeBookingResult.rows.length > 0) {
      throw new Error("User has active bookings");
    }

    const query = "DELETE FROM users WHERE id = $1 RETURNING *";
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      throw new Error("User not found");
    }
  } catch (err) {
    if (err instanceof Error && err.message === "User has active bookings") {
      throw err;
    }
    throw new Error("Failed to delete user");
  }
};

export const userServices = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
