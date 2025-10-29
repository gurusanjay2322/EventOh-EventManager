export default function Button({ children, onClick, type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="inline-flex items-center justify-center rounded-full bg-indigo-600 text-white px-5 py-2.5 text-sm font-medium shadow-sm hover:bg-indigo-700 active:translate-y-px transition"
    >
      {children}
    </button>
  );
}
