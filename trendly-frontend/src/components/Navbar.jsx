import { useState, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);

  // 🔥 New modern link styles
  const linkClasses = ({ isActive }) =>
    `px-3 py-2 text-sm rounded-full transition-all duration-200 ${
      isActive
        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/40"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/70 border-b border-slate-800 shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
<Link
  to="/"
  className="flex items-center gap-1 select-none group"
>
  <span
    className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-300 bg-clip-text text-transparent 
    transition-all duration-300 group-hover:scale-110"
  >
    Trendly
  </span>

  {/* Colored Dot */}
  <span
    className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-blue-400 via-green-400 to-red-400 
    shadow-[0_0_6px_rgba(56,189,248,0.8)] 
    animate-pulse transition-transform duration-300 group-hover:scale-125"
  />
</Link>



          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-3">

            <NavLink to="/" end className={linkClasses}>
              Home
            </NavLink>

            {/* USER MENU */}
            {user && user.role === "USER" && (
              <>
              <NavLink to="/my-activity" className={linkClasses}>
      My Activity
    </NavLink>
                <NavLink to="/bookmarks" className={linkClasses}>
                  Bookmarks
                </NavLink>
                <NavLink to="/profile" className={linkClasses}>
                  Profile
                </NavLink>
              </>
            )}

            {/* ADMIN MENU */}
            {user && user.role === "ADMIN" && (
              <>
                <NavLink to="/admin/dashboard" className={linkClasses}>
                  Admin Dashboard
                </NavLink>
                <NavLink to="/admin/comments" className={linkClasses}>
                  Comments
                </NavLink>
              </>
            )}

            {/* AUTH (not logged in) */}
            {!user && (
              <>
                <NavLink to="/login" className={linkClasses}>
                  Login
                </NavLink>
                <NavLink to="/register" className={linkClasses}>
                  Register
                </NavLink>
                <NavLink to="/admin/login" className={linkClasses}>
                  Admin
                </NavLink>
              </>
            )}

            {/* Logout button */}
            {user && (
              <button
                onClick={logout}
                className="px-3 py-1 text-xs rounded-full bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700"
              >
                Logout ({user.name})
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-200"
            onClick={() => setOpen((prev) => !prev)}
          >
            <div className="w-6 h-0.5 bg-slate-200 mb-1" />
            <div className="w-6 h-0.5 bg-slate-200 mb-1" />
            <div className="w-6 h-0.5 bg-slate-200" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden px-4 pb-3 pt-2 space-y-2 bg-slate-900/90 border-b border-slate-800">

          <NavLink
            to="/"
            end
            className={linkClasses}
            onClick={() => setOpen(false)}
          >
            Home
          </NavLink>

          {/* USER MENU */}
          {user && user.role === "USER" && (
            <>

             <NavLink
      to="/my-activity"
      className={linkClasses}
      onClick={() => setOpen(false)}
    >
      My Activity
    </NavLink>
              <NavLink
                to="/bookmarks"
                className={linkClasses}
                onClick={() => setOpen(false)}
              >
                Bookmarks
              </NavLink>

              <NavLink
                to="/profile"
                className={linkClasses}
                onClick={() => setOpen(false)}
              >
                Profile
              </NavLink>
            </>
          )}

          {/* ADMIN MENU */}
          {user && user.role === "ADMIN" && (
            <>
              <NavLink
                to="/admin/dashboard"
                className={linkClasses}
                onClick={() => setOpen(false)}
              >
                Admin Dashboard
              </NavLink>

              <NavLink
                to="/admin/comments"
                className={linkClasses}
                onClick={() => setOpen(false)}
              >
                Comments
              </NavLink>
            </>
          )}

          {/* Not Logged In */}
          {!user && (
            <>
              <NavLink
                to="/login"
                className={linkClasses}
                onClick={() => setOpen(false)}
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={linkClasses}
                onClick={() => setOpen(false)}
              >
                Register
              </NavLink>
              <NavLink
                to="/admin/login"
                className={linkClasses}
                onClick={() => setOpen(false)}
              >
                Admin
              </NavLink>
            </>
          )}

          {/* Logout */}
          {user && (
            <button
              onClick={() => {
                logout();
                setOpen(false);
              }}
              className="mt-2 px-3 py-1 text-xs rounded-full bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700"
            >
              Logout ({user.name})
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
