import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import AddItemBar from "../shared/AddItemBar.jsx";
import SinglePhoto from "../albums/SinglePhoto.jsx";
import { getPhotosByAlbum, postPhotoForAlbum } from "../../API/photosAPI.js";
import { getGeneralAPI } from "../../API/general.js";
import '../../css/AlbumsPage.css';

const LIMIT = 1;

export default function AlbumPhotosPage() {
  const { albumId } = useParams();
  const { user } = useAuth();

  const [album, setAlbum] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [currentStart, setCurrentStart] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  async function loadPhotos(start) {
    try {
      setLoadingMore(true);
      const data = await getPhotosByAlbum(albumId, start, LIMIT);
      setPhotos(prev => (start === 0 ? data : [...prev, ...data])); 
      setCurrentStart(start + data.length);
      if (data.length < LIMIT) {
        setHasMore(false);
      }
    } catch {
      setErr("שגיאה בטעינת תמונות נוספות");
    } finally {
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    if (!albumId) return;
    (async () => {
      try {
        setLoading(true);
        setPhotos([]);
        setCurrentStart(0);
        setHasMore(true);

        const aRes = await getGeneralAPI(`/albums/${albumId}`);
        if (!aRes.ok) throw new Error("album fetch failed");
        const a = await aRes.json();
        setAlbum(a);

        await loadPhotos(0);
      } catch (e) {
        setErr("שגיאה בטעינת album/photos");
      } finally {
        setLoading(false);
      }
    })();
  }, [albumId]);

  async function addPhoto(title, url) {
    try {
      const created = await postPhotoForAlbum(albumId, title, url);
      setPhotos((prev) => [created, ...prev]);
    } catch {
      setErr("שגיאה בהוספת photo");
    }
  }

  if (loading) return <div className="album-photos-page">טוען...</div>;
  if (err) return <div className="album-photos-page">{err}</div>;
  if (!album) return <div className="album-photos-page">לא נמצא אלבום</div>;

  const isOwner = user && String(user.id) === String(album.userId);

  return (
    <div className="album-photos-page">
      <h2>Album: {album.title} (#{album.id})</h2>

      {isOwner && (
        <div style={{ marginBottom: 12 }}>
          <AddItemBar onAdd={addPhoto} onError={() => setErr("שגיאה בהוספת photo")} addBody={true} />
        </div>
      )}

      <div className="photos-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {photos.map((ph) => (
          <SinglePhoto
            key={ph.id}
            photo={ph}
            isOwner={isOwner}
            setPhotos={setPhotos}
            onError={(msg) => setErr(msg)}
          />
        ))}
      </div>

      <div style={{ marginTop: 12 }}>
        {hasMore && (
          <button onClick={() => loadPhotos(currentStart)} disabled={loadingMore}>
            {loadingMore ? "טוען..." : "Load more"}
          </button>
        )}
        {photos.length === 0 && <div>אין תמונות</div>}
      </div>
    </div>
  );
}
