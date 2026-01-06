import { useState } from "react";
// import { useAuth } from "../../components/AuthContext.jsx";
// const { user } = useAuth();
export default function AddItemBar({
  onAdd,
  onError,
  addBody,              // optional (err) => void
}) {
  const [textTitle, setTextTitle] = useState("");
  const [textBody, setTextBody] = useState("");
  const [loading, setLoading] = useState(false);
  const minLen = 1;
  const canSubmit = textTitle.trim().length >= minLen && !loading;

  async function submit() {
    if (!canSubmit) return;
    try {
      setLoading(true);
      if (addBody) {
        await onAdd(textTitle.trim(), textBody.trim());
        setTextTitle("");
        setTextBody("");
      } else {
        await onAdd(textTitle.trim());
        setTextTitle("");
      }
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
      style={{ display: "flex", gap: 8, alignItems: "center" }}
    >
      <input
        value={textTitle}
        onChange={(e) => setTextTitle(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={"הוסיפי חדש..."}
        disabled={loading}
      />
      {addBody && <input
        value={textBody}
        onChange={(e) => setTextBody(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={"הוסיפי חדש..."}
        disabled={loading}
      />}

      <button type="button" onClick={submit} disabled={!canSubmit}>
        {loading ? "מוסיף..." : "הוסף"}
      </button>
    </div>
  );
}
