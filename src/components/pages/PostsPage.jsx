import {  useEffect, useMemo, useState } from "react";
import { useAuth } from "../AuthContext.jsx";
import SearchBar from "../shared/SearchBar.jsx";
import DeleteButton from "../shared/DeleteButton.jsx";
import { getPosts, postPostForUser } from "../../API/postAPI.js";
import { filtered } from "../../jsHelper/post.js";
import AddItemBar from "../shared/AddItemBar.jsx";
import SinglePost from "../posts/singlePost.jsx";

export default function PostsPage() {
  const { user } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [query, setQuery] = useState({ by: "title", text: "" });
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const mine = await getPosts();
        setPosts(mine);
      } catch {
        setErr("שגיאה בטעינת posts");
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  async function addPost(title, body) {
    try {
      const created = await postPostForUser(user, title, body);
      setTodos((prev) => [created, ...prev]);
    } catch (err) {
      setErr("שגיאה בהוספת todo");
      return;
    }
  }

  const filteredPosts = useMemo(() => {
    return filtered(posts, query);
  }, [posts, query]);

  const selectedPost = useMemo(() => {
    return posts.find((p) => String(p.id) === String(selectedPostId)) || null;
  }, [posts, selectedPostId]);

  function selectPost(id) {
    setSelectedPostId(id);
    setShowComments(false); // כדי שהתגובות לא יישארו פתוחות על פוסט אחר בטעות
  }

  if (!user) return <div className="posts-page">אין משתמש מחובר</div>;
  if (loading) return <div className="posts-page">טוען...</div>;
  if (err) return <div className="posts-page">{err}</div>;

  return (
    <div className="posts-page">
      <h2 className="posts-title">Posts</h2>
      <div className="posts-controls">
        <SearchBar
          showStatus={false}
          onChange={setQuery}
        />
        <AddItemBar
          onAdd={addPost}
          onError={() => setErr("שגיאה בהוספת todo")}
          user={user}
        />
      </div>
      <div className="posts-list">
              {filteredPosts.map((p) => (
                <SinglePost
                  key={p.id}
                  post={p}
                  setPosts={setPosts}
                  onError={setErr}
      
                />
              ))}

              {filteredPosts.length === 0 && (
                <div className="posts-empty">אין posts למשתמש</div>
              )}
            </div>
    </div>
  );
}
