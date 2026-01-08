
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import InfoPage from "./info.jsx";
import '../../css/MyHeader.css';

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

      <nav className="main-nav">
        
        <NavLink to="/home" style={{ marginRight: 8 }}>Home</NavLink>
        <NavLink to="/home/todos" style={{ marginRight: 8 }}>Todos</NavLink>
        <NavLink to="/home/posts" style={{ marginRight: 8 }}>Posts</NavLink>
        <NavLink to="/home/albums" style={{ marginRight: 8 }}>Albums</NavLink>
      </nav>

      <div className="header-right-side">
        <InfoPage />
        <button onClick={onLogout} className="logout-btn">Logout</button>
      </div>
    </div>
  );
}