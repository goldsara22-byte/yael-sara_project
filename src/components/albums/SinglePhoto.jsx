import EditButton from "../shared/EditButton.jsx";
import DeleteButton from "../shared/DeleteButton.jsx";
import { deletePhotoById, patchPhotoTitleById, patchPhotoUrlById } from "../../API/photosAPI.js";

export default function SinglePhoto({ photo, isOwner, setPhotos, onError }) {
  async function handleDelete() {
    try {
      await deletePhotoById(photo.id);
      setPhotos((prev) => prev.filter((p) => String(p.id) !== String(photo.id)));
    } catch {
      onError("שגיאה במחיקת photo");
    }
  }

  async function handleUpdateTitle(id, newTitle) {
    try {
      const updated = await patchPhotoTitleById(id, newTitle);
      setPhotos((prev) => prev.map((p) => (String(p.id) === String(updated.id) ? updated : p)));
    } catch {
      onError("שגיאה בעדכון title");
    }
  }

  async function handleUpdateUrl(id, newUrl) {
    try {
      const updated = await patchPhotoUrlById(id, newUrl);
      setPhotos((prev) => prev.map((p) => (String(p.id) === String(updated.id) ? updated : p)));
    } catch {
      onError("שגיאה בעדכון url");
    }
  }

  return (
    <div className="photo-item" style={{ border: "1px solid #ccc", padding: 8 }}>
      <div style={{ marginBottom: 8 }}><strong>{photo.title}</strong></div>
      <div style={{ marginBottom: 8 }}>
        <img src={photo.url} alt={photo.title} style={{ maxWidth: "100%", height: "auto" }} />
      </div>
      {isOwner && (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <EditButton itemId={photo.id} data={photo.title} onSave={handleUpdateTitle} />
          <EditButton itemId={photo.id} data={photo.url} onSave={handleUpdateUrl} />
          <DeleteButton onDelete={handleDelete} onError={() => onError("שגיאה במחיקת photo")} />
        </div>
      )}
    </div>
  );
}
