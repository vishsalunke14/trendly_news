import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiPost } from "../apiClient";
import { AuthContext } from "../context/AuthContext";

export default function Register() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

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
      const user = await apiPost("/api/auth/register", form);
      login(user); // auto-login
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Could not register. Email might already be used.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-xl p-6">
        {/* Logo / Title */}
        <div className="flex flex-col items-center mb-4">
          <h1 className="text-3xl font-extrabold tracking-wide bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-300 bg-clip-text text-transparent">
            Trendly
          </h1>
          <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-400 via-green-400 to-red-400 mt-1 animate-pulse shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
        </div>

        <h2 className="text-lg font-semibold text-center text-slate-50">
          Create your account
        </h2>
        <p className="text-center text-[13px] text-slate-400 mb-4">
          Register to save bookmarks and track your reading activity.
        </p>

        {error && (
          <div className="mb-3 text-xs text-red-300 bg-red-900/40 border border-red-700/60 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="block text-xs text-slate-300 mb-1">Name</label>
            <input
              name="name"
              type="text"
              className="w-full border border-slate-700 rounded-md px-3 py-2 text-sm bg-slate-800/60 text-slate-100 
              placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 outline-none transition"
              placeholder="Your full name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs text-slate-300 mb-1">Email</label>
            <input
              name="email"
              type="email"
              className="w-full border border-slate-700 rounded-md px-3 py-2 text-sm bg-slate-800/60 text-slate-100 
              placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 outline-none transition"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs text-slate-300">Password</label>
              <span className="text-[10px] text-slate-500">
                Min. 6 characters
              </span>
            </div>
            <input
              name="password"
              type="password"
              className="w-full border border-slate-700 rounded-md px-3 py-2 text-sm bg-slate-800/60 text-slate-100 
              placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 outline-none transition"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 transition text-white py-2 rounded-md text-sm font-medium 
            shadow-lg shadow-indigo-600/20 disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-400 hover:underline transition"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
