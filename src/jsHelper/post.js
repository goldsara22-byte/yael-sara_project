function filtered(posts, query) {

    const q = (query.text || "").trim().toLowerCase();
    if (!q) return posts;

    return posts.filter((p) => {
      if (query.by === "id") return String(p.id).includes(q);
      if (query.by === "title") return String(p.title || "").toLowerCase().includes(q);
      return true;
    });
}
export { filtered};
