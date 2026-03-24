import { useContext, useState } from "react";
import { FiLink } from "react-icons/fi";
import { FaWhatsapp, FaTelegramPlane, FaFacebookSquare } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { apiPost } from "../apiClient";
import CommentsSection from "./CommentsSection";


export default function NewsCard({ item }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(null);
  const [savingLike, setSavingLike] = useState(false);

  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkSaving, setBookmarkSaving] = useState(false);

  const [showComments, setShowComments] = useState(false);

  // 🔹 NEW: share popup state
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);

  const [error, setError] = useState("");

  const handleLike = async () => {
    setError("");

    if (!user) {
      navigate("/login");
      return;
    }

    if (!item.url) {
      setError("This article has no URL.");
      return;
    }

    try {
      setSavingLike(true);

      const res = await apiPost("/api/likes/toggle", {
        userId: user.id,
        articleUrl: item.url,
      });

      setLiked(res.liked);
      setLikeCount(res.likeCount);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to like/unlike.");
    } finally {
      setSavingLike(false);
    }
  };

  const handleBookmark = async () => {
    setError("");

    if (!user) {
      navigate("/login");
      return;
    }

    if (!item.url) {
      setError("This article has no URL to bookmark.");
      return;
    }

    try {
      setBookmarkSaving(true);

      await apiPost("/api/bookmarks", {
        userId: user.id,
        articleUrl: item.url,
        title: item.title,
        sourceName: item.source,
        imageUrl: item.imageUrl,
      });

      setBookmarked(true);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to bookmark.");
    } finally {
      setBookmarkSaving(false);
    }
  };

  const handleOpen = () => {
    if (item.url) {
      window.open(item.url, "_blank", "noopener,noreferrer");
    }
  };

  const handleCopyLink = () => {
    if (!item.url) return;
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(item.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-950 shadow-2xl transition hover:-translate-y-1 hover:border-indigo-500/80 hover:shadow-[0_24px_55px_rgba(15,23,42,0.95)]">
      {/* IMAGE */}
      {item.imageUrl && (
        <button
          type="button"
          onClick={handleOpen}
          className="relative block overflow-hidden"
        >
          <img
            src={item.imageUrl}
            alt={item.title}
            className="h-40 w-full origin-center object-cover transition duration-200 group-hover:scale-[1.05] group-hover:brightness-110"
          />

          {item.category && (
            <span className="absolute bottom-2 left-2 rounded-full bg-slate-950/85 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-slate-100 shadow-sm ring-1 ring-slate-700/80">
              {item.category}
            </span>
          )}
        </button>
      )}

      {/* BODY */}
      <div className="flex flex-1 flex-col px-3.5 py-3">
        <p className="mb-1 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
          <span className="rounded-full border border-slate-700/80 bg-slate-900/80 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-slate-200">
            {item.source}
          </span>
          <span className="text-[10px] text-slate-500">•</span>
          <span>{item.time}</span>
        </p>

        <h2 className="text-[15px] font-semibold leading-snug tracking-tight text-slate-50">
          {item.title}
        </h2>

        <p className="mt-2 text-xs leading-relaxed text-slate-400">
          {item.desc}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {item.category && (
            <span className="text-[11px] px-2 py-1 rounded-full bg-slate-800/80 text-slate-200 border border-slate-700">
              {item.category}
            </span>
          )}

          <div className="ml-auto flex items-center gap-2">
            {/* Like */}
            <button
              onClick={handleLike}
              disabled={savingLike}
              className={`text-[11px] sm:text-xs px-3 py-1 rounded-full border transition ${
                liked
                  ? "bg-pink-100/10 text-pink-300 border-pink-400/60"
                  : "border-slate-700 bg-slate-900 hover:bg-slate-800"
              } disabled:opacity-60`}
            >
              {liked ? "♥ Liked" : "♡ Like"}
              {likeCount !== null && (
                <span className="ml-1 text-[10px] text-slate-400">
                  ({likeCount})
                </span>
              )}
            </button>

            {/* Bookmark */}
            <button
              onClick={handleBookmark}
              disabled={bookmarkSaving || bookmarked}
              className={`text-[11px] sm:text-xs px-3 py-1 rounded-full border transition ${
                bookmarked
                  ? "bg-emerald-100/10 text-emerald-300 border-emerald-400/60 cursor-default"
                  : "border-amber-400/80 bg-amber-400/80 text-slate-900 hover:bg-amber-300"
              } disabled:opacity-60`}
            >
              {bookmarked
                ? "Bookmarked"
                : bookmarkSaving
                ? "Saving..."
                : "★ Bookmark"}
            </button>

            {/* Comments toggle */}
            <button
              onClick={() => setShowComments((prev) => !prev)}
              className="text-[11px] sm:text-xs px-3 py-1 rounded-full border border-slate-700 bg-slate-900 hover:bg-slate-800"
            >
              {showComments ? "Hide Comments" : "Comments"}
            </button>

            {/* Share toggle */}
            <button
              onClick={() => setShowShare((prev) => !prev)}
              className="text-[11px] sm:text-xs px-3 py-1 rounded-full border border-slate-700 bg-slate-900 hover:bg-slate-800"
            >
              Share
            </button>
          </div>
        </div>

        {item.url && (
          <button
            type="button"
            onClick={handleOpen}
            className="mt-3 text-[11px] text-indigo-300 hover:underline text-left"
          >
            Read full article →
          </button>
        )}

        {error && (
          <p className="mt-2 text-[11px] text-red-400">
            {error}
          </p>
        )}

        {/* 🔹 SHARE POPUP */}
 {showShare && (
  <div className="mt-3 rounded-xl border border-slate-800 bg-slate-900/90 p-3 shadow-xl flex items-center justify-around gap-6">

    {/* Copy Link */}
    <button
      onClick={handleCopyLink}
      className="flex flex-col items-center text-slate-300 hover:text-white transition"
      title="Copy Link"
    >
      <FiLink className="text-2xl" />
      {copied && (
        <span className="mt-1 text-[10px] text-emerald-400">Copied!</span>
      )}
    </button>

    {/* WhatsApp */}
    <a
      href={`https://wa.me/?text=${encodeURIComponent(item.title + " - " + item.url)}`}
      target="_blank"
      rel="noreferrer"
      className="text-green-500 hover:text-green-400 transition"
      title="Share on WhatsApp"
    >
      <FaWhatsapp className="text-2xl" />
    </a>

    {/* Telegram */}
    <a
      href={`https://t.me/share/url?url=${encodeURIComponent(item.url)}&text=${encodeURIComponent(item.title)}`}
      target="_blank"
      rel="noreferrer"
      className="text-sky-400 hover:text-sky-300 transition"
      title="Share on Telegram"
    >
      <FaTelegramPlane className="text-2xl" />
    </a>

    {/* Facebook */}
    <a
      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(item.url)}`}
      target="_blank"
      rel="noreferrer"
      className="text-blue-600 hover:text-blue-500 transition"
      title="Share on Facebook"
    >
      <FaFacebookSquare className="text-2xl" />
    </a>
  </div>
)}



        {/* COMMENTS */}
        {showComments && (
          <div className="mt-3 rounded-xl border border-slate-800 bg-slate-900/80 p-2">
            <CommentsSection articleUrl={item.url} />
          </div>
        )}
      </div>
    </article>
  );
}
