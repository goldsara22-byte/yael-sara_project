import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../components/AuthContext";
import SearchBar from "../components/SearchBar.jsx";
import AddPostForm from "../components/AddPostForm.jsx";
import DeleteButton from "../components/DeleteButton.jsx";
import PostEditor from "../components/PostEditor.jsx";
import CommentsPanel from "../components/CommentsPanel.jsx";

const API = "http://localhost:3000";

export default function PostsPage() {
  const { user } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [savingId, setSavingId] = useState(null);

  const [query, setQuery] = useState({ by: "title", text: "" });

  // בחירת פוסט להצגה מודגשת
  const [selectedPostId, setSelectedPostId] = useState(null);

  // פתיחה/סגירה של תגובות לפוסט שנבחר
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    if (!user) return;

    (async () => {
      try {
        setLoading(true);
        setErr("");

        // עדיף להביא רק של המשתמש
        const res = await fetch(`${API}/posts?userId=${encodeURIComponent(user.id)}`);
        if (!res.ok) throw new Error("fetch failed");
        const mine = await res.json();

        setPosts(mine);

        // אם אין בחירה עדיין - נבחר ראשון (אופציונלי)
        if (mine.length > 0) setSelectedPostId((prev) => prev ?? mine[0].id);
      } catch {
        setErr("שגיאה בטעינת posts");
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const filteredPosts = useMemo(() => {
    const q = (query.text || "").trim().toLowerCase();
    if (!q) return posts;

    return posts.filter((p) => {
      if (query.by === "id") return String(p.id).includes(q);
      if (query.by === "title") return String(p.title || "").toLowerCase().includes(q);
      return true;
    });
  }, [posts, query]);

  const selectedPost = useMemo(() => {
    return posts.find((p) => String(p.id) === String(selectedPostId)) || null;
  }, [posts, selectedPostId]);

  async function addPost({ title, body }) {
    const res = await fetch(`${API}/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        title,
        body,
      }),
    });

    if (!res.ok) throw new Error("post failed");
    const created = await res.json();
    setPosts((prev) => [created, ...prev]);
    setSelectedPostId(created.id);
    setShowComments(false);
  }

  async function deletePost(id) {
    const res = await fetch(`${API}/posts/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("delete failed");

    setPosts((prev) => prev.filter((p) => String(p.id) !== String(id)));
    if (String(selectedPostId) === String(id)) {
      setSelectedPostId(null);
      setShowComments(false);
    }
  }

  async function updatePost(id, patch) {
    try {
      setSavingId(id);

      const res = await fetch(`${API}/posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });

      if (!res.ok) throw new Error("patch failed");
      const updated = await res.json();

      setPosts((prev) => prev.map((p) => (String(p.id) === String(id) ? updated : p)));
    } finally {
      setSavingId(null);
    }
  }

  function selectPost(id) {
    setSelectedPostId(id);
    setShowComments(false); // כדי שהתגובות לא יישארו פתוחות על פוסט אחר בטעות
  }

  if (!user) return <div className="posts-page">אין משתמש מחובר</div>;
  if (loading) return <div className="posts-page">טוען...</div>;
  if (err) return <div className="posts-page">{err}</div>;

  return (
    <div className="posts-page">
      <h2 className="posts-title">Posts</h2>

      <div className="posts-controls">
        <SearchBar
          options={[
            { value: "id", label: "id" },
            { value: "title", label: "כותרת" },
          ]}
          placeholder="חיפוש פוסטים..."
          defaultBy="title"
          showStatus={false}
          onChange={setQuery}
        />

        <AddPostForm onAdd={addPost} />
      </div>

      <div className="posts-grid">
        {/* צד שמאל: סקירה */}
        <div className="posts-list">
          {filteredPosts.map((p) => {
            const isSelected = String(p.id) === String(selectedPostId);

            return (
              <div
                key={p.id}
                className={`post-row ${isSelected ? "selected" : ""}`}
              >
                <div className="post-row-main">
                  <div className="post-id">#{p.id}</div>
                  <div className="post-title">{p.title}</div>
                </div>

                <div className="post-row-actions">
                  <button
                    type="button"
                    onClick={() => selectPost(p.id)}
                    disabled={String(savingId) === String(p.id)}
                  >
                    בחר
                  </button>

                  <DeleteButton
                    onDelete={() => deletePost(p.id)}
                    disabled={String(savingId) === String(p.id)}
                    confirmText={`למחוק את post #${p.id}?`}
                  >
                    ❌
                  </DeleteButton>
                </div>
              </div>
            );
          })}

          {filteredPosts.length === 0 && (
            <div className="posts-empty">אין posts להצגה</div>
          )}
        </div>

        {/* צד ימין: פוסט נבחר + תוכן + תגובות */}
        <div className="post-details">
          {!selectedPost ? (
            <div className="post-placeholder">בחרי post כדי לראות תוכן</div>
          ) : (
            <>
              <div className="post-details-head">
                <div className="post-details-id">Post #{selectedPost.id}</div>
                <button
                  type="button"
                  onClick={() => setShowComments((v) => !v)}
                >
                  {showComments ? "הסתר תגובות" : "הצג תגובות"}
                </button>
              </div>

              <PostEditor
                post={selectedPost}
                disabled={String(savingId) === String(selectedPost.id)}
                onSave={(id, data) => updatePost(id, data)}
              />

              {showComments && (
                <CommentsPanel
                  post={selectedPost}
                  user={user}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
