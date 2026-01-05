
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function MyHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/login", { replace: true });//*
  };

  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center", padding: 10 }}>
      <div style={{ fontWeight: "bold" }}>
        {user ? `Welcome, ${user.name}` : "App"}
      </div>

      <nav style={{ marginLeft: 20 }}>
        <NavLink to="/home" style={{ marginRight: 8 }}>Home</NavLink>
        <NavLink to="/home/info" style={{ marginRight: 8 }}>Info</NavLink>
        <NavLink to="/home/todos" style={{ marginRight: 8 }}>Todos</NavLink>
        <NavLink to="/home/posts" style={{ marginRight: 8 }}>Posts</NavLink>
        <NavLink to="/home/albums" style={{ marginRight: 8 }}>Albums</NavLink>
      </nav>

      <div style={{ marginLeft: "auto" }}>
        <button onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
}