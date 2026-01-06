async function getTodosByUser(user) {
    const res = await getGeneralAPI(`/todos?userId=${encodeURIComponent(user.id)}`);
    if (!res.ok) throw new Error("fetch failed");
    const mine = await res.json();
    return mine;
}
