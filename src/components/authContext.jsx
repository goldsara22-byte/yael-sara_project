import { createContext, useContext, useState } from "react";
import { getUserByUsername, postUser } from "../API/userAPI.js";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const LS_KEY = "activeUser";

export function AuthProvider({ children }) {
    
    const [user, setUser] = useState(() => {
        const raw = localStorage.getItem(LS_KEY);
        return raw ? JSON.parse(raw) : null;
    });

    async function login(username, password) {
        const { ok, data: users, msg } = await getUserByUsername(username);
        if (!ok) return { ok: false, msg };
        if (users.length === 0) return { ok: false, msg: "שם משתמש לא קיים" };

        const found = users[0];
        if (found.website !== password) return { ok: false, msg: "סיסמה שגויה" };
        const myUser = { id: found.id, name: found.name, email: found.email };
        setUser(myUser);
        localStorage.setItem(LS_KEY, JSON.stringify(myUser));

        return { ok: true, userId: found.id };
    }

    async function register(userA) {
        try {
            const { ok, data: created, msg } = await postUser(userA);
            if (!ok) return { ok: false, msg };

            const myUser = { id: created.id, name: created.name, email: created.email };
            setUser(myUser);
            localStorage.setItem(LS_KEY, JSON.stringify(myUser));
            return { ok: true, userId: created.id };
        } catch (err) {
            return { ok: false, msg: "שגיאת רשת" };
        }
    }

    function logout() {
        setUser(null);
        localStorage.removeItem(LS_KEY);
    }

    const value = { user, login, logout, register };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
