import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const LS_KEY = "activeUser";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    // טעינה מה-LocalStorage ברענון (הרחבה ז׳)
    useEffect(() => {
        const raw = localStorage.getItem(LS_KEY);
        if (raw) setUser(JSON.parse(raw));
    }, []);

    async function login(username, password) {
        // לפי ההוראות: username מהשרת, וסיסמה = website
        const res = await fetch(`http://localhost:3000/users?username=${username}`);
        const users = await res.json();

        if (users.length === 0) return { ok: false, msg: "שם משתמש לא קיים" };

        const found = users[0];
        if (found.website !== password) return { ok: false, msg: "סיסמה שגויה" };

        setUser(found);
        localStorage.setItem(LS_KEY, JSON.stringify(found));
        return { ok: true };
    }

    function setLoggedUser(user) {
        setUser(user);
        localStorage.setItem(LS_KEY, JSON.stringify(user));
    }

    function logout() {
        setUser(null);
        localStorage.removeItem(LS_KEY);
    }

    const value = { user, login, logout,  setLoggedUser};
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
