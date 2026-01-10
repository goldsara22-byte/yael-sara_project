import { getGeneralAPI, deleteGeneralAPI, patchGeneralAPI, postGeneralAPI } from "./general.js";

async function getTodosByUser(user) {
    const res = await getGeneralAPI(`/todos?userId=${encodeURIComponent(user.id)}`);
    if (!res.ok) throw new Error("fetch failed");
    const mine = await res.json();
    return mine;
}

async function deleteTodoById(id) {
    const res = await deleteGeneralAPI(`/todos/${id}`);
    if (!res.ok) throw new Error("delete failed");
}

async function patchTodoComplite(todo) {
    const res = await patchGeneralAPI(`/todos/${todo.id}`, { completed: !todo.completed });
    if (!res.ok) throw new Error("patch failed");
    const updated = await res.json();
    return updated;
}


async function patchTodoTitleById(id, newTitle) {
    const res = await patchGeneralAPI(`/todos/${id}`, { title: newTitle });
    if (!res.ok) throw new Error("patch failed");
    const updated = await res.json();
    return updated;
}

async function postTodoForUser(user, title) {

    console.log("Posting new todo for user:", user, "with title:", title);
    const res = await postGeneralAPI(`/todos`, {
        userId: user.id,
        title: title,
        completed: false,
    });
    console.log("Post response status:", res.status);
    if (!res.ok) throw new Error("post failed");
    const created = await res.json();
    return created;
}
export { getTodosByUser, deleteTodoById, patchTodoComplite, patchTodoTitleById, postTodoForUser };
