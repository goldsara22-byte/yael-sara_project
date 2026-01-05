import { getGeneralAPI, postGeneralAPI } from "./general.js";

async function getUserByUsername(username) {
    const res = await getGeneralAPI(`/users?username=${encodeURIComponent(username)}`);
    const users = await res.json();
    if (!res.ok) return { ok: false, msg: "שגיאת שרת" };
    return { ok: res.ok, data: users };
}

async function postUser(newUser) {
    const res = await postGeneralAPI("/users", newUser);

    if (!res.ok) return { ok: false, msg: "שגיאת שרת" };

    const created = await res.json();
    return { ok: true, data: created };
}
export { getUserByUsername, postUser };