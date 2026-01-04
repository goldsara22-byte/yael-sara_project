import { useEffect, useMemo, useState } from "react";

export default function PostEditor({ post, disabled = false, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(post?.title ?? "");
  const [draftBody, setDraftBody] = useState(post?.body ?? "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      setDraftTitle(post?.title ?? "");
      setDraftBody(post?.body ?? "");
      setError("");
      setLoading(false);
    }
  }, [post?.id]); // כשעוברים לפוסט אחר

  const trimmedTitle = String(draftTitle ?? "").trim();
  const trimmedBody = String(draftBody ?? "").trim();

  const isDirty = useMemo(() => {
    return (
      trimmedTitle !== String(post?.title ?? "").trim() ||
      trimmedBody !== String(post?.body ?? "").trim()
    );
  }, [trimmedTitle, trimmedBody, post?.title, post?.body]);

  function startEdit() {
    if (disabled || loading) return;
    setIsEditing(true);
    setError("");
  }

  function cancel() {
    setIsEditing(false);
    setDraftTitle(post?.title ?? "");
    setDraftBody(post?.body ?? "");
    setError("");
  }

  async function save() {
    if (disabled || loading) return;

    if (!trimmedTitle || !trimmedBody) {
      setError("חובה למלא כותרת ותוכן");
      return;
    }
    if (!isDirty) {
      setIsEditing(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      await onSave(post.id, { title: trimmedTitle, body: trimmedBody });
      setIsEditing(false);
    } catch {
      setError("שגיאה בשמירה");
    } finally {
      setLoading(false);
    }
  }

  if (!post) return null;

  if (!isEditing) {
    return (
      <div>
        <h3 style={{ marginTop: 0 }}>{post.title}</h3>
        <p style={{ whiteSpace: "pre-wrap" }}>{post.body}</p>

        <button type="button" onClick={startEdit} disabled={disabled}>
          ✏️ עריכה
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <input
        value={draftTitle}
        onChange={(e) => { setDraftTitle(e.target.value); if (error) setError(""); }}
        disabled={disabled || loading}
        placeholder="כותרת..."
      />
      <textarea
        value={draftBody}
        onChange={(e) => { setDraftBody(e.target.value); if (error) setError(""); }}
        disabled={disabled || loading}
        placeholder="תוכן..."
        rows={6}
      />

      <div style={{ display: "flex", gap: 8 }}>
        <button type="button" onClick={save} disabled={disabled || loading}>
          {loading ? "שומר..." : "שמור"}
        </button>
        <button type="button" onClick={cancel} disabled={disabled || loading}>
          ביטול
        </button>
      </div>

      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
}
