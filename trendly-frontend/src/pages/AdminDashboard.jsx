import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { apiGet } from "../apiClient";

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      navigate("/admin/login");
    }
  }, [user]);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await apiGet("/api/admin/analytics/summary");
      setStats(data);
    } catch (err) {
      setError("Failed to load analytics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === "ADMIN") loadStats();
  }, [user]);

  if (!user || user.role !== "ADMIN") return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-extrabold tracking-wide bg-gradient-to-r from-red-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Overview of users, likes, comments and bookmarks.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="text-sm text-red-300 bg-red-900/40 border border-red-700/60 px-3 py-2 rounded-lg">
            {error}
          </div>
        )}

        {loading && <p className="text-sm text-slate-400">Loading stats…</p>}

        {/* Stats Cards */}
        {stats && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {/* Users */}
              <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-5 shadow-xl hover:-translate-y-1 transition transform">
                <p className="text-xs text-slate-400">Total Users</p>
                <p className="text-3xl font-bold mt-1 text-indigo-300">
                  {stats.totalUsers}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Admins: {stats.totalAdmins} • Users: {stats.totalNormalUsers}
                </p>
              </div>

              {/* Likes */}
              <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-5 shadow-xl hover:-translate-y-1 transition transform">
                <p className="text-xs text-slate-400">Total Likes</p>
                <p className="text-3xl font-bold mt-1 text-pink-300">
                  {stats.totalLikes}
                </p>
              </div>

              {/* Comments */}
              <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-5 shadow-xl hover:-translate-y-1 transition transform">
                <p className="text-xs text-slate-400">Total Comments</p>
                <p className="text-3xl font-bold mt-1 text-green-300">
                  {stats.totalComments}
                </p>
              </div>

              {/* Bookmarks */}
              <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-5 shadow-xl hover:-translate-y-1 transition transform">
                <p className="text-xs text-slate-400">Total Bookmarks</p>
                <p className="text-3xl font-bold mt-1 text-yellow-300">
                  {stats.totalBookmarks}
                </p>
              </div>

            </div>

            {/* Top Articles */}
            <div className="grid gap-6 lg:grid-cols-2">

              {/* Top Liked Articles */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl p-5 shadow-xl">
                <h2 className="text-sm font-semibold text-slate-200 mb-3">
                  🔥 Top Liked Articles
                </h2>

                {!stats.topLikedArticles?.length && (
                  <p className="text-xs text-slate-500">No data yet.</p>
                )}

                {stats.topLikedArticles?.length > 0 && (
                  <ul className="space-y-2 text-xs">
                    {stats.topLikedArticles.map((a, idx) => (
                      <li
                        key={a.articleUrl + idx}
                        className="flex justify-between items-center border border-slate-700/50 rounded-md px-3 py-2 bg-slate-900/40"
                      >
                        <a
                          href={a.articleUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-300 hover:underline truncate max-w-[70%]"
                        >
                          {a.articleUrl}
                        </a>

                        <span className="px-2 py-0.5 rounded-full text-[11px] bg-slate-700/60 text-slate-200">
                          {a.count} likes
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Top Commented Articles */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl p-5 shadow-xl">
                <h2 className="text-sm font-semibold text-slate-200 mb-3">
                  💬 Top Commented Articles
                </h2>

                {!stats.topCommentedArticles?.length && (
                  <p className="text-xs text-slate-500">No data yet.</p>
                )}

                {stats.topCommentedArticles?.length > 0 && (
                  <ul className="space-y-2 text-xs">
                    {stats.topCommentedArticles.map((a, idx) => (
                      <li
                        key={a.articleUrl + idx}
                        className="flex justify-between items-center border border-slate-700/50 rounded-md px-3 py-2 bg-slate-900/40"
                      >
                        <a
                          href={a.articleUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-300 hover:underline truncate max-w-[70%]"
                        >
                          {a.articleUrl}
                        </a>

                        <span className="px-2 py-0.5 rounded-full text-[11px] bg-slate-700/60 text-slate-200">
                          {a.count} comments
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

            </div>
          </>
        )}
      </div>
    </div>
  );
}
