import EditButton from "../shared/EditButton.jsx";
import DeleteButton from "../shared/DeleteButton.jsx";
import { toggleCompleted, handleDeletetodo, updateTodoTitle } from "../../jsHelper/todo.js";

export default function SingleTodo({ todo, onError }) {
  return (
    <div className="todo-item">
      <div className="todo-id">#{todo.id}</div>
      <EditButton
        todoId={todo.id}
        title={todo.title}
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