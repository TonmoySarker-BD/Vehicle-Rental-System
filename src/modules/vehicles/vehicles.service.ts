// src/modules/vehicles/vehicles.service.ts
import { pool } from "../../config/db";

// Create Vehicle service - admin only
const createVehicle = async (vehicleData: any) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = vehicleData;
  try {
    const query =
      "INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES ($1, $2, $3, $4, $5) RETURNING *";
    const values = [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ];

    const result = await pool.query(query, values);
    const response = {
      id: result.rows[0].id,
      vehicle_name: result.rows[0].vehicle_name,
      type: result.rows[0].type,
      registration_number: result.rows[0].registration_number,
      daily_rent_price: Number(result.rows[0].daily_rent_price),
      availability_status: result.rows[0].availability_status,
    };

    return response;
  } catch (err) {
    throw new Error("Failed to create vehicle");
  }
};

// Get all vehicles service
const getAllVehicles = async () => {
  try {
    const result = await pool.query("SELECT id, vehicle_name, type, registration_number, daily_rent_price, availability_status FROM vehicles");

    return result.rows;
  } catch (err) {
    throw new Error("Failed to fetch vehicles");
  }
};

export const vehicleServices = {
  createVehicle,
  getAllVehicles,
};
