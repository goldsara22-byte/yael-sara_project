import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext.jsx";
import '../../css/AuthPages.css';


export default function RegisterDetailsPage() {
    const { state } = useLocation(); // מגיע מ-navigate של שלב 1
    const navigate = useNavigate();
    const { register } = useAuth();

    useEffect(() => {
        if (!state?.username || !state?.password) {
            navigate("/register", { replace: true });
        }
    }, [state, navigate]);

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        street: "",
        suite: "",
        city: "",
        zipcode: "",
        lat: "",
        lng: "",
        companyName: "",
        catchPhrase: "",
        bs: "",
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
            name: form.fullName,
            email: form.email,
            phone: form.phone,
            website: state.password,
            address: {
                street: form.street,
                suite: form.suite,
                city: form.city,
                zipcode: form.zipcode,
                geo: {
                    lat: form.lat,
                    lng: form.lng,
                },
            },
            company: {
                name: form.companyName,
                catchPhrase: form.catchPhrase,
                bs: form.bs,
            },
        };

        try {
            const result = await register(newUser);
            setLoading(true);
            if (result.ok) {
                navigate(`/home/users/${result.userId}`);
            } else {
                setError(result.msg);
            }
        } catch (err) {
            setError("שגיאה בשמירת המשתמש");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="auth-container">
        <div className="auth-card wide"></div>
            <h2>Complete Profile</h2>

            <form onSubmit={handleSubmit}>
                {/* General Information */}
                <h3>General Information</h3>
                <input name="fullName" value={form.fullName} onChange={onChange} placeholder="Full Name" required />
                <input name="email" value={form.email} onChange={onChange} placeholder="Email" required />
                <input name="phone" value={form.phone} onChange={onChange} placeholder="Phone" />

                {/* Address Information */}
                <h3>Address Information</h3>
                <input name="street" value={form.street} onChange={onChange} placeholder="Street" />
                <input name="suite" value={form.suite} onChange={onChange} placeholder="Suite" />
                <input name="city" value={form.city} onChange={onChange} placeholder="City" />
                <input name="zipcode" value={form.zipcode} onChange={onChange} placeholder="Zipcode" />
                <input name="lat" value={form.lat} onChange={onChange} placeholder="Latitude" />
                <input name="lng" value={form.lng} onChange={onChange} placeholder="Longitude" />

                {/* Company Information */}
                <h3>Company Information</h3>
                <input name="companyName" value={form.companyName} onChange={onChange} placeholder="Company Name" />
                <input name="catchPhrase" value={form.catchPhrase} onChange={onChange} placeholder="Catchphrase" />
                <input name="bs" value={form.bs} onChange={onChange} placeholder="BS" />

                <button disabled={loading} type="submit">{loading ? "שומר..." : "סיום הרשמה"}</button>
                {error && <p>{error}</p>}
            </form>
        </div>
        </div>
    );
}
