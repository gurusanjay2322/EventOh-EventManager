import { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";

export default function VendorDashboard() {
  const { sendRequest } = useAxios();
  const [vendor, setVendor] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Fetch vendor profile & bookings
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [vendorRes, bookingsRes] = await Promise.all([
          sendRequest("/vendors/myProfile", "GET"),
          sendRequest("/bookings", "GET"),
        ]);
        setVendor(vendorRes.vendor || vendorRes);
        setBookings(bookingsRes.bookings || []);
      } catch (err) {
        console.error("❌ Dashboard Load Error:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
        console.log(bookings);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading)
    return <p className="text-center py-20 text-gray-500 animate-pulse">Loading dashboard...</p>;

  if (error)
    return <p className="text-center py-20 text-red-500">⚠️ {error}</p>;

  if (!vendor)
    return <p className="text-center py-20 text-gray-500">No vendor profile found 😢</p>;

  const totalVenues = vendor.venueUnits?.length || 0;
  const verifiedVenues = vendor.venueUnits?.filter((v) => v.verified).length || 0;
  const pendingVenues = totalVenues - verifiedVenues;

  // 🧾 Booking stats
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter((b) => b.bookingStatus === "confirmed").length;
  const pendingBookings = bookings.filter((b) => b.bookingStatus === "pending").length;
  const cancelledBookings = bookings.filter((b) => b.bookingStatus === "cancelled").length;

  // 💰 Earnings summary (based on confirmed bookings)
  const totalEarnings = bookings
    .filter((b) => b.bookingStatus === "confirmed")
    .reduce((sum, b) => sum + (b.advanceAmount || 0), 0);

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-semibold text-gray-900">
          Welcome, {vendor.name || "Vendor"} 👋
        </h1>
        <p className="text-gray-600">
          Manage your venues, view bookings, and track performance.
        </p>
      </header>

      {/* Stats Section */}
      <section className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        <StatCard label="Total Venues" value={totalVenues} color="blue" />
        <StatCard label="Verified Venues" value={verifiedVenues} color="green" />
        <StatCard label="Pending Verifications" value={pendingVenues} color="yellow" />
        <StatCard label="Total Bookings" value={totalBookings} color="purple" />
      </section>

      {/* Bookings Overview */}
      <section className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        <StatCard label="Confirmed Bookings" value={confirmedBookings} color="green" />
        <StatCard label="Pending Bookings" value={pendingBookings} color="yellow" />
        <StatCard label="Cancelled Bookings" value={cancelledBookings} color="red" />
        <StatCard label="Total Earnings (Advance)" value={`₹${totalEarnings}`} color="indigo" />
      </section>

      {/* Venue List */}
      <section className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Venues 🏛️</h2>
        {vendor.venueUnits?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {vendor.venueUnits.map((venue) => (
              <div
                key={venue._id}
                className="border p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
              >
                <h3 className="font-medium text-gray-800">{venue.title}</h3>
                <p className="text-sm text-gray-500">Capacity: {venue.capacity}</p>
                <p className="text-sm text-gray-500">Price: ₹{venue.pricePerDay}</p>
                <span
                  className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                    venue.verified
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {venue.verified ? "Verified" : "Pending"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">You haven’t added any venues yet.</p>
        )}
      </section>

      {/* Recent Bookings */}
      <section className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings 📅</h2>
        {bookings.length === 0 ? (
          <p className="text-gray-500">No bookings yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-indigo-50 text-gray-700 text-left">
                <tr>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Dates</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 6).map((b) => (
                  <tr key={b._id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-800">
                      {b.customerId?.name || "N/A"}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(b.startDate).toLocaleDateString()} →{" "}
                      {new Date(b.endDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      ₹{b.totalAmount}{" "}
                      <span className="text-xs text-gray-500">
                        (Advance ₹{b.advanceAmount})
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          b.bookingStatus === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : b.bookingStatus === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : b.bookingStatus === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {b.bookingStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value, color }) {
  const colorMap = {
    blue: "text-blue-600 bg-blue-50",
    green: "text-green-600 bg-green-50",
    yellow: "text-yellow-600 bg-yellow-50",
    red: "text-red-600 bg-red-50",
    purple: "text-purple-600 bg-purple-50",
    indigo: "text-indigo-600 bg-indigo-50",
  };

  return (
    <div
      className={`p-6 rounded-xl shadow-sm border border-gray-100 ${colorMap[color]} hover:shadow-md transition`}
    >
      <h2 className="text-2xl font-semibold">{value}</h2>
      <p className="text-sm">{label}</p>
    </div>
  );
}
