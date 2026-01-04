import { useEffect, useState } from "react";

export default function EditButton({
  todoId,
  title,
  disabled = false,
  onSave, // async (id, newTitle) => Promise<void>
  requiredMessage = "חובה למלא כותרת",
  editText = "✏️",
  saveText = "שמור",
  cancelText = "ביטול",
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(title ?? "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // כשכותרת מתעדכנת מההורה — ניישר טיוטה רק אם לא באמצע עריכה
  useEffect(() => {
    if (!isEditing) setDraft(title ?? "");
  }, [title, isEditing]);

  const trimmedDraft = String(draft ?? "").trim();
  const trimmedTitle = String(title ?? "").trim();
  const isDirty = trimmedDraft !== trimmedTitle;

  function startEdit() {
    if (disabled || loading) return;
    setError("");
    setDraft(title ?? "");
    setIsEditing(true);
  }

  function cancelEdit() {
    setError("");
    setDraft(title ?? "");
    setIsEditing(false);
  }

  async function handleSave() {
    if (disabled || loading) return;

    if (!trimmedDraft) {
      setError(requiredMessage);
      return;
    }

    if (!isDirty) {
      setIsEditing(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      await onSave(todoId, trimmedDraft);
      setIsEditing(false);
    } catch {
      setError("שגיאה בשמירה");
    } finally {
      setLoading(false);
    }
  }

  if (!isEditing) {
    return (
      <div className="todo-title-row">
        <div className="todo-title">{title}</div>
        <button type="button" onClick={startEdit} disabled={disabled || loading} title="עריכה">
          {editText}
        </button>
      </div>
    );
  }

  return (
    <div className="todo-title-editor">
      <div className="todo-title-editor-row">
        <input
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            if (error) setError("");
          }}
          disabled={disabled || loading}
          placeholder="כותרת..."
        />

        <button type="button" onClick={handleSave} disabled={disabled || loading}>
          {loading ? "שומר..." : saveText}
        </button>

        <button type="button" onClick={cancelEdit} disabled={disabled || loading}>
          {cancelText}
        </button>
      </div>

      {error && <div className="todo-error">{error}</div>}
    </div>
  );
}
