import EditButton from "../shared/EditButton.jsx";
import DeleteButton from "../shared/DeleteButton.jsx";
import { useAuth } from "../AuthContext.jsx";
import { deleteCommentById, patchCommentBodyById } from "../../API/commentAPI.js";

export default function SingleComment({ comment, onLocalUpdate, onLocalDelete, onError }) {
  const { user } = useAuth();
  const isCommentOwner = user && String(user.email) === String(comment.email);

  async function handleDelete() {
    try {
      await deleteCommentById(comment.id);
      onLocalDelete(comment.id);
    } catch {
      onError("שגיאה במחיקת comment");
    }
  }

  async function handleUpdate(id, newBody) {
    try {
      const updated = await patchCommentBodyById(id, newBody);
      onLocalUpdate(updated);
    } catch {
      onError("שגיאה בעדכון comment");
    }
  }

  return (
    <div className="comment-item">
      <div className="comment-header">
        <strong>{comment.name}</strong>
        <span className="comment-email">({comment.email})</span>
      </div>
      {isCommentOwner ? (
        <EditButton
          itemId={comment.id}
          data={comment.body}
          onSave={handleUpdate}
        />
      ) : (
        <div className="comment-body">{comment.body}</div>
      )}
      {isCommentOwner && (
        <DeleteButton
          onDelete={handleDelete}
          onError={() => onError("שגיאה במחיקת comment")}
        >
          ❌
        </DeleteButton>
      )}
    </div>
  );
}
