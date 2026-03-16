// src/modules/vehicles/vehicles.route.ts
import { Router } from "express";
import { vehicleController } from "./vehicles.controller";
import auth from "../../middleware/auth";

const router = Router();

// Create Vehicle - admin only
router.post("/", auth("admin"), vehicleController.createVehicle );

// Get all vehicles - public
router.get("/", vehicleController.getAllVehicles);

export const vehicleRoutes = router;