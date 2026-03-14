// src/modules/auth/auth.service.ts

import { pool } from "../../config/db";
import bcrypt from "bcryptjs";

// User registration service
const signup = async (
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
        const { password: _password, ...safeUser } = result.rows[0];
        return safeUser;
    } catch (err) {
        console.error("Error creating user:", err);
        throw new Error("Failed to create user");
    }
};

export const authServices = {
    signup,
};