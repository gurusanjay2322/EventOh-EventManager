import { createBrowserRouter } from "react-router-dom";
import Layout from "../layout/Layout";
import Home from "../pages/Home";
import RegisterFreelancer from "../pages/RegisterFreelancer";
import RegisterEventTeam from "../pages/RegisterEventTeam";
import RegisterVenue from "../pages/RegisterVenue";
import Login from "../pages/Login";
import VendorRegister from "../pages/VendorRegister";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login";
    return null;
  }
  return children;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "event-team", element: <RegisterEventTeam /> },
      { path: "venue", element: <RegisterVenue /> },
      { path: "register", element: <VendorRegister /> },
    ],
  },
  {
    path: "/protected",
    element: (
      <ProtectedRoute>
        <div className="p-10 text-center">🔒 Protected Route Example</div>
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

export default router;
