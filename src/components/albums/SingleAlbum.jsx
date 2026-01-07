import { Link } from "react-router-dom";

export default function SingleAlbum({ album }) {
  return (
    <div className="album-item">
      <div className="album-id">#{album.id}</div>
      <div className="album-title">
        <Link to={`/home/albums/${album.id}`}>{album.title}</Link>
      </div>
    </div>
  );
}
