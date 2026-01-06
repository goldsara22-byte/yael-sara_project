import { getGeneralAPI, deleteGeneralAPI, patchGeneralAPI, postGeneralAPI } from "./general.js";

async function getPostsByUser(user) {
    const res = await getGeneralAPI(`/posts?userId=${encodeURIComponent(user.id)}`);
    if (!res.ok) throw new Error("fetch failed");
    const mine = await res.json();
    return mine;
}

export {getPostsByUser,deletePostById, patchPostComplite, patchPostTitleById}

