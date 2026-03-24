import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { apiGet, apiPost, apiDelete } from "../apiClient";

export default function CommentsSection({ articleUrl }) {
  const { user } = useContext(AuthContext);

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");

  const loadComments = async () => {
    if (!articleUrl) return;
    try {
      setLoading(true);
      setError("");
      const encoded = encodeURIComponent(articleUrl);
      const data = await apiGet(`/api/comments?articleUrl=${encoded}`);
      setComments(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load comments.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("Please login to comment.");
      return;
    }
    if (!newComment.trim()) return;

    try {
      setPosting(true);
      setError("");

      const created = await apiPost("/api/comments", {
        userId: user.id,
        userName: user.name,
        articleUrl,
        content: newComment.trim(),
      });

      // Add new comment to top of list
      setComments((prev) => [created, ...prev]);
      setNewComment("");
    } catch (err) {
      console.error(err);
      setError("Failed to add comment.");
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!user) return;

    try {
      await apiDelete(`/api/comments/${commentId}?userId=${user.id}`);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete comment.");
    }
  };

  useEffect(() => {
    loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleUrl]);

  if (!articleUrl) {
    return (
      <p className="text-xs text-gray-500 mt-2">
        Comments are not available for this article.
      </p>
    );
  }

  return (
    <div className="mt-3 border-t pt-3">
      <h3 className="text-sm font-semibold mb-2">Comments</h3>

      {error && (
        <p className="text-xs text-red-600 mb-2">
          {error}
        </p>
      )}

      {/* Add comment form */}
      <form onSubmit={handleSubmit} className="mb-3">
        <textarea
          className="w-full border rounded-md px-2 py-1 text-xs resize-none"
          rows={2}
          placeholder={
            user ? "Write a comment..." : "Login to share your thoughts..."
          }
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={!user || posting}
        />
        <div className="flex justify-end mt-1">
          <button
            type="submit"
            disabled={!user || posting || !newComment.trim()}
            className="text-xs px-3 py-1 rounded-full bg-blue-600 text-white disabled:opacity-60"
          >
            {posting ? "Posting..." : "Post"}
          </button>
        </div>
      </form>

      {/* Comments list */}
      {loading && (
        <p className="text-xs text-gray-500">Loading comments…</p>
      )}

      {!loading && comments.length === 0 && (
        <p className="text-xs text-gray-500">No comments yet. Be the first!</p>
      )}

      {!loading && comments.length > 0 && (
        <ul className="space-y-2 max-h-52 overflow-y-auto pr-1">
          {comments.map((c) => (
            <li
              key={c.id}
              className="border rounded-md px-2 py-1 text-xs bg-gray-50"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-[11px]">
                  {c.userName}
                </span>
                {user && user.id === c.userId && (
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="text-[10px] text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                )}
              </div>
              <p className="text-[11px] text-gray-700">
                {c.content}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
