import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Plus, MapPin, Stethoscope } from "lucide-react";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const linkStyle = ({ isActive }) =>
    `font-semibold transition-colors duration-200 py-1 text-sm ${
      isActive
        ? "text-white border-b-2 border-white"
        : "text-teal-100 hover:text-white"
    }`;

  return (
    <nav className="bg-hospital-teal text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-3">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-white/20 rounded-lg w-9 h-9 flex items-center justify-center text-lg font-black">
            <Plus size={20} />
          </div>
          <div>
            <h1 className="text-base font-black tracking-wide leading-tight">
              AfyaStock Link
            </h1>
            <p className="text-teal-200 text-xs">
              Sub-County Medical Supply Portal
            </p>
          </div>
        </div>

        {/* Nav Links */}
        <div className="flex items-center gap-5 flex-wrap justify-center sm:justify-start order-first sm:order-none">
          <NavLink to="/" end className={linkStyle}>
            Dashboard
          </NavLink>
          <NavLink to="/products" className={linkStyle}>
            Inventory
          </NavLink>
          <NavLink to="/add-product" className={linkStyle}>
            <Plus size={15}/> Log Stock
          </NavLink>
          <NavLink to="/symptom-checker" className={linkStyle}>
            <Stethoscope size={15} /> Symptoms
          </NavLink>
          <NavLink to="/nearby" className={linkStyle}>
            <MapPin size={15} /> Nearby
          </NavLink>
        </div>

        {/* User + Logout */}
        <div className="flex items-center gap-2 border-l border-teal-600 pl-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-white font-semibold leading-tight">
              {user?.name}
            </p>
            <p className="text-teal-300 text-xs">{user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-teal-700 hover:bg-teal-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
