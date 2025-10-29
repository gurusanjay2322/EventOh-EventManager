import useAxios from "../../hooks/useAxios";

export default function AdminDashboard() {
  const { data, loading, error } = useAxios({ url: "/admin/vendors" });

  if (loading)
    return (
      <div className="text-center py-20 text-gray-600 animate-pulse">
        Loading dashboard...
      </div>
    );

  if (error)
    return (
      <div className="text-center py-20 text-red-500">
        ⚠️ {error || "Failed to load admin data"}
      </div>
    );

  const vendors = data?.vendors || [];

  // 🧮 Stats Calculations
  const pendingVerifications = vendors.reduce((count, vendor) => {
    if (vendor.type === "venue") {
      const unverifiedUnits = vendor.venueUnits.filter((u) => !u.verified).length;
      return count + unverifiedUnits;
    }
    return count;
  }, 0);

  const verifiedVendors = vendors.filter((vendor) => {
    if (vendor.type === "freelancer") return true;
    return vendor.venueUnits?.some((u) => u.verified);
  }).length;

  const totalVendors = vendors.length;

  return (
    <div className="animate-fade-in space-y-8">
      <header>
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          Welcome, Admin 👋
        </h1>
        <p className="text-gray-600">
          Monitor vendor registrations, verify businesses, and manage bookings — all in one place.
        </p>
      </header>

      {/* 📊 Stats Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold text-indigo-600">
            {pendingVerifications}
          </h2>
          <p className="text-gray-700 mt-1">Pending Verifications</p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold text-green-600">
            {verifiedVendors}
          </h2>
          <p className="text-gray-700 mt-1">Verified Vendors</p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold text-blue-600">{totalVendors}</h2>
          <p className="text-gray-700 mt-1">Total Vendors</p>
        </div>
      </section>

      {/* 🧾 Vendor Snapshot */}
      <section className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Latest Vendors
        </h3>

        <div className="divide-y">
          {vendors.slice(0, 5).map((v) => (
            <div key={v._id} className="py-3 flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">{v.name}</h4>
                <p className="text-sm text-gray-500">{v.city}</p>
              </div>
              <span
                className={`px-3 py-1 text-sm rounded-full ${
                  v.type === "freelancer"
                    ? "bg-green-100 text-green-700"
                    : v.venueUnits.some((u) => u.verified)
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {v.type === "freelancer"
                  ? "Freelancer"
                  : v.venueUnits.some((u) => u.verified)
                  ? "Verified"
                  : "Pending"}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
