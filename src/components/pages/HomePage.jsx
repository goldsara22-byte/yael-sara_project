import {  Outlet, Navigate } from "react-router-dom";
import { useAuth } from '../AuthContext.jsx';
import MyHeader from '../header/MyHeader.jsx';

export default function HomeLayout() {
    const { user } = useAuth();
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
