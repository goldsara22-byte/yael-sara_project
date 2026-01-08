import { useState } from "react";
import EditButton from "../shared/EditButton.jsx";
import DeleteButton from "../shared/DeleteButton.jsx";
import Comments from "./Comments.jsx";
import { deletePostById, patchPostTitleById, patchPostBodyById } from "../../API/postAPI.js";

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

  return (
    // className="post-item" 
    <div className="single-post-card">
      <div className="post-header">
        {isOwner && <DeleteButton
          onDelete={() => handleDeletePost(post)}
          onError={() => onError("שגיאה במחיקת post")}
        >
          ❌
        </DeleteButton>}
        <div className="post-id">#{post.id}</div>
        {isOwner ? <EditButton
          itemId={post.id}
          data={post.title}
          onSave={updatePostTitle}
        /> : <div className="post-title">{post.title}</div>}
      </div>
      <div className="post-content-section">
        <button className="toggle-body-btn" onClick={() => setShowContents((prev) => !prev)}>
          {showContents ? "הסתר תוכן" : "הצג תוכן"}
        </button>
        {showContents && (isOwner ? <EditButton className="post-body-text"
          itemId={post.id}
          data={post.body}
          onSave={updatePostBody}></EditButton> : <div className="post-body">{post.body}</div>)}
      </div>
      <div className="post-footer">
        <Comments postId={post.id} user={user} onError={onError} />
      </div>
    </div>
  );
}
