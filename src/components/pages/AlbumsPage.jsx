import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../AuthContext.jsx";
import SearchBar from "../shared/SearchBar.jsx";
import AddItemBar from "../shared/AddItemBar.jsx";
import { getAlbumsByUser, postAlbumForUser } from "../../API/albumsAPI.js";
import { filtered as filterAlbums } from "../../jsHelper/albums.js";
import SingleAlbum from "../albums/SingleAlbum.jsx";

export default function AlbumsPage() {
  const { user } = useAuth();
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [query, setQuery] = useState({ by: "id", text: "" });

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const all = await getAlbumsByUser(user);
        setAlbums(all);
      } catch (e) {
        setErr("שגיאה בטעינת albums");
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const filtered = useMemo(() => {
    return filterAlbums(albums, query);
  }, [albums, query]);

  if (!user) return <div className="albums-page">אין משתמש מחובר</div>;
  if (loading) return <div className="albums-page">טוען...</div>;
  if (err) return <div className="albums-page">{err}</div>;

  return (
    <div className="albums-page">
      <h2 className="albums-title">Albums</h2>

      <div className="albums-controls">
        <SearchBar showStatus={false} onChange={setQuery} />
      </div>

      <div className="albums-list">
        <div style={{ marginBottom: 12 }}>
          <AddItemBar
            onAdd={async (title) => {
              try {
                const created = await postAlbumForUser(user, title);
                setAlbums((prev) => [created, ...prev]);
              } catch {
                setErr("שגיאה בהוספת album");
              }
            }}
            onError={() => setErr("שגיאה בהוספת album")}
            addBody={false}
          />
        </div>

        {filtered.map((a) => (
          <SingleAlbum key={a.id} album={a} />
        ))}

        {filtered.length === 0 && <div className="albums-empty">אין albums למשתמש</div>}
      </div>
    </div>
  );
}
