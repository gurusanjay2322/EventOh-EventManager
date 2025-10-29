import { useEffect, useState } from "react";

export default function VendorsList() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("all");

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/vendors`);
        const data = await res.json();
        setVendors(data.vendors || []);
      } catch (err) {
        console.error("Failed to fetch vendors:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, []);
  console.log(vendors);
  const filteredVendors =
    selectedType === "all"
      ? vendors
      : vendors.filter((v) => v.type === selectedType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-12 px-4 md:px-10 animate-fadeIn">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Explore Vendors
            </h1>
            <p className="text-gray-600 mt-2">
              Browse talented professionals and premium venues for your event.
            </p>
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="mt-4 md:mt-0 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all"
          >
            <option value="all">All Types</option>
            <option value="venue">Venues</option>
            <option value="freelancer">Freelancers</option>
            <option value="event_team">Event Teams</option>
          </select>
        </div>

        {/* Vendor Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredVendors.length === 0 ? (
          <p className="text-center text-gray-600 mt-20">
            No vendors found for this category 😕
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVendors.map((vendor) => (
              <div
                key={vendor._id}
                className="group bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className="relative h-52 w-full overflow-hidden">
                  <img
                    src={
                      vendor.profilePhoto ||
                      (vendor.venueUnits?.[0]?.images?.[0]) ||
                      "https://via.placeholder.com/400x300?text=Vendor"
                    }
                    alt={vendor.name}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/80 text-xs font-medium px-3 py-1 rounded-full text-gray-700">
                    {vendor.type.replace("_", " ").toUpperCase()}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {vendor.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 truncate">
                    {vendor.description || "No description provided."}
                  </p>

                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-gray-500">
                      📍 {vendor.city}
                    </span>
                    {vendor.pricing?.basePrice && (
                      <span className="text-sm font-medium text-indigo-600">
                        ₹{vendor.pricing.basePrice}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => alert(`Viewing ${vendor.name}`)}
                    className="w-full mt-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
