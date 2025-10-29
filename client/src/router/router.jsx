import { createBrowserRouter } from "react-router-dom";
import Layout from "../layout/Layout";

// 🧍 Customer Pages
import Home from "../pages/Home";
import Login from "../pages/Login";
import CustomerRegister from "../pages/CustomerRegister";
import VendorsList from "../pages/VendorList";

// 💼 Vendor Pages
import VendorRegister from "../pages/VendorRegister";

// 🧠 Admin Pages
import AdminLayout from "../pages/admin/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminVendorsList from "../pages/admin/VendorsList";
import VendorDashboard from "../pages/vendors/VendorDashboard";
import VendorProfile from "../pages/vendors/VendorPofile";
import CustomerProfile from "../pages/CustomerProfile";
import VendorDetails from "../pages/vendors/VendorDetails";

/* =======================
   🔐 Route Guards
======================= */

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login";
    return null;
  }
  return children;
};

const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (!token) {
    window.location.href = "/login";
    return null;
  }
  if (role !== "admin") {
    window.location.href = "/";
    return null;
  }
  return children;
};

const VendorProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (!token) {
    window.location.href = "/login";
    return null;
  }
  if (role !== "vendor") {
    window.location.href = "/";
    return null;
  }
  return children;
};

/* =======================
   🧭 Router Config
======================= */

const router = createBrowserRouter([
  // 🏠 CUSTOMER & PUBLIC ROUTES
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "register", element: <CustomerRegister /> },
      { path: "profile", element: <CustomerProfile/>},
      { path: "vendors", element: <VendorsList /> },
      { path: "vendors/:id", element: <VendorDetails/>},

      // 💼 Vendor Pages (reusing Layout)
      { path: "vendor/register", element: <VendorRegister /> },
      {
        path: "vendor/dashboard",
        element: <VendorDashboard/>
      },
      {
        path: "vendor/profile",
        element: <VendorProfile/>
      }
    ],
  },

  // 🔐 LOGIN ROUTE
  {
    path: "/login",
    element: <Login />,
  },

  // 🧠 ADMIN ROUTES
  {
    path: "/admin",
    element: (
      <AdminProtectedRoute>
        <AdminLayout />
      </AdminProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "vendors", element: <AdminVendorsList /> },
    ],
  },

  // Example protected route
  {
    path: "/protected",
    element: (
      <ProtectedRoute>
        <div className="p-10 text-center text-gray-800">
          🔒 Protected Route Example
        </div>
      </ProtectedRoute>
    ),
  },
]);

export default router;
