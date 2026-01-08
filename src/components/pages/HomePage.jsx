import {  Outlet, Navigate } from "react-router-dom";
import { useAuth } from '../AuthContext.jsx';
import MyHeader from '../header/MyHeader.jsx';
import '../../css/HomePage.css';

export default function HomeLayout() {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" replace />;// אם יש משתמש מחובר שישר יגיע לפה

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
