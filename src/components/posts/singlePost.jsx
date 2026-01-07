import { useState } from "react";
import EditButton from "../shared/EditButton.jsx";
import DeleteButton from "../shared/DeleteButton.jsx";
import Comments from "./Comments.jsx";
import { deletePostById, patchPostTitleById,patchPostBodyById } from "../../API/postAPI.js";

export default function SinglePost({ post, setPosts, onError, user }) {
  const [showContents, setShowContents] = useState(false);
  const isOwner = user && String(user.id) === String(post.userId);

  async function handleDeletePost(p) {
    try {
      await deletePostById(p.id);
      setPosts(prev => prev.filter(pd => String(pd.id) !== String(p.id)));
    } catch {
      onError("שגיאה במחיקת post");
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
      onError("שגיאה בעדכון תוכן post");
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
      onError("שגיאה בעדכון כותרת post");
      return;
    }
  }
//והצגתו באופן מודגש
  return (
    <div className="post-item">
      <div className="post-id">#{post.id}</div>
      {isOwner ? <EditButton
        itemId={post.id}
        data={post.title}
        onSave={updatePostTitle}
      /> : <div className="post-title">{post.title}</div>}
      <button onClick={() => setShowContents((prev) => !prev)}>
        {showContents ? "הסתר תוכן" : "הצג תוכן"}
      </button>
      {showContents && (isOwner ? <EditButton className="post-body"
        itemId={post.id}
        data={post.body}
        onSave={updatePostBody}></EditButton> : <div className="post-body">{post.body}</div>)}
      {isOwner && <DeleteButton
        onDelete={() => handleDeletePost(post)}
        onError={() => onError("שגיאה במחיקת post")}
      >
        ❌
      </DeleteButton>}
      <Comments postId={post.id} user={user} onError={onError} />
    </div>
  );
}
