import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiPost } from "../apiClient";
import { AuthContext } from "../context/AuthContext";

export default function AdminLogin() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await apiPost("/api/auth/admin-login", form);
      login(user);

      if (user.role === "ADMIN") navigate("/admin/dashboard");
      else navigate("/");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-xl p-6 animate-fadeIn">

        {/* Admin badge */}
        <div className="flex flex-col items-center mb-3">
          <div className="h-12 w-12 rounded-xl bg-red-600/80 text-white flex items-center justify-center text-2xl shadow-lg shadow-red-600/40 animate-pulse">
            ⚠️
          </div>

          <h1 className="mt-3 text-2xl font-semibold tracking-wide text-red-400">
            Admin Login
          </h1>

          <p className="text-[12px] text-slate-400 mt-1">
            Authorized access only.
          </p>
        </div>

        {error && (
          <div className="mb-3 text-xs text-red-300 bg-red-900/40 border border-red-700/60 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label className="block text-xs text-slate-300 mb-1">Email</label>
            <input
              name="email"
              type="email"
              className="w-full border border-slate-700 rounded-md px-3 py-2 text-sm bg-slate-800/60 text-slate-100 
              placeholder:text-slate-500 focus:border-red-500 focus:ring-2 focus:ring-red-600/40 outline-none transition"
              placeholder="admin@trendly.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs text-slate-300 mb-1">Password</label>
            <input
              name="password"
              type="password"
              className="w-full border border-slate-700 rounded-md px-3 py-2 text-sm bg-slate-800/60 text-slate-100 
              placeholder:text-slate-500 focus:border-red-500 focus:ring-2 focus:ring-red-600/40 outline-none transition"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-500 transition text-white py-2 rounded-md text-sm font-medium 
            shadow-lg shadow-red-600/20 disabled:opacity-60"
          >
            {loading ? "Checking..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
