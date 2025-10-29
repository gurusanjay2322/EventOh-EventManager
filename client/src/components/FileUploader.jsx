export default function FileUploader({ label, name, multiple = false, onChange }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-gray-600 tracking-wide">{label}</label>
      <input
        type="file"
        name={name}
        multiple={multiple}
        onChange={onChange}
        className="block w-full text-sm text-gray-700 border border-gray-300/80 rounded-xl px-3.5 py-2.5 bg-white file:mr-3 file:py-2 file:px-3 file:rounded-full file:border-0 file:bg-gray-900 file:text-white hover:file:bg-black focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
    </div>
  );
}
