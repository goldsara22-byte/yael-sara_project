import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function RegisterPage() {
    const [form, setForm] = useState({ username: "", password: "", verify: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!form.username || !form.password || !form.verify) {
            setError("חובה למלא את כל השדות");
            return;
        }
        if (form.password !== form.verify) {
            setError("הסיסמאות לא תואמות");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch(
                `http://localhost:3000/users?username=${encodeURIComponent(form.username)}`,
                { method: "GET" }
            );
            if (!res.ok) return { ok: false, msg: "שגיאת שרת" };

            const users = await res.json();

            if (users.length > 0) {
                setError("שם משתמש כבר קיים");
                return;
            }

            // מעבר לשלב 2 עם הנתונים
            navigate("/register/details", { state: { username: form.username, password: form.password } });
        } catch (err) {
            setError("שגיאה בבדיקת שם המשתמש");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Register</h2>

            <form onSubmit={handleSubmit}>
                <input name="username" value={form.username} onChange={onChange} placeholder="Username" />
                <input name="password" type="password" value={form.password} onChange={onChange} placeholder="Password" />
                <input name="verify" type="password" value={form.verify} onChange={onChange} placeholder="Verify Password" />

                <button disabled={loading} type="submit">{loading ? "בודק..." : "המשך"}</button>
                {error && <p>{error}</p>}
            </form>
            <p>
                כבר רשומה?{" "}
                <Link to="/login">כניסה</Link>
            </p>

        </div>
    );
}
