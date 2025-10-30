import express from "express";
import Booking from "../models/Booking.js";
import {
  createBooking,
  getBookings,
  updateBookingStatus,
  payRemainingAmount
} from "../controllers/BookingController.js";
import VerifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// ✅ Mark payment complete
router.put("/:id/mark-paid", VerifyToken, async (req, res) => {
  console.log("🟢 /mark-paid route hit");
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.paymentStatus = "paid";
    booking.bookingStatus = "completed";
    await booking.save();

    res.status(200).json({ message: "Payment marked as completed", booking });
  } catch (err) {
    console.error("❌ Mark Payment Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post("/", VerifyToken, createBooking);
router.get("/", VerifyToken, getBookings);
router.put("/:id/status", VerifyToken, updateBookingStatus);
router.post("/:id/pay-remaining", VerifyToken, payRemainingAmount);

export default router;
