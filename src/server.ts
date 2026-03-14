import express, { NextFunction, Request, Response } from "express";
import { Pool } from "pg";
import config from "./config";
import initDB, { pool } from "./config/db";
import logger from "./middleware/logger";
import { userRoutes } from "./modules/users/user.routes";
import { authRoutes } from "./modules/auth/auth.route";

// Initialize Express app
const app = express();
const port = config.port;

// Middleware to parse JSON bodies
app.use(express.json());
// initialize the database
initDB();

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
    path: req.originalUrl,
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Vehicle Rental System listening on port ${port}`);
});
