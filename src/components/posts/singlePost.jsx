import EditButton from "../shared/EditButton.jsx";
import DeleteButton from "../shared/DeleteButton.jsx";
import { deletePostById, patchPostTitleById } from "../../API/postAPI.js";

export default function SinglePost({ post,setPosts, onError }) {
    async function handleDeletePost(p) {
    try {
      await deletePostById(p.id);
      setPosts(prev => prev.filter(pd => String(pd.id) !== String(p.id)));
    } catch {
      setErr("שגיאה במחיקת post");
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
        todoId={post.id}
        title={post.title}
        onSave={updatePostTitle}
      />
      <DeleteButton
        onDelete={() => handleDeletePost(post)}
        onError={() => onError("שגיאה במחיקת post")}
      >
        ❌
      </DeleteButton>
    </div>
  );
}
