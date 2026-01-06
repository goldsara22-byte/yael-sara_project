import EditButton from "../shared/EditButton.jsx";
import DeleteButton from "../shared/DeleteButton.jsx";
import { deletePostById, patchPostTitleById,patchPostBodyById } from "../../API/postAPI.js";

export default function SinglePost({ post, setPosts, onError }) {
  const [showContents, setShowContents] = useState(false);

  async function handleDeletePost(p) {
    try {
      await deletePostById(p.id);
      setPosts(prev => prev.filter(pd => String(pd.id) !== String(p.id)));
    } catch {
      setErr("שגיאה במחיקת post");
      return;
    }
  }

  async function updatePostBody(id, newBody) {
    try {
      const updated = await patchPostBodyById(id, newBody);
      setPosts((prev) =>
        prev.map((p) => (String(p.id) === String(id) ? updated : p))
      );
    } catch {
      setErr("שגיאה בעדכון תוכן post");
      return;
    }
  }

  async function updatePostTitle(id, newTitle) {
    try {
      const updated = await patchPostTitleById(id, newTitle);
      setPosts((prev) =>
        prev.map((p) => (String(p.id) === String(id) ? updated : p))
      );
    } catch {
      setErr("שגיאה בעדכון כותרת post");
      return;
    }
  }

  return (
    <div className="post-item">
      <div className="post-id">#{post.id}</div>
      <EditButton
        itemId={post.id}
        data={post.title}
        onSave={updatePostTitle}
      />
      <button onClick={() => setShowContents((prev) => !prev)}>
        {showContents ? "הסתר תוכן" : "הצג תוכן"}
      </button>
      {showContents && <EditButton className="post-body"
        itemId={post.id}
        data={post.body}
        onSave={updatePostBody}></EditButton>}
      <DeleteButton
        onDelete={() => handleDeletePost(post)}
        onError={() => onError("שגיאה במחיקת post")}
      >
        ❌
      </DeleteButton>
    </div>
  );
}
