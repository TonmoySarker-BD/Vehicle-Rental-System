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

export const authController = {
    signup,
};