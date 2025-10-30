import { useState, useEffect } from "react";
import useAxios from "../../hooks/useAxios";

export default function AdminVendorsList() {
  const { sendRequest, loading, error } = useAxios();
  const [vendors, setVendors] = useState([]);

  // ✅ Fetch vendors on mount
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await sendRequest("/admin/vendors", "GET");
        setVendors(res?.vendors || []);
      } catch (err) {
        console.error("❌ Failed to fetch vendors:", err);
      }
    };
    fetchVendors();
  }, [sendRequest]);

  // ✅ Handle verification of a venue
  const handleVerify = async (vendorId, venueId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/vendors/${vendorId}/venue/${venueId}/verify`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const errMsg = (await res.json())?.message || "Verification failed";
        throw new Error(errMsg);
      }

      // ✅ Re-fetch vendors after verification
      const updated = await sendRequest("/admin/vendors", "GET");
      setVendors(updated?.vendors || []);
    } catch (err) {
      console.error("❌ Error verifying venue:", err);
      alert(err.message || "Failed to verify venue.");
    }
  };

  if (loading)
    return (
      <div className="text-center py-20 text-gray-600 animate-pulse">
        Loading vendors...
      </div>
    );

  if (error)
    return (
      <div className="text-center py-20 text-red-500">
        ⚠️ {error || "Failed to load vendors"}
      </div>
    );

  return (
    <div className="animate-fade-in space-y-8">
      <header>
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          Vendor Management
        </h1>
        <p className="text-gray-600">
          Review all vendors and verify their venues.
        </p>
      </header>

      <div className="space-y-6">
        {vendors.map((vendor) => (
          <div
            key={vendor._id}
            className="bg-white rounded-xl shadow p-6 border border-gray-100 hover:shadow-lg transition-all"
          >
            {/* Vendor Info */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {vendor.name}
                </h2>
                <p className="text-gray-600 text-sm">{vendor.city}</p>
              </div>
              <span
                className={`text-sm px-3 py-1 rounded-full ${
                  vendor.type === "venue"
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {vendor.type}
              </span>
            </div>

            {/* Venue Vendors */}
            {vendor.type === "venue" && vendor.venueUnits?.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {vendor.venueUnits.map((unit) => (
                  <div
                    key={unit._id}
                    className="border rounded-lg p-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{unit.title}</p>
                      <p className="text-sm text-gray-500">
                        Capacity: {unit.capacity}
                      </p>
                    </div>

                    <button
                      onClick={() => handleVerify(vendor._id, unit._id)}
                      disabled={unit.verified}
                      className={`px-3 py-1 text-sm rounded-md ${
                        unit.verified
                          ? "bg-green-100 text-green-700 cursor-default"
                          : "bg-indigo-600 text-white hover:bg-indigo-700"
                      }`}
                    >
                      {unit.verified ? "Verified" : "Verify"}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Freelancer Vendors */}
            {vendor.type === "freelancer" && (
              <div className="mt-3 text-gray-600">
                <p>
                  Freelancer Category:{" "}
                  <span className="font-medium text-indigo-600">
                    {vendor.freelancerCategory || "N/A"}
                  </span>
                </p>
                {vendor.portfolio?.length > 0 && (
                  <div className="flex gap-3 mt-2">
                    {vendor.portfolio.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt="portfolio"
                        className="w-16 h-16 rounded-lg object-cover border"
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
