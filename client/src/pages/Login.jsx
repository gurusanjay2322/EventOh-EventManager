import { useState } from "react";
import InputField from "../components/InputField";
import Button from "../components/Button";
import useAxios from "../hooks/useAxios";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "customer",
  });
  const { sendRequest, loading } = useAxios();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await sendRequest("/auth/login", "POST", form);

    const user = typeof res.user === "string" ? JSON.parse(res.user) : res.user;

    // ✅ Fix here
    const role = user.role;

    localStorage.setItem("token", res.token);
    localStorage.setItem("role", role);
    localStorage.setItem("user", JSON.stringify(user));

    // 🧭 Navigate based on role
    if (role === "admin") {
      window.location.href = "/admin";
    } else if (role === "vendor") {
      window.location.href = "/vendor/profile";
    } else {
      window.location.href = "/";
    }
  } catch (err) {
    alert(err?.message || "Login failed");
  }
};


  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side – image or branding */}
      <div className="hidden md:flex flex-1 bg-gradient-to-br from-indigo-600 to-purple-600 text-white items-center justify-center">
        <div className="text-center px-10">
          <h1 className="text-4xl font-bold mb-2 tracking-tight">
            Welcome Back 👋
          </h1>
          <p className="text-indigo-100 text-lg max-w-md mx-auto">
            Sign in to your Event-Oh account and manage your events like a pro.
          </p>
        </div>
      </div>

      {/* Right side – login form */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-6 py-16 md:px-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 text-center">
            Sign in to Event-Oh
          </h2>
          <p className="text-gray-500 text-center mt-1 mb-6 text-sm">
            Choose your role and enter your credentials
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">
                Login as
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="customer">Customer</option>
                <option value="vendor">Vendor</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <InputField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
            />

            <InputField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
            />

            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </div>
          </form>

          <div className="text-center text-sm text-gray-500 mt-6">
            Don’t have an account?{" "}
            <a
              href="/vendor/register"
              className="text-indigo-600 font-medium hover:underline"
            >
              Register here
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
