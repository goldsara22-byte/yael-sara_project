import { createContext, useContext, useEffect, useState } from "react";
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
        const myUser = { id: found.id, name: found.name, username: found.username, email: found.email };
        setUser(myUser);
        localStorage.setItem(LS_KEY, JSON.stringify(myUser));

        return { ok: true };
    }

    async function register(userA) {
        try {
            const { ok, data: created, msg } = await postUser(userA);
            if (!ok) return { ok: false, msg };

            const myUser = { id: created.id, name: created.name, username: created.username, email: created.email };
            setUser(myUser);
            localStorage.setItem(LS_KEY, JSON.stringify(myUser));
            return { ok: true };
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
