// src/modules/vehicles/vehicles.controller.ts

import e, { Request, Response } from "express";
import { vehicleServices } from "./vehicles.service";

// 3. Create Vehicle controller - admin only
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

// 4. Get all vehicles controller - public
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

// 5. Get Vehicle by ID controller - public
const getVehicleById = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;
  try {
    const result = await vehicleServices.getVehicleById(vehicleId as string);
    res.status(200).json({
      success: true,
      message: "Vehicle retrieved successfully",
      data: result,
    });
  } catch (err) {
    if (err instanceof Error && err.message === "Vehicle not found") {
      res.status(404).json({
        success: false,
        message: "Vehicle not found",
        error: err.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to fetch vehicle",
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }
};

export const vehicleController = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
};
