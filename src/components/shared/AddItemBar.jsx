import { useState } from "react";

export default function AddItemBar({
  onAdd,
  minLen = 1,
  onError,               // optional (err) => void
}) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const canSubmit = text.trim().length >= minLen && !loading;

  async function submit() {
    if (!canSubmit) return;
    try {
      setLoading(true);
      await onAdd(text.trim());
      setText("");
    } catch (err) {
      onError();
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
      style={{ display: "flex", gap: 8, alignItems: "center"}}
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={"הוסיפי todo חדש..."}
        disabled={loading}
      />

      <button type="button" onClick={submit} disabled={!canSubmit}>
        {loading ? "מוסיף..." : "הוסף"}
      </button>
    </div>
  );
}
