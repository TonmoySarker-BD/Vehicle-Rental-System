// src/app.ts
import express, { Request, Response } from "express";
import { userRoutes } from "./modules/users/user.routes";
import { authRoutes } from "./modules/auth/auth.route";
import logger from "./middleware/logger";
// Initialize Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Basic route to check if the server is running
app.get("/", logger, (req: Request, res: Response) => {
  res.json({
    status: "success",
    message: "Vehicle Rental System API is running!",
  });
});

// User CRUD routes
app.use("/users", logger, userRoutes);
app.use("/api/v1/auth", logger, authRoutes);

// Not Found route
app.use( logger, (req: Request, res: Response) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
    data: null
    });
});

export default app;