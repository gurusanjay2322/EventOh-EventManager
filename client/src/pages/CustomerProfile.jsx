import { useEffect, useState } from "react";
import useAxios from "../hooks/useAxios";
import Button from "../components/Button";

export default function CustomerProfile() {
  const { sendRequest } = useAxios();
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]); // 🆕 For My Bookings
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const handlePayRemaining = async (bookingId) => {
  try {
    const res = await sendRequest(`/bookings/${bookingId}/pay-remaining`, "POST", {});

    if (res.url) {
      window.location.href = res.url; // Redirect to Stripe Checkout
    } else {
      throw new Error("Payment session not created");
    }
  } catch (err) {
    console.error("❌ Payment initiation failed:", err);
    setSnackbar({
      open: true,
      message: "Failed to initiate payment",
      type: "error",
    });
  }
};

  const [photoPreview, setPhotoPreview] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "",
  });

  // ✅ Fetch profile + bookings on mount
  useEffect(() => {
    const fetchProfileAndBookings = async () => {
      try {
        const [userRes, bookingRes] = await Promise.all([
          sendRequest("/customers/me", "GET"),
          sendRequest("/bookings", "GET"),
        ]);
        setProfile(userRes.user || userRes);
        setBookings(bookingRes.bookings || []);
      } catch (err) {
        console.error("❌ Failed to fetch profile or bookings:", err);
        setSnackbar({
          open: true,
          message: "Failed to load profile or bookings",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProfileAndBookings();
  }, []);

  // ✅ Input handler
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // ✅ Photo upload handler
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({ ...profile, profilePhoto: file });
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  // ✅ Update profile
  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      Object.entries(profile).forEach(([key, value]) => {
        if (value !== null && value !== undefined) formData.append(key, value);
      });
      if (profile.profilePhoto instanceof File) {
        formData.append("profilePhoto", profile.profilePhoto);
      }

      const updated = await sendRequest(
        "/customers/updateProfile",
        "PUT",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setProfile(updated.user || updated);
      setEditMode(false);
      setPhotoPreview(null);
      setSnackbar({
        open: true,
        message: "✅ Profile updated successfully!",
        type: "success",
      });
    } catch (err) {
      console.error("❌ Update failed:", err);
      setSnackbar({
        open: true,
        message: err.message || "Failed to update profile",
        type: "error",
      });
    }
  };

  const closeSnackbar = () =>
    setSnackbar({ open: false, message: "", type: "" });

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading profile...
      </div>
    );

  if (!profile)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        No profile found 😢
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6 flex justify-center">
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-2xl p-8 border border-gray-100 relative">
        <h1 className="text-3xl font-semibold text-gray-900 mb-8">
          Your Profile 👤
        </h1>

        {/* Profile Section */}
        <div className="flex items-center gap-6 mb-8">
          <div className="relative">
            <img
              src={
                photoPreview ||
                profile.profilePhoto ||
                profile.profilePhotoUrl ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="Profile"
              className="h-24 w-24 rounded-full object-cover border-2 border-indigo-100 shadow"
            />
            {editMode && (
              <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1 rounded-full cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handlePhotoChange}
                />
                ✎
              </label>
            )}
          </div>
          <div>
            <h2 className="text-xl font-medium text-gray-900">
              {profile.name}
            </h2>
            <p className="text-gray-500">{profile.email}</p>
          </div>
        </div>

        {/* Editable Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="text-sm text-gray-600">Full Name</label>
            <input
              name="name"
              value={profile.name || ""}
              onChange={handleChange}
              disabled={!editMode}
              className={`w-full mt-1 px-4 py-2 rounded-lg border ${
                editMode ? "border-indigo-400" : "border-gray-200"
              } focus:ring-2 focus:ring-indigo-500 outline-none`}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              name="email"
              value={profile.email || ""}
              disabled
              className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-200 bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">City</label>
            <input
              name="city"
              value={profile.city || ""}
              onChange={handleChange}
              disabled={!editMode}
              className={`w-full mt-1 px-4 py-2 rounded-lg border ${
                editMode ? "border-indigo-400" : "border-gray-200"
              } focus:ring-2 focus:ring-indigo-500 outline-none`}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Contact Number</label>
            <input
              name="contactNumber"
              value={profile.contactNumber || ""}
              onChange={handleChange}
              disabled={!editMode}
              className={`w-full mt-1 px-4 py-2 rounded-lg border ${
                editMode ? "border-indigo-400" : "border-gray-200"
              } focus:ring-2 focus:ring-indigo-500 outline-none`}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mb-10">
          {editMode ? (
            <>
              <Button
                onClick={() => {
                  setEditMode(false);
                  setPhotoPreview(null);
                }}
                className="bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                className="bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Save Changes
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setEditMode(true)}
              className="bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Edit Profile
            </Button>
          )}
        </div>

        {/* 🧾 My Bookings Section */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          My Bookings 📅
        </h2>
        {bookings.length === 0 ? (
          <p className="text-gray-500">No bookings yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-indigo-50">
                <tr className="text-left text-gray-700">
                  <th className="py-3 px-4">Vendor</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Dates</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr
                    key={b._id}
                    className="border-t hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4 font-medium text-gray-800">
                      {b.vendorId?.name || "Unknown Vendor"}
                    </td>
                    <td className="py-3 px-4 capitalize">{b.bookingType}</td>
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
                    <td className="py-3 px-4 flex flex-col gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-medium ${
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

                      {b.paymentStatus === "partial" && (
                        <Button
                          onClick={() => handlePayRemaining(b._id)}
                          className="bg-indigo-600 text-white text-sm hover:bg-indigo-700 mt-1"
                        >
                          Pay Remaining ₹{b.totalAmount - b.advanceAmount}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Snackbar */}
        {snackbar.open && (
          <div
            className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-lg text-white transition-all ${
              snackbar.type === "error" ? "bg-red-600" : "bg-green-600"
            }`}
          >
            {snackbar.message}
            <button onClick={closeSnackbar} className="ml-4 text-sm underline">
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
