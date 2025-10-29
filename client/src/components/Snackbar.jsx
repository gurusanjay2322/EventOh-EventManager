import { useEffect } from "react";

export default function Snackbar({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000); // auto close after 3s
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-6 right-6 px-4 py-2 rounded-md shadow-lg text-white transition-all duration-300 
      ${type === "error" ? "bg-red-500" : "bg-green-600"}`}
    >
      {message}
    </div>
  );
}
