// src/modules/vehicles/vehicles.service.ts
import { pool } from "../../config/db";

// 3. Create Vehicle service - admin only
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

// 4. Get all vehicles service
const getAllVehicles = async () => {
  try {
    const result = await pool.query(
      "SELECT id, vehicle_name, type, registration_number, daily_rent_price, availability_status FROM vehicles",
    );

    return result.rows;
  } catch (err) {
    throw new Error("Failed to fetch vehicles");
  }
};

// 5. Get Vehicle by ID service
const getVehicleById = async (vehicleId: string) => {
  try {
    const result = await pool.query(
      "SELECT id, vehicle_name, type, registration_number, daily_rent_price, availability_status FROM vehicles WHERE id = $1",
      [vehicleId],
    );
    return {
      id: result.rows[0].id,
      vehicle_name: result.rows[0].vehicle_name,
      type: result.rows[0].type,
      registration_number: result.rows[0].registration_number,
      daily_rent_price: Number(result.rows[0].daily_rent_price),
      availability_status: result.rows[0].availability_status,
    };
  } catch (err) {
    throw new Error("Vehicle not found");
  }
};

// 6. Update Vehicle service - admin only
const updateVehicle = async (vehicleId: string, updateData: any) => {
  const safeUpdateData = updateData ?? {};
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = safeUpdateData;

  const fieldsToUpdate = [];
  const values = [];
  let index = 1;

  if (vehicle_name !== undefined) {
    fieldsToUpdate.push(`vehicle_name = $${index}`);
    values.push(vehicle_name);
    index++;
  }
  if (type !== undefined) {
    fieldsToUpdate.push(`type = $${index}`);
    values.push(type);
    index++;
  }
  if (registration_number !== undefined) {
    fieldsToUpdate.push(`registration_number = $${index}`);
    values.push(registration_number);
    index++;
  }
  if (daily_rent_price !== undefined) {
    fieldsToUpdate.push(`daily_rent_price = $${index}`);
    values.push(daily_rent_price);
    index++;
  }
  if (availability_status !== undefined) {
    fieldsToUpdate.push(`availability_status = $${index}`);
    values.push(availability_status);
    index++;
  }
  if (fieldsToUpdate.length === 0) {
    throw new Error("No valid fields to update");
  }

  const query =`UPDATE vehicles SET ${fieldsToUpdate.join(", ")} WHERE id = $${index} RETURNING *`;
  
  try {
    const result = await pool.query(query, [...values, vehicleId]);
    if (result.rows.length === 0) {
      throw new Error("Vehicle not found");
    }

    return {
      id: result.rows[0].id,
      vehicle_name: result.rows[0].vehicle_name,
      type: result.rows[0].type,
      registration_number: result.rows[0].registration_number,
      daily_rent_price: Number(result.rows[0].daily_rent_price),
      availability_status: result.rows[0].availability_status,
    };
  } catch (err) {
    throw new Error("Failed to update vehicle");
  }
};

// 7. Delete Vehicle service - admin only

export const vehicleServices = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
};
