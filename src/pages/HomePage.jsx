import {  Outlet, Navigate } from "react-router-dom";
import { useAuth } from '../components/AuthContext.jsx';
import MyHeader from '../components/MyHeader.jsx';

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
