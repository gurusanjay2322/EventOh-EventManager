import { useState, useEffect } from "react";
import useAxios from "../../hooks/useAxios";

export default function VendorProfile() {
  const { sendRequest } = useAxios();
  const [vendor, setVendor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // 🧩 Fetch logged-in vendor profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await sendRequest("/vendors/myProfile", "GET");
        if (res?.vendor) {
          setVendor(res.vendor);
          setForm({
            _id: res.vendor._id,
            name: res.vendor.name || "",
            city: res.vendor.city || "",
            description: res.vendor.description || "",
            profilePhoto: res.vendor.profilePhoto || "",
          });
        }
      } catch (err) {
        console.error("❌ Failed to fetch vendor profile:", err);
      }
    };
    fetchProfile();
  }, [sendRequest]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // 📸 Handle image upload to backend (Cloudinary)
const handleFileUpload = async (e) => {
  const file = e.target.files[0];
  if (!file || !form._id) return;

  const formData = new FormData();
  formData.append("images", file);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  try {
    setUploading(true);

    const res = await fetch(`${API_BASE_URL}/vendors/${form._id}/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Upload failed: ${errorText}`);
    }

    const data = await res.json();

    if (data?.uploaded?.[0]?.url) {
      setForm((prev) => ({
        ...prev,
        profilePhoto: data.uploaded[0].url,
      }));
      alert("✅ Image uploaded successfully!");
    } else {
      throw new Error("No image URL returned from server");
    }

  } catch (err) {
    console.error("❌ Image upload error:", err);
    alert(err.message || "Image upload failed");
  } finally {
    setUploading(false);
  }
};



  // 💾 Handle profile update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await sendRequest(`/vendors/${form._id}`, "PUT", {
        name: form.name,
        city: form.city,
        description: form.description,
        profilePhoto: form.profilePhoto,
      });
      setVendor(res.vendor);
      setIsModalOpen(false);
    } catch (err) {
      console.error("❌ Update failed:", err);
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (!vendor)
    return (
      <p className="text-center py-20 text-gray-500 animate-pulse">
        Loading profile...
      </p>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <img
          src={vendor.profilePhoto || "https://via.placeholder.com/100?text=Profile"}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border-4 border-indigo-200 shadow-md"
        />
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">{vendor.name}</h1>
          <p className="text-gray-600">{vendor.city}</p>
          <p className="mt-2 text-gray-700 max-w-md">{vendor.description}</p>
        </div>
        <div className="ml-auto">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="mt-8 border-t border-gray-200"></div>

      {/* Info Section */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          Account Details
        </h2>
        <div className="space-y-2 text-gray-700">
          <p>
            <span className="font-medium">Email:</span>{" "}
            {vendor.userId?.email || "N/A"}
          </p>
          <p>
            <span className="font-medium">Role:</span>{" "}
            {vendor.userId?.role || "vendor"}
          </p>
          <p>
            <span className="font-medium">Created At:</span>{" "}
            {new Date(vendor.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* 🌈 Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg mx-4 relative">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Edit Profile
            </h2>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Profile Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                {uploading && (
                  <p className="text-sm text-gray-500 mt-1">Uploading...</p>
                )}
                {form.profilePhoto && (
                  <img
                    src={form.profilePhoto}
                    alt="Preview"
                    className="w-20 h-20 mt-3 rounded-full object-cover border"
                  />
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className={`px-4 py-2 rounded-lg text-white ${
                    saving
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
