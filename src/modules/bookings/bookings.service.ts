// src/modules/bookings/bookings.service.ts
import { pool } from "../../config/db";

// 11. Create Booking controller - admin and customer
const createBooking = async (bookingData: any) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } =bookingData;

  const rentStart = new Date(rent_start_date);
  const rentEnd = new Date(rent_end_date);

  const msPerDay = 24 * 60 * 60 * 1000;
  const numberOfDays = Math.ceil((rentEnd.getTime() - rentStart.getTime()) / msPerDay);

  if (!Number.isFinite(numberOfDays) || numberOfDays <= 0) {
    throw new Error("Invalid rent dates");
  }
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const vehicleResult = await client.query(
      "SELECT vehicle_name, daily_rent_price, availability_status FROM vehicles WHERE id = $1",
      [vehicle_id],
    );

    if (vehicleResult.rows.length === 0) {
      throw new Error("Vehicle not found");
    }
    const vehicle = vehicleResult.rows[0];
    if (vehicle.availability_status !== "available") {
      throw new Error("Vehicle is not available");
    }

    const dailyRentPrice = Number(vehicle.daily_rent_price);
    const totalPrice = dailyRentPrice * numberOfDays;

    const bookingResult = await client.query(
      "INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [
        customer_id,
        vehicle_id,
        rent_start_date,
        rent_end_date,
        totalPrice,
        "active",
      ],
    );

    await client.query(
      "UPDATE vehicles SET availability_status = $1 WHERE id = $2",
      ["booked", vehicle_id],
    );

    await client.query("COMMIT");

    return {
      id: bookingResult.rows[0].id,
      customer_id: bookingResult.rows[0].customer_id,
      vehicle_id: bookingResult.rows[0].vehicle_id,
      rent_start_date: bookingResult.rows[0].rent_start_date,
      rent_end_date: bookingResult.rows[0].rent_end_date,
      total_price: Number(bookingResult.rows[0].total_price),
      status: bookingResult.rows[0].status,
      vehicle: {
        vehicle_name: vehicle.vehicle_name,
        daily_rent_price: dailyRentPrice,
      },
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw new Error(error instanceof Error ? error.message : "Failed to create booking");
  } finally {
    client.release();
  }
};

// 12. Get all bookings controller - admin and customer (customer can only see their own bookings)
const getAllBookings = async (user: Record<string, unknown>) => {
  const { userId, role } = user;
  const client = await pool.connect();
  try {
    let bookingsResult;
    if (role === "admin") {
      bookingsResult = await client.query(
        "SELECT b.*, c.name AS customer_name, c.email AS customer_email, v.vehicle_name, v.registration_number, v.type FROM bookings b JOIN users c ON b.customer_id = c.id JOIN vehicles v ON b.vehicle_id = v.id",
      );
      return bookingsResult.rows.map((booking) => ({
      id: booking.id,
      customer_id: booking.customer_id,
      vehicle_id: booking.vehicle_id,
      rent_start_date: booking.rent_start_date,
      rent_end_date: booking.rent_end_date,
      total_price: Number(booking.total_price),
      status: booking.status,
      customer: {
        name: booking.customer_name,
        email: booking.customer_email
      },
      vehicle: {
        vehicle_name: booking.vehicle_name,
        registration_number: booking.registration_number,
        type: booking.type,
      },
    }));
    } else {
      bookingsResult = await client.query(
        "SELECT b.*, v.vehicle_name, v.registration_number, v.type FROM bookings b JOIN vehicles v ON b.vehicle_id = v.id WHERE b.customer_id = $1",
        [userId],
      );
    }
    return bookingsResult.rows.map((booking) => ({
      id: booking.id,
      customer_id: booking.customer_id,
      vehicle_id: booking.vehicle_id,
      rent_start_date: booking.rent_start_date,
      rent_end_date: booking.rent_end_date,
      total_price: Number(booking.total_price),
      status: booking.status,
      vehicle: {
        vehicle_name: booking.vehicle_name,
        registration_number: booking.registration_number,
        type: booking.type,
      },
    }));
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to retrieve bookings");
  } finally {
    client.release();
  }
};

export const bookingServices = {
  createBooking,
  getAllBookings,
};
