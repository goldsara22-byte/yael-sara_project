import { NavLink, Outlet, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../components/authContext";
import MyHeader from "../components/MyHeader.jsx";

export default function HomeLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) return <Navigate to="/login" replace />;

    return (
        <div>
            <header>
            <MyHeader></MyHeader>
            </header>
            <main>
                <Outlet />
            </main>
        </div>
    );
}
