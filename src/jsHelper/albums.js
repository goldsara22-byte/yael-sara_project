function filtered(albums, query) {
  const q = (query.text || "").trim().toLowerCase();
  if (!q) return albums;

  return albums.filter((a) => {
    if (query.by === "id") return String(a.id).toLowerCase().includes(q);
    if (query.by === "title") return String(a.title || "").toLowerCase().includes(q);
    return true;
  });
}

export { filtered };