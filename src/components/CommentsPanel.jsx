import { useEffect, useMemo, useState } from "react";
import DeleteButton from "./DeleteButton.jsx";

const API = "http://localhost:3000";

export default function CommentsPanel({ post, user }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [newBody, setNewBody] = useState("");
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    if (!post?.id) return;

    (async () => {
      try {
        setLoading(true);
        setErr("");

        const res = await fetch(`${API}/comments?postId=${encodeURIComponent(post.id)}`);
        if (!res.ok) throw new Error("fetch failed");
        const data = await res.json();
        setComments(data);
      } catch {
        setErr("שגיאה בטעינת comments");
      } finally {
        setLoading(false);
      }
    })();
  }, [post?.id]);

  const canAdd = newBody.trim().length > 0 && !savingId;

  async function addComment() {
    if (!canAdd) return;

    try {
      setSavingId("new");

      const payload = {
        postId: post.id,
        name: user?.name || "user",
        email: user?.email || "user@mail",
        body: newBody.trim(),
        userId: user?.id, // חשוב להרשאות
      };

      const res = await fetch(`${API}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("post failed");
      const created = await res.json();
      setComments((prev) => [created, ...prev]);
      setNewBody("");
    } catch {
      alert("שגיאה בהוספת comment");
    } finally {
      setSavingId(null);
    }
  }

  function isMine(c) {
    if (c.userId != null) return String(c.userId) === String(user?.id);
    // fallback אם אין userId בנתונים ישנים
    return user?.email && String(c.email) === String(user.email);
  }

  async function deleteComment(id) {
    const res = await fetch(`${API}/comments/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("delete failed");
    setComments((prev) => prev.filter((c) => String(c.id) !== String(id)));
  }

  async function updateComment(id, body) {
    try {
      setSavingId(id);

      const res = await fetch(`${API}/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });

      if (!res.ok) throw new Error("patch failed");
      const updated = await res.json();

      setComments((prev) => prev.map((c) => (String(c.id) === String(id) ? updated : c)));
    } finally {
      setSavingId(null);
    }
  }

  if (loading) return <div style={{ marginTop: 12 }}>טוען תגובות...</div>;
  if (err) return <div style={{ marginTop: 12 }}>{err}</div>;

  return (
    <div style={{ marginTop: 16, borderTop: "1px solid #ddd", paddingTop: 12 }}>
      <h4 style={{ marginTop: 0 }}>Comments</h4>

      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <input
          value={newBody}
          onChange={(e) => setNewBody(e.target.value)}
          placeholder="הוסף תגובה..."
          style={{ minWidth: 320 }}
          disabled={!!savingId}
        />
        <button type="button" onClick={addComment} disabled={!canAdd}>
          {savingId === "new" ? "מוסיף..." : "הוסף"}
        </button>
      </div>

      <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
        {comments.map((c) => (
          <CommentRow
            key={c.id}
            comment={c}
            mine={isMine(c)}
            disabled={String(savingId) === String(c.id)}
            onDelete={() => deleteComment(c.id)}
            onSave={(txt) => updateComment(c.id, txt)}
          />
        ))}

        {comments.length === 0 && <div>אין תגובות לפוסט הזה</div>}
      </div>
    </div>
  );
}

function CommentRow({ comment, mine, disabled, onDelete, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(comment.body ?? "");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditing) setDraft(comment.body ?? "");
  }, [comment.body, isEditing]);

  const trimmed = String(draft ?? "").trim();

  async function save() {
    if (!trimmed) {
      setError("חובה למלא תוכן");
      return;
    }
    await onSave(trimmed);
    setIsEditing(false);
  }

  return (
    <div style={{ border: "1px solid #eee", padding: 10, borderRadius: 8 }}>
      <div style={{ fontSize: 12, opacity: 0.8 }}>
        #{comment.id} · {comment.email || "unknown"}
      </div>

      {!isEditing ? (
        <div style={{ whiteSpace: "pre-wrap" }}>{comment.body}</div>
      ) : (
        <div style={{ display: "grid", gap: 6 }}>
          <textarea
            rows={3}
            value={draft}
            onChange={(e) => { setDraft(e.target.value); if (error) setError(""); }}
            disabled={disabled}
          />
          {error && <div style={{ color: "red" }}>{error}</div>}
        </div>
      )}

      {mine && (
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          {!isEditing ? (
            <button type="button" onClick={() => setIsEditing(true)} disabled={disabled}>
              ✏️ עריכה
            </button>
          ) : (
            <>
              <button type="button" onClick={save} disabled={disabled}>
                שמור
              </button>
              <button
                type="button"
                onClick={() => { setIsEditing(false); setDraft(comment.body ?? ""); setError(""); }}
                disabled={disabled}
              >
                ביטול
              </button>
            </>
          )}

          <DeleteButton
            onDelete={onDelete}
            disabled={disabled}
            confirmText={`למחוק comment #${comment.id}?`}
          >
            ❌
          </DeleteButton>
        </div>
      )}

      {!mine && (
        <div style={{ marginTop: 8, fontSize: 12, opacity: 0.7 }}>
          (אין הרשאה לערוך/למחוק תגובה שאינה שלך)
        </div>
      )}
    </div>
  );
}
