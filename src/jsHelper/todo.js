

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

function filtered(posts, query) {

    const q = (query.text || "").trim().toLowerCase();
    if (!q) return posts;

    return posts.filter((p) => {
      if (query.by === "id") return String(p.id).includes(q);
      if (query.by === "title") return String(p.title || "").toLowerCase().includes(q);
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

  export { filtered , sorted};
