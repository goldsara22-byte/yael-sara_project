import EditButton from "../shared/EditButton.jsx";
import DeleteButton from "../shared/DeleteButton.jsx";
import { deleteTodoById, patchTodoComplite, patchTodoTitleById } from "../../API/todoAPI.js";

export default function SingleTodo({ todo,setTodos, onError }) {
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

  return (
    <div className="todo-item">
      <div className="todo-id">#{todo.id}</div>
      <EditButton
        itemId={todo.id}
        data={todo.title}
        onSave={updateTodoTitle}
      />
      <DeleteButton
        onDelete={() => handleDeletetodo(todo)}
        onError={() => onError("שגיאה במחיקת todo")}
      >
        ❌
      </DeleteButton>
      <label className="todo-done">
        done
        <input
          type="checkbox"
          checked={!!todo.completed}
          onChange={() => toggleCompleted(todo)}
        />
      </label>
    </div>
  );
}