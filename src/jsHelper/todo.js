  import { deleteTodoById, patchTodoComplite, patchTodoTitleById, postTodoForUser } from "../API/todoAPI.js";
  async function handleDeletetodo(t) {
    try {
      await deleteTodoById(t.id);
      setTodos(prev => prev.filter(td => String(td.id) !== String(t.id)));
    } catch {
      setErr("שגיאה במחיקת todo");
      return;
    }
  }

  async function toggleCompleted(todo) {
    try {
      const updated = await patchTodoComplite(todo);
      setTodos((prev) =>
        prev.map((t) => (String(t.id) === String(todo.id) ? updated : t))
      );
    } catch {
      setErr("שגיאה בעדכון סטטוס todo");
      return;
    }
  }
  
  async function updateTodoTitle(id, newTitle) {
    try {
      const updated = await patchTodoTitleById(id, newTitle);
      setTodos((prev) =>
        prev.map((t) => (String(t.id) === String(id) ? updated : t))
      );
    } catch {
      setErr("שגיאה בעדכון כותרת todo");
      return;
    }
  }

  async function addTodo(title) {
    try{
    const created = await postTodoForUser(user, title);
    setTodos((prev) => [created, ...prev]);
    } catch {
      setErr("שגיאה בהוספת todo");
      return;
    }
  }

function filtered(todos, query) {
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
}  

function sorted(filteredTodos, sortBy) {
    const list = [...filteredTodos];
    list.sort((a, b) => {
      if (sortBy === "id") return (Number(a.id) || 0) - (Number(b.id) || 0);
      if (sortBy === "title") return (a.title || "").localeCompare(b.title || "");
      if (sortBy === "completed") return Number(!!a.completed) - Number(!!b.completed);
      return 0;
    });
    return list;
}

  export { handleDeletetodo, toggleCompleted, updateTodoTitle, addTodo , filtered , sorted};