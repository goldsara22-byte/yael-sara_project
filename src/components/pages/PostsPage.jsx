import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../AuthContext.jsx";
import SearchBar from "../shared/SearchBar.jsx";
import DeleteButton from "../shared/DeleteButton.jsx";
 import { postPostForUser } from "../../API/postAPI.js";
import { filtered } from "../../jsHelper/post.js";

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


  async function addPost(title, body) {
    try {
      const created = await postPostForUser(user, title, body);
      setTodos((prev) => [created, ...prev]);
    } catch (err) {
      setErr("שגיאה בהוספת todo");
      return;
    }
  }

  const filteredPosts = useMemo(() => {
    filtered(posts, query);
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

        <AddItemBar
          onAdd={addPost}
          onError={() => setErr("שגיאה בהוספת todo")}
          user={user}
        />

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
