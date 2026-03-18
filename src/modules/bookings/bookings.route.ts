// src/modules/bookings/bookings.route.ts
import { Router } from "express";
import { bookingController } from "./bookings.controller";
import auth from "../../middleware/auth";

const router = Router();

// 11. Create Booking Route - admin and customer
router.post("/", auth("admin" , "customer"), bookingController.createBooking);

// 12. Get all bookings Route - admin and customer (customer can only see their own bookings)
// router.get("/", auth("admin", "customer"), bookingController.getAllBookings);

// 13. Update Booking Route - admin only
// router.put("/:bookingId", auth("admin"), bookingController.updateBooking);

export const bookingRoutes = router;