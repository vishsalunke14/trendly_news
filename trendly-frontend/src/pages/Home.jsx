import { useEffect, useState } from "react";
import NewsCard from "../components/NewsCard";

const categories = [
  "All",
  "business",
  "technology",
  "sports",
  "entertainment",
  "health",
  "science",
];

// ── HERO ─────────────────────────────────────────────
function Hero({ search, setSearch, onSearchSubmit }) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-slate-900 px-5 py-6 shadow-2xl sm:px-8 sm:py-7">
      <div className="pointer-events-none absolute inset-0 opacity-60 mix-blend-screen">
        <div className="absolute -left-24 -top-24 h-40 w-40 rounded-full bg-indigo-300/40 blur-3xl" />
        <div className="absolute -bottom-20 right-0 h-48 w-48 rounded-full bg-cyan-300/30 blur-3xl" />
      </div>

      <div className="relative grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)] md:items-center">
        {/* LEFT */}
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-3 py-1 text-xs text-indigo-100 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.45)]" />
            <span>Live · Powered by Trendly</span>
          </div>

          <h1 className="text-balance text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
            Stay ahead with{" "}
            <span className="bg-gradient-to-r from-slate-50 via-indigo-100 to-cyan-200 bg-clip-text text-transparent">
              real-time trending news
            </span>
          </h1>

          <p className="mt-2 max-w-xl text-sm text-indigo-100/90 sm:text-[15px]">
            One clean feed for business, technology, sports and more. No
            clutter, no clickbait – just stories that actually matter to you.
          </p>
        </div>

        {/* RIGHT – search box */}
        <aside className="rounded-2xl border border-white/25 bg-slate-950/40 p-4 text-xs text-slate-50 backdrop-blur-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-indigo-200">
            Search the feed
          </p>
          <p className="mt-1 text-[13px] text-slate-100">
            Type any topic, company or keyword to filter articles instantly.
          </p>

          <form
            onSubmit={onSearchSubmit}
            className="mt-3 flex flex-col gap-2 sm:flex-row"
          >
            <input
              type="text"
              placeholder="Search news…"
              className="w-full flex-1 rounded-full border border-slate-700/70 bg-slate-900/80 px-4 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-slate-100 px-4 py-2 text-xs font-medium text-slate-900 transition hover:bg-white"
            >
              Search
            </button>
          </form>

          <div className="mt-3 flex gap-3 text-[11px] text-indigo-100/80">
            <span>🔍 Try: &quot;Technology&quot;</span>
            <span className="hidden sm:inline">· &quot;Cricket&quot;</span>
          </div>
        </aside>
      </div>
    </section>
  );
}

// ── CATEGORY TABS (for latest) ──────────────────────
function CategoryTabs({ activeCategory, onChange }) {
  return (
    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-xs text-slate-400 sm:text-[13px]">
        <span className="font-medium text-indigo-400">Explore</span> · Filter
        latest news by category
      </div>

      <div className="relative -mx-2 max-w-full overflow-x-auto px-2">
        <div className="flex gap-2 pb-1">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            const label =
              cat === "All" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1);

            return (
              <button
                key={cat}
                type="button"
                onClick={() => onChange(cat)}
                className={[
                  "whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition",
                  isActive
                    ? "border-indigo-500 bg-indigo-500/15 text-indigo-300 shadow-[0_12px_30px_rgba(15,23,42,0.85)]"
                    : "border-slate-700/70 bg-slate-900/70 text-slate-300 hover:border-slate-500 hover:bg-slate-900",
                ].join(" ")}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TrendingSidebar({ trendingNews, loadingTrending }) {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const hasItems = trendingNews && trendingNews.length > 0;

  // Ensure index is always safe
  const safeIndex =
    hasItems && index >= trendingNews.length ? 0 : index;

  // 🔄 Auto-slide every 1 second (but pause on hover)
  useEffect(() => {
    if (!hasItems || isHovered) return;

    const interval = setInterval(() => {
      setIndex((prev) => {
        if (!trendingNews.length) return 0;
        return prev === trendingNews.length - 1 ? 0 : prev + 1;
      });
    }, 2000); // 2 second

    return () => clearInterval(interval);
  }, [hasItems, isHovered, trendingNews.length]);

  const handlePrev = () => {
    if (!hasItems) return;
    setIndex((prev) =>
      prev === 0 ? trendingNews.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    if (!hasItems) return;
    setIndex((prev) =>
      prev === trendingNews.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <aside
      className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-slate-50 shadow-xl lg:sticky lg:top-24"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-slate-100">
          🔥 Trending now
        </h2>
        {hasItems && (
          <span className="text-[11px] text-slate-400">
            {safeIndex + 1} / {trendingNews.length}
          </span>
        )}
      </div>
      <p className="mt-1 text-[11px] text-slate-400">
        Most popular stories about India right now.
      </p>

      {loadingTrending ? (
        // ⏳ skeleton while trending loads
        <div className="mt-4 flex flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900/90 animate-pulse">
          <div className="h-28 bg-slate-800/90" />
          <div className="space-y-2 p-3.5">
            <div className="h-3 w-24 rounded bg-slate-700" />
            <div className="h-3 w-40 rounded bg-slate-700" />
            <div className="h-3 w-32 rounded bg-slate-700" />
          </div>
        </div>
      ) : !hasItems ? (
        <p className="mt-4 text-xs text-slate-500">
          No trending stories available right now.
        </p>
      ) : (
        <>
          {/* ⭐ Use full NewsCard here, but give each slide its own key */}
          <div className="mt-4">
            <NewsCard
              key={trendingNews[safeIndex].id}
              item={trendingNews[safeIndex]}
            />
          </div>

          {/* Slider controls */}
          <div className="mt-3 flex items-center justify-between">
            {/* dots */}
            <div className="flex gap-1.5">
              {trendingNews.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition ${
                    i === safeIndex
                      ? "w-4 bg-indigo-400"
                      : "w-2 bg-slate-600"
                  }`}
                />
              ))}
            </div>

            {/* arrows */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handlePrev}
                className="h-7 w-7 rounded-full border border-slate-700 bg-slate-900 text-xs text-slate-200 hover:bg-slate-800"
              >
                ←
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="h-7 w-7 rounded-full border border-slate-700 bg-slate-900 text-xs text-slate-200 hover:bg-slate-800"
              >
                →
              </button>
            </div>
          </div>
        </>
      )}
    </aside>
  );
}



// ── MAIN HOME COMPONENT ─────────────────────────────
export default function Home() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // trending
  const [trendingNews, setTrendingNews] = useState([]);
  const [loadingTrending, setLoadingTrending] = useState(false);

  const apiKey = import.meta.env.VITE_NEWS_API_KEY;
  const pageSize = 12;

  const buildQuery = () => {
    let base = "india";

    if (activeCategory !== "All") {
      base += ` ${activeCategory}`;
    }

    if (search.trim()) {
      base = search.trim();
      if (activeCategory !== "All") {
        base += ` ${activeCategory}`;
      }
    }

    return encodeURIComponent(base);
  };

  // ── LATEST NEWS ────────────────────────────────
  const fetchNews = async () => {
    if (!apiKey) {
      setError("Missing API key. Please set VITE_NEWS_API_KEY in .env");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const q = buildQuery();
      const url = `https://newsapi.org/v2/everything?q=${q}&language=en&sortBy=publishedAt&pageSize=${pageSize}&page=${page}&apiKey=${apiKey}`;

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();

      if (data.status !== "ok") {
        throw new Error(data.message || "Failed to fetch news");
      }

      const mapped = (data.articles || []).map((a, index) => ({
        id: a.url || `${index}-${page}`,
        title: a.title || "No title",
        desc: a.description || a.content || "No description available.",
        source: a.source?.name || "Unknown source",
        time: a.publishedAt
          ? new Date(a.publishedAt).toLocaleString()
          : "Unknown time",
        category: activeCategory === "All" ? "General" : activeCategory,
        imageUrl: a.urlToImage,
        url: a.url,
      }));

      setNews(mapped);

      const maxPages = 5;
      const total = Math.min(data.totalResults || 0, pageSize * maxPages);
      const pages = Math.max(1, Math.ceil(total / pageSize));
      setTotalPages(pages);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong while fetching news.");
    } finally {
      setLoading(false);
    }
  };

  // ── TRENDING NEWS (everything + popularity) ────
  const fetchTrending = async () => {
    if (!apiKey) return;

    try {
      setLoadingTrending(true);

      const url = `https://newsapi.org/v2/everything?q=india&language=en&sortBy=popularity&pageSize=6&apiKey=${apiKey}`;

      const res = await fetch(url);
      if (!res.ok) {
        console.error("Trending API error:", res.status);
        return;
      }

      const data = await res.json();
      if (data.status !== "ok") {
        console.error("Trending API status not ok:", data);
        return;
      }

      const mapped = (data.articles || []).map((a, index) => ({
        id: a.url || `trending-${index}`,
        title: a.title || "No title",
        desc: a.description || a.content || "No description available.",
        source: a.source?.name || "Unknown source",
        time: a.publishedAt
          ? new Date(a.publishedAt).toLocaleString()
          : "Unknown time",
        category: "Trending",
        imageUrl: a.urlToImage,
        url: a.url,
      }));

      setTrendingNews(mapped);
    } catch (err) {
      console.error("Failed to fetch trending:", err);
    } finally {
      setLoadingTrending(false);
    }
  };

  // latest depends on category/page
  useEffect(() => {
    fetchNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, page]);

  // trending once on mount
  useEffect(() => {
    fetchTrending();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchNews();
  };

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setPage(1);
  };

  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <main className="mx-auto flex max-w-6xl flex-col gap-5 px-4 pb-8 pt-6 sm:px-6 sm:pt-8">
        {/* HERO */}
        <Hero
          search={search}
          setSearch={setSearch}
          onSearchSubmit={handleSearchSubmit}
        />

        {/* CATEGORY TABS (for latest) */}
        <CategoryTabs
          activeCategory={activeCategory}
          onChange={handleCategoryChange}
        />

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mt-2 rounded-2xl border border-red-500/30 bg-red-950/40 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        )}

        {/* MAIN CONTENT: Latest (left) + Trending sidebar (right) */}
        <div className="mt-3 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.1fr)] lg:items-start">
          {/* LATEST NEWS (LEFT) */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-100 sm:text-base">
                🕒 Latest news
              </h2>
              <span className="text-[11px] text-slate-400">
                Page {page} of {totalPages}
              </span>
            </div>

            {loading ? (
              // skeletons
              <div className="grid gap-4 sm:grid-cols-2">
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
                      <div className="h-3 w-24 rounded bg-slate-700" />
                    </div>
                  </div>
                ))}
              </div>
            ) : !error && news.length === 0 ? (
              // empty state
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 px-6 py-10 text-center">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-xl">
                  📰
                </div>
                <h2 className="text-sm font-semibold text-slate-100">
                  No news found
                </h2>
                <p className="mt-1 max-w-sm text-xs text-slate-400">
                  Try a different search term or switch to another category to
                  discover more stories.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {news.map((item) => (
                  <NewsCard key={item.id} item={item} />
                ))}
              </div>
            )}

            {/* PAGINATION (only for latest) */}
            {!loading && !error && news.length > 0 && (
              <div className="mt-6 flex items-center justify-between text-xs text-slate-300 sm:text-sm">
                <span>
                  Page {page} of {totalPages}
                </span>

                <div className="flex gap-2">
                  <button
                    disabled={!canPrev}
                    onClick={() => canPrev && setPage((p) => p - 1)}
                    className={`rounded-full border px-3 py-1 transition ${
                      canPrev
                        ? "border-slate-600 bg-slate-900 hover:bg-slate-800"
                        : "border-slate-800 bg-slate-900 text-slate-600 cursor-not-allowed"
                    }`}
                  >
                    ← Previous
                  </button>
                  <button
                    disabled={!canNext}
                    onClick={() => canNext && setPage((p) => p + 1)}
                    className={`rounded-full border px-3 py-1 transition ${
                      canNext
                        ? "border-slate-600 bg-slate-900 hover:bg-slate-800"
                        : "border-slate-800 bg-slate-900 text-slate-600 cursor-not-allowed"
                    }`}
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* TRENDING SIDEBAR (RIGHT) */}
          <TrendingSidebar
            trendingNews={trendingNews}
            loadingTrending={loadingTrending}
          />
        </div>
      </main>
    </div>
  );
}
