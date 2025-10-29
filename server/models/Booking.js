import mongoose from "mongoose";

const { Schema } = mongoose;

const BookingSchema = new Schema({
  customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  vendorId: { type: Schema.Types.ObjectId, ref: "Vendor", required: true },

  // For venues that have multiple halls/units
  venueUnitId: { type: Schema.Types.ObjectId, ref: "Vendor.venueUnits" },

  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },

  totalAmount: { type: Number, required: true },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "cancelled", "refunded"],
    default: "pending",
  },
  bookingStatus: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "completed"],
    default: "pending",
  },

  // Optional info
  notes: String,

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Booking", BookingSchema);
