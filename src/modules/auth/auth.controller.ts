// src/modules/auth/auth.controller.ts
import { Request, Response } from "express";
import { authServices } from "./auth.service";

// 1. User Registration Controller
const signup = async (req: Request, res: Response) => {
  const { name, email, password, phone, role } = req.body;
  try {
    const result = await authServices.signup(
      name,
      email,
      password,
      phone,
      role,
    );
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create user";
    const statusCode = message === "Email already exists" ? 409 : 500;
    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};

// 2. User Login Controller
const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const result = await authServices.signIn(email, password);
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to sign in";
    const statusCode =
      message === "Invalid credentials" || message === "User not found"
        ? 401
        : 500;
    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};

export const authController = {
  signup,
  signIn,
};
