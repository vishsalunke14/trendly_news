import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { apiGet, apiDelete } from "../apiClient";

export default function Bookmarks() {
  const { user } = useContext(AuthContext);

  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadBookmarks = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError("");
      const data = await apiGet(`/api/bookmarks/user/${user.id}`);
      setBookmarks(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load bookmarks.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookmarkId) => {
    if (!user) return;

    try {
      await apiDelete(`/api/bookmarks/${bookmarkId}?userId=${user.id}`);
      setBookmarks((prev) => prev.filter((b) => b.id !== bookmarkId));
    } catch (err) {
      console.error(err);
      alert("Failed to remove bookmark.");
    }
  };

  useEffect(() => {
    loadBookmarks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Not logged in UI
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-center shadow-xl">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-lg">
            🔐
          </div>
          <h1 className="text-lg font-semibold text-slate-50">
            Bookmarks are private
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Please log in to view and manage your bookmarked articles.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <main className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
              Your bookmarks
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              All the articles you&apos;ve saved to read or revisit later.
            </p>
          </div>

          {bookmarks.length > 0 && !loading && (
            <span className="text-[11px] text-slate-400">
              {bookmarks.length} saved{" "}
              {bookmarks.length === 1 ? "article" : "articles"}
            </span>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="text-xs text-red-300 bg-red-900/40 border border-red-700/60 px-3 py-2 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="flex h-56 flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 animate-pulse"
              >
                <div className="h-24 bg-slate-800/90" />
                <div className="flex-1 space-y-2 p-4">
                  <div className="h-3 w-20 rounded bg-slate-700" />
                  <div className="h-3 w-40 rounded bg-slate-700" />
                  <div className="h-3 w-32 rounded bg-slate-700" />
                  <div className="h-3 w-16 rounded bg-slate-700" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && bookmarks.length === 0 && !error && (
          <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 px-6 py-10 text-center">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-xl">
              📎
            </div>
            <h2 className="text-sm font-semibold text-slate-100">
              No bookmarks yet
            </h2>
            <p className="mt-1 max-w-md text-xs text-slate-400">
              Go to the home page and tap <span className="font-semibold">“★ Bookmark”</span> on
              articles you want to save. They&apos;ll appear here.
            </p>
          </div>
        )}

        {/* Bookmarks grid */}
        {!loading && bookmarks.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-2">
            {bookmarks.map((b) => (
              <article
                key={b.id}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-950 shadow-2xl transition hover:-translate-y-1 hover:border-indigo-500/70 hover:shadow-[0_24px_55px_rgba(15,23,42,0.95)]"
              >
                {/* Image */}
                {b.imageUrl && (
                  <a
                    href={b.articleUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="relative block overflow-hidden"
                  >
                    <img
                      src={b.imageUrl}
                      alt={b.title}
                      className="h-40 w-full object-cover transition duration-200 group-hover:scale-[1.05] group-hover:brightness-110"
                    />
                    <span className="absolute bottom-2 left-2 rounded-full bg-slate-950/85 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-slate-100 shadow-sm ring-1 ring-slate-700/80">
                      Saved
                    </span>
                  </a>
                )}

                {/* Body */}
                <div className="p-3.5 flex-1 flex flex-col">
                  <p className="text-[11px] text-slate-400 mb-1">
                    {b.sourceName || "Unknown source"}
                  </p>

                  <h2 className="text-[15px] font-semibold leading-snug tracking-tight text-slate-50 line-clamp-3">
                    {b.title}
                  </h2>

                  <a
                    href={b.articleUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 text-[11px] text-indigo-300 hover:underline"
                  >
                    Open article →
                  </a>

                  <button
                    onClick={() => handleDelete(b.id)}
                    className="mt-3 inline-flex items-center gap-1 text-[11px] px-3 py-1 rounded-full border border-red-500/70 text-red-300 hover:bg-red-500/10 self-start transition"
                  >
                    <span>Remove</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
