import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxios from "../../hooks/useAxios";

export default function VendorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { sendRequest } = useAxios();

  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
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

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const data = await sendRequest(`/vendors/${id}`, "GET");
        setVendor(data);
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

  const handleBookingChange = (e) => {
    setBooking({ ...booking, [e.target.name]: e.target.value });
  };

  const handleConfirmBooking = async () => {
    try {
      if (new Date(booking.startDate) > new Date(booking.endDate)) {
        setSnackbar({
          open: true,
          message: "End date cannot be earlier than start date!",
          type: "error",
        });
        return;
      }

      const payload = {
        vendorId: vendor._id,
        venueUnitId: booking.venueUnitId || "",
        startDate: booking.startDate,
        endDate: booking.endDate,
        totalAmount: 0,
        notes: booking.notes,
        bookingType: vendor.type,
        paymentStatus: "pending",
        bookingStatus: "pending",
      };

      await sendRequest("/bookings", "POST", payload);

      setShowModal(false);
      setSnackbar({
        open: true,
        message: "✅ Booking request sent successfully!",
        type: "success",
      });
    } catch (err) {
      console.error("❌ Booking error:", err);
      setSnackbar({
        open: true,
        message: err.message || "Booking failed.",
        type: "error",
      });
    }
  };

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

  const { userId, name, type, city, description, profilePhoto, venueUnits } =
    vendor;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6 flex justify-center">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        {/* Header Section */}
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

          {/* Book Now Button */}
          <button
            onClick={handleBookNow}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-semibold shadow-md transition-all"
          >
            Book Now
          </button>
        </div>

        {/* Vendor Details Section */}
        <div className="border-t border-gray-200 pt-6 mt-6 space-y-6">
          {/* Pricing and Type Info */}
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

            {/* Rating / Stats */}
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

          {/* Portfolio for freelancers / event teams */}
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

          {/* Venue Units (if vendor is venue owner) */}
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
            snackbar.type === "error" ? "bg-red-600" : "bg-green-600"
          }`}
        >
          {snackbar.message}
        </div>
      )}

      {/* Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Book {vendor.name}
            </h2>

            {type === "venue" && (
              <div className="mb-4">
                <label className="text-sm text-gray-600">Select Venue</label>
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
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="text-sm text-gray-600">Notes (optional)</label>
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
          </div>
        </div>
      )}
    </div>
  );
}
