import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiPost } from "../apiClient";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await apiPost("/api/auth/login", form);
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
        
        {/* Logo */}
        <div className="flex flex-col items-center mb-4">
          <h1 className="text-3xl font-extrabold tracking-wide bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-300 bg-clip-text text-transparent">
            Trendly
          </h1>

          <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-400 via-green-400 to-red-400 mt-1 animate-pulse shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
        </div>

        <p className="text-center text-[13px] text-slate-400 mb-4">
          Sign in to continue reading and tracking your activity.
        </p>

        {error && (
          <div className="mb-4 text-xs text-red-400 bg-red-900/30 border border-red-600/40 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          
          {/* Email */}
          <div>
            <label className="text-xs text-slate-300 mb-1 block">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full px-3 py-2 text-sm rounded-md bg-slate-800/60 border border-slate-700 text-slate-100 
              placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 outline-none transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-xs text-slate-300 mb-1 block">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="w-full px-3 py-2 text-sm rounded-md bg-slate-800/60 border border-slate-700 text-slate-100 
              placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 outline-none transition"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 transition text-white py-2 rounded-md text-sm font-medium 
            shadow-lg shadow-indigo-600/20 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-400">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-400 hover:underline transition"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
