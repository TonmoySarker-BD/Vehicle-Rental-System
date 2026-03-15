// src/modules/auth/auth.service.ts

import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";

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

// User login service
const signIn = async (email: string, password: string) => {
    try {
        const query = `SELECT * FROM users WHERE email = $1`;
        const result = await pool.query(query, [email.toLowerCase()]);
        if (result.rows.length === 0) {
            throw new Error("User not found");
        }
        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Invalid credentials");
        }

        const token = jwt.sign({ userId: user.id, name: user.name, email: user.email, role: user.role }, config.jwtSecret, {
            expiresIn: "7d",
        }); 

        const { password: _password, ...safeUser } = user;
        return { ...safeUser, token };
    } catch (err) {
        if (err instanceof Error) {
            throw err;
        }
        throw new Error("Failed to sign in");
    }
};

export const authServices = {
    signup,
    signIn,
};