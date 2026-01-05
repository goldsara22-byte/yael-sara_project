import { useState } from "react";

export default function AddPostForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = title.trim().length > 0 && body.trim().length > 0 && !loading;

  async function submit() {
    if (!canSubmit) {
      setError("חובה למלא כותרת ותוכן");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await onAdd({ title: title.trim(), body: body.trim() });
      setTitle("");
      setBody("");
    } catch {
      setError("שגיאה בהוספת post");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
      <input
        placeholder="כותרת חדשה..."
        value={title}
        onChange={(e) => { setTitle(e.target.value); if (error) setError(""); }}
        disabled={loading}
      />
      <input
        placeholder="תוכן..."
        value={body}
        onChange={(e) => { setBody(e.target.value); if (error) setError(""); }}
        disabled={loading}
        style={{ minWidth: 260 }}
      />
      <button type="button" onClick={submit} disabled={!canSubmit}>
        {loading ? "מוסיף..." : "הוסף Post"}
      </button>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
}
