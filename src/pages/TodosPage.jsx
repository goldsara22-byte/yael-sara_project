import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../components/AuthContext";
import TodoSortSelect from "../components/TodoSortSelect.jsx";
import "../css/TodosPage.css";

const API = "http://localhost:3000";

export default function TodosPage() {
  const { user } = useAuth();

  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [savingId, setSavingId] = useState(null);

  const [sortBy, setSortBy] = useState("id"); // id | title | completed

  useEffect(() => {
    if (!user) return;

    (async () => {
      try {
        setLoading(true);
        setErr("");

        const res = await fetch(`${API}/todos`);
        if (!res.ok) throw new Error("fetch failed");
        const all = await res.json();

        const mine = all.filter((t) => String(t.userId) === String(user.id));
        setTodos(mine);
      } catch {
        setErr("שגיאה בטעינת todos");
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  async function toggleCompleted(todo) {
    try {
      setSavingId(todo.id);

      const res = await fetch(`${API}/todos/${todo.id}`, {
        method: "PATCH", // אפשר גם PUT אם את מעדיפה
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !todo.completed }),
      });

      if (!res.ok) throw new Error("patch failed");

      const updated = await res.json();
      setTodos((prev) =>
        prev.map((t) => (String(t.id) === String(todo.id) ? updated : t))
      );
    } catch {
      alert("שגיאה בעדכון מצב ביצוע");
    } finally {
      setSavingId(null);
    }
  }

  const sortedTodos = useMemo(() => {
    const list = [...todos];

    list.sort((a, b) => {
      if (sortBy === "id") return (Number(a.id) || 0) - (Number(b.id) || 0);
      if (sortBy === "title") return (a.title || "").localeCompare(b.title || "");
      if (sortBy === "completed") return Number(!!a.completed) - Number(!!b.completed);
      return 0;
    });

    return list;
  }, [todos, sortBy]);

  if (!user) return <div className="todos-page">אין משתמש מחובר</div>;
  if (loading) return <div className="todos-page">טוען...</div>;
  if (err) return <div className="todos-page">{err}</div>;

  return (
    <div className="todos-page">
      <h2 className="todos-title">Todos</h2>

      <div className="todos-controls">
        <TodoSortSelect value={sortBy} onChange={setSortBy} />
      </div>

      <div className="todos-list">
        {sortedTodos.map((t) => (
          <div key={t.id} className="todo-item">
            <div className="todo-id">#{t.id}</div>
            <div className="todo-title">{t.title}</div>

            <label className="todo-done">
              done
              <input
                type="checkbox"
                checked={!!t.completed}
                onChange={() => toggleCompleted(t)}
                disabled={String(savingId) === String(t.id)}
              />
            </label>
          </div>
        ))}

        {sortedTodos.length === 0 && (
          <div className="todos-empty">אין todos למשתמש</div>
        )}
      </div>
    </div>
  );
}
