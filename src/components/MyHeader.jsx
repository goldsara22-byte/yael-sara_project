import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "./authContext.jsx";

export default function MyHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showInfo, setShowInfo] = useState(false);

  const handleLogout = () => {
    logout();            // מוחק LS + user מה-context
    navigate("/login");  // חזרה לעמוד כניסה
  };

  return (
    <>
      {/* HEADER */}
      <header style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <strong>{user.name}</strong>

        <button onClick={() => setShowInfo(true)}>Info</button>

        <NavLink to="/todos">Todos</NavLink>
        <NavLink to="/posts">Posts</NavLink>
        <NavLink to="/albums">Albums</NavLink>

        <button onClick={handleLogout}>Logout</button>
      </header>

      {/* INFO – מסך על גבי העמוד */}
      {showInfo && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setShowInfo(false)}
        >
          <div
            style={{ background: "white", padding: 16 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>User Info</h3>
            <p><b>Name:</b> {user.name}</p>
            <p><b>Username:</b> {user.username}</p>
            <p><b>Email:</b> {user.email}</p>
            <p><b>Website:</b> {user.website}</p>

            <button onClick={() => setShowInfo(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}
