import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../components/authContext";


export default function RegisterDetailsPage() {
    const { state } = useLocation(); // מגיע מ-navigate של שלב 1
    const navigate = useNavigate();
    const { login } = useAuth();

    // אם נכנסו ישירות בלי state:
    if (!state?.username || !state?.password) {
        navigate("/register", { replace: true });
    }

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const onChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!form.fullName || !form.email) {
            setError("חובה למלא לפחות שם מלא ואימייל");
            return;
        }

        const newUser = {
            username: state.username,
            website: state.password,
            name: form.fullName,
            email: form.email,
            phone: form.phone,
        };

        try {
            setLoading(true);

            const res = await fetch("http://localhost:3001/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUser),
            });

            if (!res.ok) throw new Error("POST failed");
            const created = await res.json();

            setLoggedUser(created);
            navigate("/home");
        } catch (err) {
            setError("שגיאה בשמירת המשתמש");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Complete Profile</h2>

            <form onSubmit={handleSubmit}>
                <input name="fullName" value={form.fullName} onChange={onChange} placeholder="Full Name" />
                <input name="email" value={form.email} onChange={onChange} placeholder="Email" />
                <input name="phone" value={form.phone} onChange={onChange} placeholder="Phone" />

                <button disabled={loading} type="submit">{loading ? "שומר..." : "סיום הרשמה"}</button>
                {error && <p>{error}</p>}
            </form>
        </div>
    );
}
