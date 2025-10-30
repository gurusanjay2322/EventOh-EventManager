import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const bookingId = params.get("bookingId");
  const isFinal = params.get("final"); // ✅ detect if it's final payment
  const navigate = useNavigate();

  useEffect(() => {
    const handlePayment = async () => {
      if (!bookingId) return;

      const token = localStorage.getItem("token"); // ✅ fetch token from localStorage

      try {
        if (isFinal === "true") {
          // 🏁 Final payment — mark as fully paid
          await axios.put(
            `${import.meta.env.VITE_API_URL}/api/bookings/${bookingId}/mark-paid`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } else {
          // 💸 Advance payment — mark as confirmed
          await axios.put(
            `${import.meta.env.VITE_API_URL}/api/bookings/${bookingId}/status`,
            { status: "confirmed" },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }

        console.log("✅ Payment update successful");
      } catch (err) {
        console.error("❌ Payment success handling failed:", err);
      }

      // Redirect after short delay
      setTimeout(() => navigate("/profile"), 1000);
    };

    handlePayment();
  }, [bookingId, isFinal, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-semibold text-green-600">
        Payment Successful!
      </h1>
      <p className="text-gray-600 mt-2">Redirecting to your profile...</p>
    </div>
  );
}
