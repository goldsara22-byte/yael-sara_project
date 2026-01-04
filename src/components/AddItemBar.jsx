import { useState } from "react";

export default function AddItemBar({
  placeholder = "הוספה...",
  buttonText = "הוסף",
  onAdd,                 // async (text) => void
  disabled = false,
  minLen = 1,
  className = "",
  style = undefined,
  onError,               // optional (err) => void
}) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const canSubmit = text.trim().length >= minLen && !disabled && !loading;

  async function submit() {
    if (!canSubmit) return;

    try {
      setLoading(true);
      await onAdd(text.trim());
      setText(""); // ניקוי אחרי הצלחה
    } catch (err) {
      if (onError) onError(err);
      else alert("שגיאה בהוספה");
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  }

  return (
    <div
      className={className}
      style={{ display: "flex", gap: 8, alignItems: "center", ...style }}
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        disabled={disabled || loading}
      />

      <button type="button" onClick={submit} disabled={!canSubmit}>
        {loading ? "מוסיף..." : buttonText}
      </button>
    </div>
  );
}
