import { getGeneralAPI, postGeneralAPI, deleteGeneralAPI, patchGeneralAPI } from "./general.js";

async function getAlbumsByUser(user) {
    const res = await getGeneralAPI(`/albums?userId=${user.id}`);
    if (!res.ok) throw new Error("fetch failed");
    const albums = await res.json();
    return albums;
}

async function postAlbumForUser(user, title) {
    const res = await postGeneralAPI(`/albums`, { userId: user.id, title });
    if (!res.ok) throw new Error("post failed");
    return await res.json();
}

async function deleteAlbumById(id) {
    const res = await deleteGeneralAPI(`/albums/${id}`);
    if (!res.ok) throw new Error("delete failed");
}

async function patchAlbumTitleById(id, title) {
    const res = await patchGeneralAPI(`/albums/${id}`, { title });
    if (!res.ok) throw new Error("patch failed");
    return await res.json();
}

export { getAlbumsByUser, postAlbumForUser, deleteAlbumById, patchAlbumTitleById };
