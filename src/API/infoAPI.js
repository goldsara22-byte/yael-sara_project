import { getGeneralAPI } from "./general";

async function getInfoByUserId(userId) {
    const res = await getGeneralAPI(`/users/${userId}`);
    const info = await res.json();
    if (!res.ok) throw new Error("Failed to fetch user info");
    return { ok: res.ok, data: info };
}
export { getInfoByUserId };