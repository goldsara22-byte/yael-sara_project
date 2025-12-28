import { useState } from "react";
import { useAuth } from "../components/authContext";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const result = await login(username, password);

    if (!result.ok) {
      alert(result.msg);
      return;
    }

    console.log("התחברות הצליחה");
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
      </form>
      <p>
        אין לך משתמש?{" "}
        <Link to="/register">הרשמה</Link>
      </p>
    </>
  );
}
