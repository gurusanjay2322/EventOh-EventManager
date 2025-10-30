import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxios from "../../hooks/useAxios";
import { loadStripe } from "@stripe/stripe-js";
export default function VendorDetails() {
  const stripePromise = loadStripe(import.meta.env.VITE_API_STRIPE_PUBLIC_KEY);
  const { id } = useParams();
  const navigate = useNavigate();
  const { sendRequest } = useAxios();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const customerEmail = storedUser?.email;
  const [bookedDates, setBookedDates] = useState([]);

  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showAdvanceStep, setShowAdvanceStep] = useState(false);
  const [paymentBreakdown, setPaymentBreakdown] = useState(null);

  const [booking, setBooking] = useState({
    venueUnitId: "",
    startDate: "",
    endDate: "",
    notes: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "",
  });

  // 🔹 Fetch vendor details
  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const data = await sendRequest(`/vendors/${id}`, "GET");
        setVendor(data);

        // ✅ Fetch booked dates
        const response = await sendRequest(
          `/vendors/${id}/booked-dates`,
          "GET"
        );
        const bookedArray = Array.isArray(response)
          ? response
          : response.bookedDates || []; // handle both response shapes

        setBookedDates(bookedArray);
        console.log(bookedArray);
      } catch (err) {
        console.error("❌ Failed to fetch vendor:", err);
        setError("Failed to load vendor details.");
      } finally {
        setLoading(false);
      }
    };
    fetchVendor();
  }, [id]);

  const handleBookNow = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setSnackbar({
        open: true,
        message: "Please log in to make a booking.",
        type: "error",
      });
      setTimeout(() => navigate("/login"), 1500);
      return;
    }
    setShowModal(true);
  };

  // 📦 Handle booking input change
  const handleBookingChange = (e) => {
    setBooking({ ...booking, [e.target.name]: e.target.value });
  };

  const handleConfirmBooking = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser || !storedUser.id) {
        setSnackbar({
          open: true,
          message: "Please log in before booking.",
          type: "error",
        });
        navigate("/login");
        return;
      }

      if (!booking.startDate || !booking.endDate) {
        setSnackbar({
          open: true,
          message: "Please select both start and end dates.",
          type: "error",
        });
        return;
      }

      if (new Date(booking.endDate) < new Date(booking.startDate)) {
        setSnackbar({
          open: true,
          message: "End date cannot be before start date.",
          type: "error",
        });
        return;
      }

      // 🏛 For venues, ensure a unit is selected
      if (vendor.type === "venue" && !booking.venueUnitId) {
        setSnackbar({
          open: true,
          message: "Please select a venue unit.",
          type: "error",
        });
        return;
      }

      // ✅ Check date overlap
      if (Array.isArray(bookedDates)) {
        const isOverlapping = bookedDates.some(({ startDate, endDate }) => {
          const bookedStart = new Date(startDate);
          const bookedEnd = new Date(endDate);
          const selectedStart = new Date(booking.startDate);
          const selectedEnd = new Date(booking.endDate);
          return selectedStart <= bookedEnd && selectedEnd >= bookedStart;
        });

        if (isOverlapping) {
          setSnackbar({
            open: true,
            message:
              "Selected dates are already booked. Please choose another range.",
            type: "error",
          });
          return;
        }
      }

      // ✅ Calculate total, advance, remaining amounts
      const days =
        (new Date(booking.endDate) - new Date(booking.startDate)) /
        (1000 * 60 * 60 * 24);

      const venuePrice =
        vendor.type === "venue"
          ? vendor.venueUnits.find((v) => v._id === booking.venueUnitId)
              ?.pricePerDay || 0
          : vendor.pricing?.basePrice || 0;

      const totalAmount = days * venuePrice;
      const advanceAmount = totalAmount * 0.2;
      const remainingAmount = totalAmount - advanceAmount;

      setPaymentBreakdown({
        totalAmount,
        advanceAmount,
        remainingAmount,
        percentage: "20%",
        note: "Pay 20% advance now to confirm your booking. The remaining 80% must be paid after the event date.",
      });

      // ✅ Prepare booking payload
      const payload = {
        vendorId: id,
        customerId: storedUser.id,
        bookingType: vendor.type,
        startDate: booking.startDate,
        endDate: booking.endDate,
        totalAmount,
        advanceAmount,
        remainingAmount,
        notes: booking.notes,
        status: "pending_advance_payment",
      };

      if (vendor.type === "venue" && booking.venueUnitId) {
        payload.venueUnitId = booking.venueUnitId;
      }

      // ✅ Create the booking
      await sendRequest("/bookings", "POST", payload);

      // 🧩 PATCH vendor availability (mark selected dates as booked)
      const token = localStorage.getItem("token");
      const selectedDates = [];
      let currentDate = new Date(booking.startDate);
      const endDate = new Date(booking.endDate);

      // Generate array of booked dates (inclusive)
      while (currentDate <= endDate) {
        selectedDates.push(currentDate.toISOString().split("T")[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }

      await fetch(
        `${import.meta.env.VITE_API_URL}/api/vendors/${id}/availability`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ bookedDates: selectedDates }),
        }
      );

      console.log("✅ Vendor availability updated:", selectedDates);

      // ✅ Move to advance payment step
      setShowAdvanceStep(true);
    } catch (error) {
      console.error("❌ Booking creation failed:", error);
      setSnackbar({
        open: true,
        message: "Something went wrong while confirming the booking.",
        type: "error",
      });
    }
  };

  // ✨ Step 2: Trigger Stripe payment
  const handleMakePayment = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("user")); // ensure we have the email

      const payload = {
        amount: paymentBreakdown.advanceAmount, // use actual advance amount
        vendorName: vendor.name,
        customerEmail: currentUser?.email,
      };

      const response = await sendRequest(
        "/payments/create-checkout-session",
        "POST",
        payload
      );

      console.log("✅ Session Response:", response);

      // ✅ Use `response.url` instead of `response.data.url`
      window.location.href = response.url;
    } catch (error) {
      console.error("❌ Payment failed:", error);
    }
  };

  // ✨ Loading states
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading vendor details...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );

  if (!vendor)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Vendor not found 😢
      </div>
    );

  const { name, type, city, description, profilePhoto, venueUnits } = vendor;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6 flex justify-center">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
          <img
            src={
              profilePhoto ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt={name}
            className="h-28 w-28 rounded-full object-cover border-2 border-indigo-200 shadow"
          />
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-3xl font-semibold text-gray-900">{name}</h1>
            <p className="text-indigo-600 font-medium capitalize mt-1">
              {type?.replace("_", " ")}
            </p>
            <p className="text-gray-500">{city}</p>
            <p className="mt-3 text-gray-700 max-w-2xl">{description}</p>
          </div>
          <button
            onClick={handleBookNow}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-semibold shadow-md transition-all"
          >
            Book Now
          </button>
        </div>

        {/* Vendor Details */}
        <div className="border-t border-gray-200 pt-6 mt-6 space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Vendor Details 💼
              </h3>
              <p className="text-gray-600">
                <strong>Type:</strong> {type?.replace("_", " ").toUpperCase()}
              </p>
              {vendor.freelancerCategory && (
                <p className="text-gray-600">
                  <strong>Category:</strong> {vendor.freelancerCategory}
                </p>
              )}
              {vendor.contactNumber && (
                <p className="text-gray-600">
                  <strong>Contact:</strong> {vendor.contactNumber}
                </p>
              )}
              <p className="text-gray-600">
                <strong>City:</strong> {city}
              </p>
              {vendor.pricing?.basePrice && (
                <p className="text-gray-600">
                  <strong>Base Price:</strong> ₹{vendor.pricing.basePrice}{" "}
                  {vendor.pricing.currency || ""}
                </p>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex flex-col justify-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Ratings & Reviews ⭐
              </h3>
              <p className="text-gray-700">
                <strong>Rating:</strong> {vendor.rating || 0}/5
              </p>
              <p className="text-gray-700">
                <strong>Total Reviews:</strong> {vendor.totalReviews || 0}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Member since{" "}
                {new Date(vendor.createdAt).toLocaleDateString("en-IN")}
              </p>
            </div>
          </div>
          {bookedDates.length > 0 && (
            <div className="mb-4 text-sm text-gray-600 bg-gray-100 p-3 rounded-lg">
              <p className="font-medium mb-1">📅 Already booked dates:</p>
              <ul className="list-disc pl-5 space-y-1">
                {bookedDates.map((date, i) => {
                  if (typeof date === "string") {
                    return (
                      <p key={i}>📅 {new Date(date).toLocaleDateString()}</p>
                    );
                  } else {
                    return (
                      <p key={i}>
                        📅 {new Date(date.startDate).toLocaleDateString()} -{" "}
                        {new Date(date.endDate).toLocaleDateString()}
                      </p>
                    );
                  }
                })}
              </ul>
            </div>
          )}

          {vendor.portfolio?.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Portfolio 📸
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {vendor.portfolio.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt="portfolio"
                    className="rounded-lg h-40 w-full object-cover border"
                  />
                ))}
              </div>
            </div>
          )}

          {type === "venue" && vendor.venueUnits?.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Available Venues 🏛️
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {vendor.venueUnits.map((venue) => (
                  <div
                    key={venue._id}
                    className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition p-5"
                  >
                    <h3 className="text-lg font-semibold text-indigo-700 mb-2">
                      {venue.title}
                    </h3>
                    <p className="text-gray-700 mb-1">
                      <strong>Capacity:</strong> {venue.capacity}
                    </p>
                    <p className="text-gray-700 mb-1">
                      <strong>Price per day:</strong> ₹{venue.pricePerDay}
                    </p>
                    <p className="text-gray-700 mb-1">
                      <strong>Status:</strong>{" "}
                      {venue.verified ? (
                        <span className="text-green-600 font-medium">
                          Verified ✅
                        </span>
                      ) : (
                        <span className="text-red-500 font-medium">
                          Not Verified ❌
                        </span>
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Snackbar */}
      {snackbar.open && (
        <div
          className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-lg text-white ${
            snackbar.type === "error"
              ? "bg-red-600"
              : snackbar.type === "warning"
              ? "bg-yellow-500"
              : "bg-green-600"
          }`}
        >
          {snackbar.message}
        </div>
      )}

      {/* Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            {!showAdvanceStep ? (
              <>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                  Book {vendor.name}
                </h2>

                {type === "venue" && (
                  <div className="mb-4">
                    <label className="text-sm text-gray-600">
                      Select Venue
                    </label>
                    <select
                      name="venueUnitId"
                      value={booking.venueUnitId}
                      onChange={handleBookingChange}
                      className="w-full mt-1 border border-gray-300 rounded-lg p-2"
                    >
                      <option value="">Select a venue</option>
                      {venueUnits.map((v) => (
                        <option key={v._id} value={v._id}>
                          {v.title} — ₹{v.pricePerDay}/day
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-sm text-gray-600">Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={booking.startDate}
                      onChange={handleBookingChange}
                      className="w-full border border-gray-300 rounded-lg p-2"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      value={booking.endDate}
                      onChange={handleBookingChange}
                      className="w-full border border-gray-300 rounded-lg p-2"
                      min={
                        booking.startDate ||
                        new Date().toISOString().split("T")[0]
                      }
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="text-sm text-gray-600">
                    Notes (optional)
                  </label>
                  <textarea
                    name="notes"
                    value={booking.notes}
                    onChange={handleBookingChange}
                    className="w-full border border-gray-300 rounded-lg p-2"
                    rows="3"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmBooking}
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                  >
                    Confirm Booking
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                  Payment Breakdown 💸
                </h2>
                <p className="text-gray-700">
                  <strong>Total:</strong> ₹{paymentBreakdown.totalAmount}
                </p>
                <p className="text-gray-700">
                  <strong>Advance ({paymentBreakdown.percentage}):</strong> ₹
                  {paymentBreakdown.advanceAmount}
                </p>
                <p className="text-gray-700 mb-4">
                  <strong>Remaining:</strong> ₹
                  {paymentBreakdown.remainingAmount}
                </p>
                <p className="text-gray-500 text-sm mb-6 italic">
                  {paymentBreakdown.note}
                </p>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleMakePayment}
                    className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold"
                  >
                    Pay ₹{paymentBreakdown.advanceAmount}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
