import { useState } from "react";
import InputField from "../components/InputField";
import TextArea from "../components/TextArea";
import Dropdown from "../components/Dropdown";
import Button from "../components/Button";

export default function VendorRegister() {
  const [vendorType, setVendorType] = useState("");
  const [venues, setVenues] = useState([
    { title: "", capacity: "", pricePerDay: "", amenities: "", images: [] },
  ]);
  const [portfolio, setPortfolio] = useState([]);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    city: "",
    contactNumber: "",
    description: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleVenueChange = (i, field, val) => {
    const v = [...venues];
    v[i][field] = val;
    setVenues(v);
  };

  const handleVenueImages = (i, files) => {
    const v = [...venues];
    v[i].images = Array.from(files);
    setVenues(v);
  };

  const addVenue = () =>
    setVenues([...venues, { title: "", capacity: "", pricePerDay: "", amenities: "", images: [] }]);

  const removeVenue = (i) => setVenues(venues.filter((_, idx) => idx !== i));

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("📝 Form submitted", { form, vendorType, venues, portfolio, profilePhoto });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-10 px-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <h1 className="text-3xl font-bold">Vendor Registration</h1>
          <p className="text-indigo-100 mt-1">Join EventOh as a Vendor Partner 🚀</p>
        </div>

        {/* Two-column layout */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 transition-all duration-300"
        >
          {/* LEFT COLUMN */}
          <div className="space-y-4">
            <Dropdown
              label="Vendor Type"
              name="vendorType"
              options={[
                { value: "", label: "Select Vendor Type" },
                { value: "freelancer", label: "Freelancer" },
                { value: "venue", label: "Venue Owner" },
                { value: "event_team", label: "Event Management Team" },
              ]}
              value={vendorType}
              onChange={(e) => setVendorType(e.target.value)}
            />

            <InputField label="Full Name" name="name" value={form.name} onChange={handleChange} />
            <InputField label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
            <InputField label="Password" name="password" type="password" value={form.password} onChange={handleChange} />
            <InputField label="City" name="city" value={form.city} onChange={handleChange} />
            <InputField
              label="Contact Number"
              name="contactNumber"
              value={form.contactNumber}
              onChange={handleChange}
            />
            <TextArea
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
            />

            {/* Profile Photo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfilePhoto(e.target.files[0])}
                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
              />
              {profilePhoto && (
                <img
                  src={URL.createObjectURL(profilePhoto)}
                  alt="preview"
                  className="mt-3 h-20 w-20 rounded-full object-cover border"
                />
              )}
            </div>

            {/* Portfolio Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio (multiple)</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setPortfolio(Array.from(e.target.files))}
                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
              />
              <div className="flex flex-wrap gap-2 mt-3">
                {portfolio.map((file, i) => (
                  <img
                    key={i}
                    src={URL.createObjectURL(file)}
                    alt="portfolio"
                    className="h-16 w-16 rounded-md object-cover border border-gray-200"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            {/* VENUE FIELDS */}
            {vendorType === "venue" && (
              <>
                <h3 className="text-xl font-semibold text-indigo-600">Venue Details</h3>
                {venues.map((venue, index) => (
                  <div key={index} className="p-5 border rounded-lg bg-gray-50 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-gray-700">Venue #{index + 1}</h4>
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => removeVenue(index)}
                          className="text-red-500 text-sm hover:underline"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InputField
                        label="Venue Name"
                        value={venue.title}
                        onChange={(e) => handleVenueChange(index, "title", e.target.value)}
                      />
                      <InputField
                        label="Capacity"
                        type="number"
                        value={venue.capacity}
                        onChange={(e) => handleVenueChange(index, "capacity", e.target.value)}
                      />
                      <InputField
                        label="Price Per Day (₹)"
                        type="number"
                        value={venue.pricePerDay}
                        onChange={(e) => handleVenueChange(index, "pricePerDay", e.target.value)}
                      />
                      <InputField
                        label="Amenities"
                        value={venue.amenities}
                        onChange={(e) => handleVenueChange(index, "amenities", e.target.value)}
                      />
                    </div>

                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Venue Images</label>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleVenueImages(index, e.target.files)}
                        className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
                      />
                      <div className="flex flex-wrap gap-2 mt-3">
                        {venue.images.map((file, i) => (
                          <img
                            key={i}
                            src={URL.createObjectURL(file)}
                            alt="venue preview"
                            className="h-16 w-16 rounded-lg object-cover border border-gray-200"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  onClick={addVenue}
                  className="w-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                >
                  + Add Another Venue
                </Button>
              </>
            )}

            {/* FREELANCER FIELDS */}
            {vendorType === "freelancer" && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-indigo-600">Freelancer Details</h3>
                <Dropdown
                  label="Freelancer Category"
                  name="freelancerCategory"
                  options={[
                    { value: "photographer", label: "Photographer" },
                    { value: "videographer", label: "Videographer" },
                    { value: "dj", label: "DJ" },
                    { value: "caterer", label: "Caterer" },
                    { value: "decorator", label: "Decorator" },
                    { value: "makeup_artist", label: "Makeup Artist" },
                  ]}
                  value={form.freelancerCategory || ""}
                  onChange={(e) =>
                    setForm({ ...form, freelancerCategory: e.target.value })
                  }
                />
                <InputField
                  label="Base Price (₹)"
                  type="number"
                  name="basePrice"
                  value={form.basePrice || ""}
                  onChange={handleChange}
                />
              </div>
            )}

            {/* EVENT TEAM FIELDS */}
            {vendorType === "event_team" && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-indigo-600">Event Team Details</h3>
                <InputField
                  label="Package Name"
                  name="packageName"
                  value={form.packageName || ""}
                  onChange={handleChange}
                />
                <TextArea
                  label="Package Description"
                  name="packageDescription"
                  value={form.packageDescription || ""}
                  onChange={handleChange}
                  rows={3}
                />
                <InputField
                  label="Package Price (₹)"
                  type="number"
                  name="packagePrice"
                  value={form.packagePrice || ""}
                  onChange={handleChange}
                />
                <InputField
                  label="Event Types Covered (comma separated)"
                  name="eventTypes"
                  value={form.eventTypes || ""}
                  onChange={handleChange}
                />
              </div>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <div className="col-span-1 md:col-span-2 flex justify-center mt-6">
            <Button type="submit" className="w-full md:w-1/2 text-lg py-3">
              Submit Registration
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
