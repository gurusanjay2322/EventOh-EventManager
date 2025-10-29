import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) setRole(storedRole);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setRole(null);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40">
      <div className="backdrop-blur bg-white/70 border-b border-gray-200/70">
        <nav className="container-page py-3 flex items-center justify-between">
          {/* 🌟 Brand */}
          <Link
            to="/"
            className="text-2xl font-semibold tracking-tight text-indigo-700"
          >
            Event-Oh
          </Link>

          {/* 🔗 Nav Links */}
          <div className="flex items-center gap-6 text-sm">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `hover:text-indigo-600 ${
                  isActive ? "text-indigo-600 font-medium" : "text-gray-700"
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/event-team"
              className={({ isActive }) =>
                `hover:text-indigo-600 ${
                  isActive ? "text-indigo-600 font-medium" : "text-gray-700"
                }`
              }
            >
              Vendors
            </NavLink>

            <NavLink
              to="/venue"
              className={({ isActive }) =>
                `hover:text-indigo-600 ${
                  isActive ? "text-indigo-600 font-medium" : "text-gray-700"
                }`
              }
            >
              Venues
            </NavLink>

            {/* 🌈 Role-Based Links */}
            {role === "vendor" && (
              <>
                <NavLink
                  to="/vendor/dashboard"
                  className={({ isActive }) =>
                    `hover:text-indigo-600 ${
                      isActive ? "text-indigo-600 font-medium" : "text-gray-700"
                    }`
                  }
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/vendor/profile"
                  className={({ isActive }) =>
                    `hover:text-indigo-600 ${
                      isActive ? "text-indigo-600 font-medium" : "text-gray-700"
                    }`
                  }
                >
                  Profile
                </NavLink>
              </>
            )}

            {role === "admin" && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `hover:text-indigo-600 ${
                    isActive ? "text-indigo-600 font-medium" : "text-gray-700"
                  }`
                }
              >
                Admin Dashboard
              </NavLink>
            )}

            {/* 🔐 Auth Controls */}
            {role ? (
              <button
                onClick={handleLogout}
                className="bg-gray-900 text-white px-3 py-1.5 rounded-full hover:bg-black transition"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="bg-indigo-600 text-white px-3 py-1.5 rounded-full hover:bg-indigo-700 transition"
              >
                Login
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
