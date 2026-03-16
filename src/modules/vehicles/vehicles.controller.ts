// src/modules/vehicles/vehicles.controller.ts

import { Request, Response } from "express";
import { vehicleServices } from "./vehicles.service";

// Create Vehicle controller - admin only
const createVehicle = async (req: Request, res: Response) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = req.body;
  if (
    !vehicle_name ||
    !type ||
    !registration_number ||
    !daily_rent_price ||
    availability_status === undefined
  ) {
    res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
    return;
  }
  try {
    const result = await vehicleServices.createVehicle(req.body);
    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to create vehicle",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
};

// Get all vehicles controller - public
const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.getAllVehicles();
    res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch vehicles",
    });
  }
};

export const vehicleController = {
  createVehicle,
  getAllVehicles,
};
