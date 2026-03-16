// src/modules/vehicles/vehicles.route.ts
import { Router } from "express";
import { vehicleController } from "./vehicles.controller";
import auth from "../../middleware/auth";

const router = Router();

// 3. Create Vehicle Route - admin only
router.post("/", auth("admin"), vehicleController.createVehicle );

// 4. Get all vehicles Route - public
router.get("/", vehicleController.getAllVehicles);

// 5. Get Vehicle by ID Route - public
router.get("/:vehicleId", vehicleController.getVehicleById);

export const vehicleRoutes = router;