// src/modules/bookings/bookings.controller.ts
import e, { Request, Response } from "express";
import { bookingServices } from "./bookings.service";
import { JwtPayload } from "jsonwebtoken";

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

// 12. Get all bookings controller - admin and customer (customer can only see their own bookings)
const getAllBookings = async (req: Request, res: Response) => {
  try {
    const result = await bookingServices.getAllBookings(req.user as JwtPayload);
    res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve bookings",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
};

// 13. Update Booking controller - admin and customer (customer can only update their own bookings)
const updateBooking = async (req: Request, res: Response) => {
  const { bookingId } = req.params;
  try {
    const result = await bookingServices.updateBooking(bookingId as string, req.body, req.user as JwtPayload);
    const status = typeof req.body?.status === "string" ? req.body.status.toLowerCase() : "";
    let message = "Booking updated successfully";
    if (status === "cancelled") {
      message = "Booking cancelled successfully";
    }
    if (status === "returned") {
      message = "Booking marked as returned. Vehicle is now available";
    }
    res.status(200).json({
      success: true,
      message,
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update booking",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
};

export const bookingController = {
    createBooking,
    getAllBookings,
    updateBooking
};
