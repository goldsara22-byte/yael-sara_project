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
      <h2 className="album-title-header">Album: {album.title} (#{album.id})</h2>

      {isOwner && (
        <div className="add-photo-section">
          <AddItemBar onAdd={addPhoto} onError={() => setErr("שגיאה בהוספת photo")} addBody={true} />
        </div>
      )}

      <div className="photos-grid">
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

      <div className="load-more-container">
        {hasMore && (
          <button onClick={() => loadPhotos(currentStart)} disabled={loadingMore} className="load-more-btn">
            {loadingMore ? "טוען..." : "Load more"}
          </button>
        )}
        {photos.length === 0 && <div className="no-photos-msg">אין תמונות</div>}
      </div>
    </div>
  );
}
