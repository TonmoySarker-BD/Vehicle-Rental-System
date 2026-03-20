// src/modules/bookings/bookings.service.ts
import { pool } from "../../config/db";

// Auto-return expired bookings
const autoReturnExpiredBookings = async (client: any) => {
  await client.query(
    "WITH updated AS (UPDATE bookings SET status = 'returned' WHERE status = 'active' AND rent_end_date < CURRENT_DATE RETURNING vehicle_id) UPDATE vehicles SET availability_status = 'available' WHERE id IN (SELECT vehicle_id FROM updated)",
  );
};

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
    await client.query("BEGIN");
    await autoReturnExpiredBookings(client);
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
    const data = bookingsResult.rows.map((booking) => ({
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
    await client.query("COMMIT");
    return data;
  } catch (error) {
    await client.query("ROLLBACK");
    throw new Error(error instanceof Error ? error.message : "Failed to retrieve bookings");
  } finally {
    client.release();
  }
};

// 13. Update Booking controller - admin and customer (customer can only update their own bookings)
const updateBooking = async (bookingId: string, updateData: Record<string, unknown>, user: Record<string, unknown>) => {
  const { userId, role } = user;
  const client = await pool.connect();
  try {
    const status = typeof updateData.status === "string" ? updateData.status.toLowerCase() : "";
    if (role === "admin" && status !== "returned") {
      throw new Error("Admin can only mark bookings as returned");
    }
    if (role === "customer" && status !== "cancelled") {
      throw new Error("Customer can only cancel their booking");
    }

    await client.query("BEGIN");

    const bookingResult = await client.query(
      role === "admin"
        ? "SELECT * FROM bookings WHERE id = $1"
        : "SELECT * FROM bookings WHERE id = $1 AND customer_id = $2",
      role === "admin" ? [bookingId] : [bookingId, userId],
    );

    if (bookingResult.rows.length === 0) {
      throw new Error("Booking not found or access denied");
    }

    const booking = bookingResult.rows[0];
    if (booking.status !== "active") {
      throw new Error("Only active bookings can be updated");
    }

    const updatedBookingResult = await client.query(
      "UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *",
      [status, bookingId],
    );

    if (status === "returned" || status === "cancelled") {
      await client.query(
        "UPDATE vehicles SET availability_status = $1 WHERE id = $2",
        ["available", booking.vehicle_id],
      );
    }

    await client.query("COMMIT");

    const updatedBooking = updatedBookingResult.rows[0];
    if (status === "returned") {
      return {
        id: updatedBooking.id,
        customer_id: updatedBooking.customer_id,
        vehicle_id: updatedBooking.vehicle_id,
        rent_start_date: updatedBooking.rent_start_date,
        rent_end_date: updatedBooking.rent_end_date,
        total_price: Number(updatedBooking.total_price),
        status: updatedBooking.status,
        vehicle: {
          availability_status: "available",
        },
      };
    }

    return {
      id: updatedBooking.id,
      customer_id: updatedBooking.customer_id,
      vehicle_id: updatedBooking.vehicle_id,
      rent_start_date: updatedBooking.rent_start_date,
      rent_end_date: updatedBooking.rent_end_date,
      total_price: Number(updatedBooking.total_price),
      status: updatedBooking.status,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw new Error(error instanceof Error ? error.message : "Failed to update booking");
  } finally {
    client.release();
  }
};

export const bookingServices = {
  createBooking,
  getAllBookings,
  updateBooking
};
