import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../components/AuthContext";
import TodoSortSelect from "../components/TodoSortSelect.jsx";
import "../css/TodosPage.css";
import SearchBar from "../components/SearchBar.jsx";
import DeleteButton from "../components/DeleteButton.jsx";
import AddItemBar from "../components/AddItemBar.jsx";
import EditButton from "../components/EditButton.jsx";

const API = "http://localhost:3000";

export default function TodosPage() {
  const { user } = useAuth();

  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [savingId, setSavingId] = useState(null);

  const [sortBy, setSortBy] = useState("id"); // id | title | completed
  const [query, setQuery] = useState({ by: "title", text: "", status: "all" });//האוביקט שקיבלנו מהshearch bar

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

  async function deleteTodo(id) {
    const res = await fetch(`${API}/todos/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("delete failed");
    setTodos(prev => prev.filter(t => String(t.id) !== String(id)));
  }

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

  const filteredTodos = useMemo(() => {
    const q = (query.text || "").trim().toLowerCase();
    const st = query.status ?? "all";

    return todos.filter((t) => {      // 1) status filter
      if (st === "done" && !t.completed) return false;
      if (st === "open" && t.completed) return false;
      // 2) text search
      if (!q) return true;

      if (query.by === "id") return String(t.id).includes(q);
      if (query.by === "title") return (t.title || "").toLowerCase().includes(q);

      return true;
    });
  }, [todos, query]);

  const sortedTodos = useMemo(() => {
    const list = [...filteredTodos];

    list.sort((a, b) => {
      if (sortBy === "id") return (Number(a.id) || 0) - (Number(b.id) || 0);
      if (sortBy === "title") return (a.title || "").localeCompare(b.title || "");
      if (sortBy === "completed") return Number(!!a.completed) - Number(!!b.completed);
      return 0;
    });

    return list;
  }, [filteredTodos, sortBy]);
  //עדכון כותרת טודו

  async function updateTodoTitle(id, newTitle) {
    try {
      setSavingId(id);

      const res = await fetch(`${API}/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle }),
      });

      if (!res.ok) throw new Error("patch failed");

      const updated = await res.json();
      setTodos((prev) =>
        prev.map((t) => (String(t.id) === String(id) ? updated : t))
      );
    } finally {
      setSavingId(null);
    }
  }

  //
  async function addTodo(title) {
    const res = await fetch(`${API}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        title,
        completed: false,
      }),
    });
    if (!res.ok) throw new Error("post failed");
    const created = await res.json();
    setTodos((prev) => [created, ...prev]);
  }

  //
  if (!user) return <div className="todos-page">אין משתמש מחובר</div>;
  if (loading) return <div className="todos-page">טוען...</div>;
  if (err) return <div className="todos-page">{err}</div>;

  return (
    <div className="todos-page">
      <h2 className="todos-title">Todos</h2>

      <div className="todos-controls">
        <TodoSortSelect value={sortBy} onChange={setSortBy} />
        <SearchBar
          options={[
            { value: "id", label: "id" },
            { value: "title", label: "כותרת" },
          ]}
          placeholder="חיפוש..."
          defaultBy="title"
          showStatus={true}
          defaultStatus="all"
          onChange={setQuery}
        />
        <AddItemBar
          placeholder="הוסיפי todo חדש..."
          buttonText="הוסף"
          disabled={false}
          onAdd={addTodo}
        />
      </div>

      <div className="todos-list">
        {sortedTodos.map((t) => (
          <div key={t.id} className="todo-item">
            <div className="todo-id">#{t.id}</div>
            <EditButton
              todoId={t.id}
              title={t.title}
              disabled={String(savingId) === String(t.id)}
              onSave={updateTodoTitle}
            />
            <DeleteButton
              onDelete={() => deleteTodo(t.id)}
              disabled={String(savingId) === String(t.id)}
              confirmText={`למחוק את todo #${t.id}?`}
            >
              ❌
            </DeleteButton>
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
