import { getGeneralAPI, deleteGeneralAPI, patchGeneralAPI, postGeneralAPI } from "./general.js";

async function getPostsByUser(user) {
    const res = await getGeneralAPI(`/posts?userId=${encodeURIComponent(user.id)}`);
    if (!res.ok) throw new Error("fetch failed");
    const mine = await res.json();
    return mine;
}

async function deletePostById(id) {
    const res = await deleteGeneralAPI(`/posts/${id}`);
    if (!res.ok) throw new Error("delete failed");
}

async function patchPostTitleById(id, newTitle) {
    const res = await patchGeneralAPI(`/posts/${id}`, { title: newTitle });
    if (!res.ok) throw new Error("patch failed");
    const updated = await res.json();
    return updated;
}

async function patchPostBodyById(id, newBody) {
    const res = await patchGeneralAPI(`/posts/${id}`, { body: newBody });
    if (!res.ok) throw new Error("patch failed");
    const updated = await res.json();
    return updated;
}

async function postPostForUser(user, title, body) {
    const res = await postGeneralAPI(`/posts`, {
        userId: user.id, 
        title: title,
        body: body
    });
    if (!res.ok) throw new Error("post failed");
    const created = await res.json();
    return created;
}
export {getPostsByUser,deletePostById, patchPostTitleById, patchPostBodyById,postPostForUser}