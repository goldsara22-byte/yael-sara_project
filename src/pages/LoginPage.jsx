import  { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/home";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await login(username.trim(), password);
      if (!result.ok) {
        setError(result.msg || "Login failed");
        setLoading(false);
        return;
      }
      // Success -> navigate to protected area (preserve original route)
      navigate(from, { replace: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>כניסה</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Password (website field)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div style={{ marginTop: 10 }}>
          <button type="submit" disabled={loading}>
            {loading ? "Loggin in..." : "Login"}
          </button>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>

      <p>
        אין לך משתמש? <Link to="/register">הרשמה</Link>
      </p>
    </div>
  );
}