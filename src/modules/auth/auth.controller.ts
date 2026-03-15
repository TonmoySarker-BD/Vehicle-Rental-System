// src/modules/auth/auth.controller.ts
import { Request, Response } from "express";
import { authServices } from "./auth.service";

// signup controller
const signup = async (req: Request, res: Response) => {
    const { name, email, password, phone, role } = req.body;
    try {
        const result = await authServices.signup(name, email, password, phone, role);
        res.status(201).json({
            status: "success",
            data: result,
        });
    } catch (err) {
        console.error("Error creating user:", err);
        res.status(500).json({
            status: "error",
            message: "Failed to create user",
        });
    }
};

// sign in controller
const signIn = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const result = await authServices.signIn(email, password);
        res.status(200).json({
            status: "success",
            data: result,
        });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to sign in";
        const statusCode = message === "Invalid credentials" || message === "User not found" ? 401 : 500;
        res.status(statusCode).json({
            status: "error",
            message,
        });
    }
};

export const authController = {
    signup,
    signIn,
};