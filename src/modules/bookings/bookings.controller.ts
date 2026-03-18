// src/modules/bookings/bookings.controller.ts
import e, { Request, Response } from "express";
import { bookingServices } from "./bookings.service";

// 11. Create Booking controller - admin and customer
const createBooking = async (req: Request, res: Response) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = req.body;
  if (!customer_id || !vehicle_id || !rent_start_date || !rent_end_date) {
    res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
    return;
  }
  try {
    const result = await bookingServices.createBooking(req.body);
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to create booking",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
};

export const bookingController = {
    createBooking,
};
