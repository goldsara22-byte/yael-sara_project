import { useState, useEffect } from "react";
import SingleComment from "./SingleComment.jsx";
import { useAuth } from "../AuthContext.jsx";
import { getCommentsByPostId, postCommentForPost } from "../../API/commentAPI.js";

export default function Comments({ postId, onError }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newCommentBody, setNewCommentBody] = useState("");
  const [showComments, setShowComments] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!showComments) return;
    
    (async () => {
      try {
        setLoading(true);
        const fetchedComments = await getCommentsByPostId(postId);
        setComments(fetchedComments);
      } catch {
        onError("שגיאה בטעינת comments");
      } finally {
        setLoading(false);
      }
    })();
  }, [showComments]);

  async function handleAddComment() {
    if (!newCommentBody.trim()) return;
    try {
      const created = await postCommentForPost(postId, user, newCommentBody.trim());
      setComments((prev) => [created, ...prev]);
      setNewCommentBody("");
    } catch {
      onError("שגיאה בהוספת comment");
    }
  }

  function removeLocalComment(commentId) {
    setComments((prev) => prev.filter((c) => String(c.id) !== String(commentId)));
  }

  function replaceLocalComment(updated) {
    setComments((prev) => prev.map((c) => (String(c.id) === String(updated.id) ? updated : c)));
  }

  return (
    <div className="comments-section">
      <button onClick={() => setShowComments((prev) => !prev)} className="toggle-comments-btn">
        {showComments ? "הסתר comments" : "הצג comments"}
      </button>

      {showComments && (
        <div className="comments-container">
          {loading ? (
            <div>טוען comments...</div>
          ) : (
            <>
              <div className="comments-list">
                {comments.map((comment) => (
                  <SingleComment
                    key={comment.id}
                    comment={comment}
                    onLocalDelete={removeLocalComment}
                    onLocalUpdate={replaceLocalComment}
                    onError={onError}
                  />
                ))}
                {comments.length === 0 && (
                  <div className="no-comments">אין comments</div>
                )}
              </div>
              <div className="add-comment-section">
                <textarea value={newCommentBody} onChange={(e) => setNewCommentBody(e.target.value)} placeholder="הוסיפי comment..." rows="3"/>
                <button  onClick={handleAddComment} disabled={!newCommentBody.trim()} className="add-comment-btn">
                  הוסף comment
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
