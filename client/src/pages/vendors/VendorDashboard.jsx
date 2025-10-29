import useAxios from "../../hooks/useAxios";

export default function VendorDashboard() {
  const { data, loading, error } = useAxios({ url: "/vendor/myProfile" }); // your backend can return vendor info + venueUnits
  const vendor = data?.vendor || {};

  const totalVenues = vendor.venueUnits?.length || 0;
  const verifiedVenues =
    vendor.venueUnits?.filter((v) => v.verified).length || 0;
  const pendingVenues = totalVenues - verifiedVenues;

  if (loading)
    return <p className="text-center py-20 text-gray-500 animate-pulse">Loading dashboard...</p>;

  if (error)
    return <p className="text-center py-20 text-red-500">⚠️ {error}</p>;

  return (
    <div className="animate-fade-in space-y-8">
      <header>
        <h1 className="text-3xl font-semibold text-gray-900">
          Welcome, {vendor.name || "Vendor"} 👋
        </h1>
        <p className="text-gray-600">
          Manage your venues, check verification status, and keep your profile updated.
        </p>
      </header>

      {/* Stats Section */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard label="Total Venues" value={totalVenues} color="blue" />
        <StatCard label="Verified Venues" value={verifiedVenues} color="green" />
        <StatCard label="Pending Verifications" value={pendingVenues} color="yellow" />
      </section>

      {/* Venue List */}
      <section className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Venues</h2>
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
    </div>
  );
}

function StatCard({ label, value, color }) {
  const colorMap = {
    blue: "text-blue-600 bg-blue-50",
    green: "text-green-600 bg-green-50",
    yellow: "text-yellow-600 bg-yellow-50",
  };

  return (
    <div className={`p-6 rounded-xl shadow ${colorMap[color]}`}>
      <h2 className="text-2xl font-semibold">{value}</h2>
      <p className="text-sm">{label}</p>
    </div>
  );
}
