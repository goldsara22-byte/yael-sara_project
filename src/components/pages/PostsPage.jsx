import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../AuthContext.jsx";
import SearchBar from "../shared/SearchBar.jsx";
import AddPostForm from "../posts/AddPostForm.jsx";
import DeleteButton from "../shared/DeleteButton.jsx";
import PostEditor from "../posts/PostEditor.jsx";
import CommentsPanel from "../posts/CommentsPanel.jsx";


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
