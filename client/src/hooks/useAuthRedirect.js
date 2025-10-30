import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function useAuthRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (!role) return;

    switch (role) {
      case "admin":
        navigate("/admin", { replace: true });
        break;
      case "vendor":
        navigate("/vendor/dashboard", { replace: true });
        break;
      case "customer":
        navigate("/profile", { replace: true });
        break;
      default:
        break;
    }
  }, [navigate]);
}
