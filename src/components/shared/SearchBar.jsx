import { useEffect, useState } from "react";

export default function SearchBar({
  showStatus = false,    // ב-Todos: true, ב-Posts/Albums: false
  onChange,              // (query) => void
}) {
  const [by, setBy] = useState("title");
  const [text, setText] = useState("");
  const [status, setStatus] = useState("all");

  const options=[
            { value: "id", label: "id" },
            { value: "title", label: "כותרת" },
          ];
  // בכל שינוי - מודיעים להורה
  useEffect(() => {
    onChange?.({
      by,
      text,
      status: showStatus ? status : undefined,
    });
  }, [by, text, status, onChange]);

  return (
    <div className="search-bar-container">
      <label className="search-label">
        Search by:
        <select value={by} onChange={(e) => setBy(e.target.value)}>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>

      <input
        placeholder={"חיפוש..."}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {showStatus && (
        <label className="search-label">
          Status:
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">הכל</option>
            <option value="done">בוצע</option>
            <option value="open">לא בוצע</option>
          </select>
        </label>
      )}
    </div>
  );
}
