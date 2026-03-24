import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { apiGet } from "../apiClient";

export default function MyActivity() {
  const { user } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState("likes");
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);

  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-2">My Activity</h1>
        <p className="text-sm text-gray-400">
          Please login to see your activity.
        </p>
      </div>
    );
  }

const loadData = async () => {
  setLoading(true);

  try {
    const [likesRes, commentsRes, bookmarksRes] = await Promise.all([
      apiGet(`/api/likes/user/${user.id}`),
      apiGet(`/api/comments/user/${user.id}`),
      apiGet(`/api/bookmarks/user/${user.id}`),
    ]);

    console.log("USER:", user);
    console.log("LIKES:", likesRes);
    console.log("COMMENTS:", commentsRes);
    console.log("BOOKMARKS:", bookmarksRes);

    setLikes(likesRes);
    setComments(commentsRes);
    setBookmarks(bookmarksRes);

  } catch (err) {
    console.error("Error loading activity", err);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    loadData();
  }, []);

const renderLikes = () => (
  <div className="space-y-4">

    {!likes.articleUrls || likes.articleUrls.length === 0 && (
      <p className="text-sm text-gray-400">No likes yet.</p>
    )}

    {likes.articleUrls?.map((url, index) => (
      <div
        key={index}
        className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500 transition"
      >
        <p className="text-xs text-slate-400 mb-1">Liked Article</p>

        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-semibold text-indigo-300 hover:underline break-all"
        >
          {url}
        </a>
      </div>
    ))}
  </div>
);


  const renderComments = () => (
    <div className="space-y-4">
      {comments.length === 0 && (
        <p className="text-sm text-gray-400">No comments yet.</p>
      )}

      {comments.map((c) => (
        <div
          key={c.id}
          className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500 transition"
        >
          <p className="text-xs text-slate-400">
            On:
            <a
              href={c.articleUrl}
              target="_blank"
              rel="noreferrer"
              className="ml-1 text-indigo-300 hover:underline"
            >
              {c.articleUrl.slice(0, 45)}...
            </a>
          </p>

          <p className="text-sm text-slate-200 mt-2">{c.content}</p>

          <p className="mt-2 text-[11px] text-slate-500">
            {c.createdAt?.replace("T", " ").slice(0, 19)}
          </p>
        </div>
      ))}
    </div>
  );

  const renderBookmarks = () => (
    <div className="space-y-4">
      {bookmarks.length === 0 && (
        <p className="text-sm text-gray-400">No bookmarks yet.</p>
      )}

      {bookmarks.map((b) => (
        <div
          key={b.id}
          className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500 transition"
        >
          <p className="text-xs text-slate-400 mb-1">{b.sourceName}</p>
          <h2 className="text-sm font-semibold text-slate-100">{b.title}</h2>
          <a
            href={b.articleUrl}
            target="_blank"
            rel="noreferrer"
            className="text-[11px] text-indigo-300 hover:underline mt-2 block"
          >
            Open →
          </a>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">

      {/* HEADER */}
      <h1 className="text-2xl font-bold text-slate-100">My Activity</h1>
      <p className="text-xs text-slate-400 mb-6">
        Your likes, comments and bookmarks in one place.
      </p>

      {/* TABS */}
      <div className="flex gap-2 mb-6">
        {["likes", "comments", "bookmarks"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-sm transition border 
              ${
                activeTab === tab
                  ? "bg-indigo-600 border-indigo-600 text-white"
                  : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div>
        {loading && <p className="text-sm text-slate-400">Loading…</p>}

        {!loading && activeTab === "likes" && renderLikes()}
        {!loading && activeTab === "comments" && renderComments()}
        {!loading && activeTab === "bookmarks" && renderBookmarks()}
      </div>
    </div>
  );
}
