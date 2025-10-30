import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VendorsList() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

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

  // Extract unique city names for dropdown
  const cities = [...new Set(vendors.map((v) => v.city).filter(Boolean))];

  // ✅ Utility: Get the minimum price for venue/freelancer
  const getVendorPrice = (vendor) => {
    if (vendor.type === "venue") {
      const prices = vendor.venueUnits?.map((u) => u.pricePerDay || 0);
      return Math.min(...prices, vendor.pricing?.basePrice || 0);
    }
    return vendor.pricing?.basePrice || 0;
  };

  // ✅ Filtering logic
  const filteredVendors = vendors.filter((v) => {
    const price = getVendorPrice(v);
    const matchesType = selectedType === "all" || v.type === selectedType;
    const matchesCity = selectedCity === "all" || v.city === selectedCity;
    const matchesPrice =
      (!minPrice || price >= parseInt(minPrice)) &&
      (!maxPrice || price <= parseInt(maxPrice));
    const matchesRating = v.rating >= minRating;
    const matchesVerified =
      !verifiedOnly ||
      (v.type === "venue" &&
        v.venueUnits?.some((unit) => unit.verified === true));
    const matchesSearch =
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return (
      matchesType &&
      matchesCity &&
      matchesPrice &&
      matchesRating &&
      matchesVerified &&
      matchesSearch
    );
  });

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
        </div>

        {/* 🔍 Filters */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-10 grid md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 shadow-sm"
          >
            <option value="all">All Types</option>
            <option value="venue">Venues</option>
            <option value="freelancer">Freelancers</option>
            <option value="event_team">Event Teams</option>
          </select>

          {/* City Filter */}
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 shadow-sm"
          >
            <option value="all">All Cities</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city.charAt(0).toUpperCase() + city.slice(1)}
              </option>
            ))}
          </select>

          {/* Price Range */}
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 shadow-sm"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 shadow-sm"
          />

          {/* Rating Filter */}
          <select
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 shadow-sm"
          >
            <option value={0}>All Ratings</option>
            <option value={4}>4★ & above</option>
            <option value={3}>3★ & above</option>
            <option value={2}>2★ & above</option>
            <option value={1}>1★ & above</option>
          </select>

          {/* Verified Filter */}
          <label className="flex items-center gap-2 text-gray-700 text-sm">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="w-4 h-4 accent-indigo-600"
            />
            Verified Only
          </label>
        </div>

        {/* Search Bar */}
        <div className="mb-10">
          <input
            type="text"
            placeholder="Search by vendor name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>

        {/* Vendor Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredVendors.length === 0 ? (
          <p className="text-center text-gray-600 mt-20">
            No vendors found for the selected filters 😕
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVendors.map((vendor) => {
              const price = getVendorPrice(vendor);
              return (
                <div
                  key={vendor._id}
                  className="group bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className="relative h-52 w-full overflow-hidden">
                    <img
                      src={
                        vendor.profilePhoto ||
                        vendor.venueUnits?.[0]?.images?.[0] ||
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
                      {price > 0 && (
                        <span className="text-sm font-medium text-indigo-600">
                          ₹{price}
                        </span>
                      )}
                    </div>

                    <div className="mt-3 text-yellow-500 text-sm">
                      {"★".repeat(Math.round(vendor.rating)) ||
                        "☆ No reviews yet"}
                    </div>

                    <button
                      onClick={() => navigate(`/vendors/${vendor._id}`)}
                      className="w-full mt-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
