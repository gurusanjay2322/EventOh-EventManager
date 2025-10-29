export default function InputField({ label, type = "text", name, value, onChange, placeholder }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-gray-600 tracking-wide">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="border border-gray-300/80 rounded-xl px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition bg-white"
      />
    </div>
  );
}
