import express, { Request, Response } from "express";
import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

// Initialize Express app
const app = express();
const port = 5000;

// Middleware to parse JSON bodies
app.use(express.json());

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      role VARCHAR(20) NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CHECK (email = lower(email))
      );
    `);
    console.log("Database initialized successfully.");
  } catch (err) {
    console.error("Error initializing database:", err);
  }
};

// initialize the database
initDB();

// Basic route to check if the server is running
app.get("/", (req: Request, res: Response) => {
  res.json({
    status: "success",
    message: "Vehicle Rental System API is running!",
  });
});

// Basic route to check if the server is running
app.get("/", (req: Request, res: Response) => {
  res.json({
    status: "success",
    message: "Vehicle Rental System API is running!",
  });
});

// Example route to handle POST requests
app.post("/", (req: Request, res: Response) => {
  const { name, email } = req.body;
  res.json({
    status: "success",
    message: `Received data for ${name} with email ${email}`,
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Vehicle Rental System listening on port ${port}`);
});
