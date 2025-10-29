import InputField from "../components/InputField";
import FileUploader from "../components/FileUploader";
import Button from "../components/Button";
import { useState } from "react";

export default function RegisterVenue() {
  const [form, setForm] = useState({ name: "", email: "", password: "", city: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="w-full">
      <div className="w-full max-w-6xl mx-auto bg-white rounded-xl border border-gray-200 p-6 md:p-10 shadow-sm">
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-900">Venue Owner Registration</h2>
          <p className="text-gray-500 mt-1">Provide your details so customers can find your venue.</p>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <InputField label="Name" name="name" value={form.name} onChange={handleChange} />
          <InputField label="Email" type="email" name="email" value={form.email} onChange={handleChange} />
          <InputField label="Password" type="password" name="password" value={form.password} onChange={handleChange} />
          <InputField label="City" name="city" value={form.city} onChange={handleChange} />

          <div className="md:col-span-1">
            <FileUploader label="Profile Photo" name="profilePhoto" />
          </div>
          <div className="md:col-span-1">
            <FileUploader label="Venue Images" name="venueImages" multiple />
          </div>

          <div className="md:col-span-2 flex items-center justify-end pt-2">
            <Button>Register</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
