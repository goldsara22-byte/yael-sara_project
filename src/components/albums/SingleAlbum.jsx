import { Link, useParams } from "react-router-dom";

export default function SingleAlbum({ album }) {
  const { userId } = useParams();

  return (
    <div className="album-item">
      <div className="album-id">#{album.id}</div>
      <div className="album-title">
        <Link to={`/home/users/${userId}/albums/${album.id}`}>{album.title}</Link>
      </div>
    </div>
  );
}
