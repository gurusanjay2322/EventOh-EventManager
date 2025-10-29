import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();

  const menu = [
    { name: "Dashboard", path: "/admin" },
    { name: "Vendors", path: "/admin/vendors" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="px-6 py-5 border-b border-gray-200">
          <h1
            className="text-2xl font-semibold text-gray-900 cursor-pointer"
            onClick={() => navigate("/admin")}
          >
            Event<span className="text-indigo-600">Oh</span> Admin
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-md text-gray-700 font-medium ${
                  isActive
                    ? "bg-indigo-100 text-indigo-700"
                    : "hover:bg-gray-100"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
            className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
