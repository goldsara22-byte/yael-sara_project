import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../AuthContext.jsx";
import TodoSortSelect from "../todos/TodoSortSelect.jsx";
import "../../css/TodosPage.css";
import SearchBar from "../shared/SearchBar.jsx";
import AddItemBar from "../shared/AddItemBar.jsx";
import { getTodosByUser,postTodoForUser } from "../../API/todoAPI.js";
import {  filtered, sorted } from "../../jsHelper/todo.js";
import SingleTodo from "../todos/singleTodo.jsx";

export default function TodosPage() {
  const { user } = useAuth();

  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [sortBy, setSortBy] = useState("id"); // id | title | completed
  const [query, setQuery] = useState({ by: "title", text: "", status: "all" });//האוביקט שקיבלנו מהshearch bar

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const mine = await getTodosByUser(user);
        setTodos(mine);
      } catch {
        setErr("שגיאה בטעינת todos");
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);


async function addTodo(title) {
  try {
    const created = await postTodoForUser(user, title);
    setTodos((prev) => [created, ...prev]);
  } catch (err) {                    
    setErr("שגיאה בהוספת todo");
    return;
  }
}
  const filteredTodos = useMemo(() => {
    return filtered(todos, query);
  }, [todos, query]);

  const sortedTodos = useMemo(() => {
    return sorted(filteredTodos, sortBy);
  }, [filteredTodos, sortBy]);

  if (!user) return <div className="todos-page">אין משתמש מחובר</div>;
  if (loading) return <div className="todos-page">טוען...</div>;
  if (err) return <div className="todos-page">{err}</div>;

  return (
    <div className="todos-page">
      <h2 className="todos-title">Todos</h2>

      <div className="todos-controls">
        <TodoSortSelect value={sortBy} onChange={setSortBy} />
        <SearchBar
          showStatus={true}
          onChange={setQuery}
        />
        <AddItemBar
          onAdd={addTodo}
          onError={() => setErr("שגיאה בהוספת todo")}
          addBody={false}
        />
      </div>

      <div className="todos-list">
        {sortedTodos.map((t) => (
          <SingleTodo
            key={t.id}
            todo={t}
            setTodos={setTodos}
            onError={setErr}

          />
        ))}

        {sortedTodos.length === 0 && (
          <div className="todos-empty">אין todos למשתמש</div>
        )}
      </div>
    </div>
  );
}

