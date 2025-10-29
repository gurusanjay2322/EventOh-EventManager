import InputField from "../components/InputField";
import Button from "../components/Button";
import { useState } from "react";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("token", "mock-token");
    window.location.href = "/";
  };

  return (
    <div className="container-page py-16">
      <div className="max-w-md mx-auto card p-6 md:p-8">
        <h2 className="text-2xl font-semibold text-gray-900 text-center">Login</h2>
        <p className="text-gray-600 text-center mt-1 mb-6">Welcome back to Event-Oh</p>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Button type="submit">Sign In</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
