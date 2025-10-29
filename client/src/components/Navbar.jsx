import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40">
      <div className="backdrop-blur bg-white/70 border-b border-gray-200/70">
        <nav className="container-page py-3 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold tracking-tight text-gray-900">
            Event-Oh
          </Link>
          <div className="flex items-center gap-6 text-sm">
            <NavLink to="/" className={({isActive}) => `hover:text-indigo-600 ${isActive ? 'text-indigo-600' : 'text-gray-700'}`}>Home</NavLink>
            <NavLink to="/event-team" className={({isActive}) => `hover:text-indigo-600 ${isActive ? 'text-indigo-600' : 'text-gray-700'}`}>Vendors</NavLink>
            <NavLink to="/venue" className={({isActive}) => `hover:text-indigo-600 ${isActive ? 'text-indigo-600' : 'text-gray-700'}`}>Venues</NavLink>
            <Link to="/login" className="bg-gray-900 text-white px-3 py-1.5 rounded-full text-sm hover:bg-black transition">Login</Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
