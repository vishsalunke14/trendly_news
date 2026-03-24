import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { apiGet, apiDelete } from "../apiClient";
import { useNavigate } from "react-router-dom";

export default function AdminComments() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // only admins should see this page
  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      navigate("/admin/login");
    }
  }, [user, navigate]);

  const loadComments = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await apiGet("/api/admin/comments");
      setComments(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load comments.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!user) return;

    const ok = confirm("Delete this comment?");
    if (!ok) return;

    try {
      await apiDelete(`/api/admin/comments/${id}?adminId=${user.id}`);
      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete comment.");
    }
  };

  useEffect(() => {
    if (user && user.role === "ADMIN") {
      loadComments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Admin – Comments
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Moderate user comments across all articles.
            </p>
          </div>

          {!loading && comments.length > 0 && (
            <span className="text-[11px] text-slate-400">
              {comments.length}{" "}
              {comments.length === 1 ? "comment" : "comments"} loaded
            </span>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-3 text-xs text-red-300 bg-red-900/40 border border-red-700/60 px-3 py-2 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="mt-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-xl">
            <p className="text-xs text-slate-400 mb-2">Loading comments…</p>
            <div className="space-y-2 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-8 rounded-md bg-slate-800/80"
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && comments.length === 0 && !error && (
          <div className="mt-3 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 px-6 py-10 text-center">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-xl">
              💬
            </div>
            <h2 className="text-sm font-semibold text-slate-100">
              No comments found
            </h2>
            <p className="mt-1 max-w-md text-xs text-slate-400">
              Once users start commenting on articles, they will appear here for
              moderation and review.
            </p>
          </div>
        )}

        {/* Table */}
        {!loading && comments.length > 0 && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-[11px]">
                <thead className="bg-slate-900 border-b border-slate-800">
                  <tr className="text-slate-300">
                    <th className="px-3 py-2 text-left font-medium">ID</th>
                    <th className="px-3 py-2 text-left font-medium">User</th>
                    <th className="px-3 py-2 text-left font-medium">
                      Article URL
                    </th>
                    <th className="px-3 py-2 text-left font-medium">
                      Content
                    </th>
                    <th className="px-3 py-2 text-left font-medium">
                      Created At
                    </th>
                    <th className="px-3 py-2 text-left font-medium">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comments.map((c, idx) => (
                    <tr
                      key={c.id}
                      className={`border-b border-slate-800/70 ${
                        idx % 2 === 0 ? "bg-slate-950/40" : "bg-slate-900/40"
                      } hover:bg-slate-800/60 transition`}
                    >
                      <td className="px-3 py-2 align-top">
                        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-200">
                          #{c.id}
                        </span>
                      </td>

                      <td className="px-3 py-2 align-top text-slate-200">
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {c.userName || "Unknown"}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            ID: {c.userId}
                          </span>
                        </div>
                      </td>

                      <td className="px-3 py-2 align-top max-w-xs">
                        <a
                          href={c.articleUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-300 hover:underline truncate block"
                          title={c.articleUrl}
                        >
                          {c.articleUrl}
                        </a>
                      </td>

                      <td className="px-3 py-2 align-top max-w-xs text-slate-100">
                        <span className="line-clamp-2">{c.content}</span>
                      </td>

                      <td className="px-3 py-2 align-top text-slate-300">
                        {c.createdAt
                          ? c.createdAt.replace("T", " ").slice(0, 19)
                          : "-"}
                      </td>

                      <td className="px-3 py-2 align-top">
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="px-3 py-1 rounded-full border border-red-500/70 text-red-300 hover:bg-red-500/10 text-[11px] transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
