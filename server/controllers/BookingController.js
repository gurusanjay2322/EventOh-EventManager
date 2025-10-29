import Booking from "../models/Booking.js";
import Vendor from "../models/Vendor.js";

/**
 * @desc Create a new booking
 * @route POST /api/bookings
 */
export const createBooking = async (req, res) => {
  try {
    const { vendorId, venueUnitId, startDate, endDate, totalAmount, notes } =
      req.body;
    const customerId = req.user?.id; // requires auth middleware

    if (!vendorId || !startDate || !endDate || !totalAmount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Ensure vendor exists
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    // Optional: check availability (basic example)
    const existingBooking = await Booking.findOne({
      vendorId,
      startDate: { $lt: new Date(endDate) },
      endDate: { $gt: new Date(startDate) },
      bookingStatus: { $in: ["pending", "confirmed"] },
    });

    if (existingBooking) {
      return res.status(400).json({
        message: "Vendor or venue is already booked for the selected dates",
      });
    }

    const booking = await Booking.create({
      customerId,
      vendorId,
      venueUnitId,
      startDate,
      endDate,
      totalAmount,
      notes,
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (err) {
    console.error("❌ Booking Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * @desc Get all bookings for a customer or vendor
 * @route GET /api/bookings
 */
export const getBookings = async (req, res) => {
  try {
    const { role, id } = req.user;

    const filter =
      role === "vendor" ? { vendorId: id } : { customerId: id };

    const bookings = await Booking.find(filter)
      .populate("vendorId", "name type city")
      .populate("customerId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ bookings });
  } catch (err) {
    console.error("❌ Get Bookings Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * @desc Update booking status (e.g., confirm/cancel)
 * @route PUT /api/bookings/:id/status
 */
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ["pending", "confirmed", "cancelled", "completed"];
    if (!allowed.includes(status))
      return res.status(400).json({ message: "Invalid booking status" });

    const booking = await Booking.findByIdAndUpdate(
      id,
      { bookingStatus: status },
      { new: true }
    );

    if (!booking)
      return res.status(404).json({ message: "Booking not found" });

    res.status(200).json({
      message: "Booking status updated successfully",
      booking,
    });
  } catch (err) {
    console.error("❌ Update Booking Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
