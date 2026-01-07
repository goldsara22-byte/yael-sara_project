import { getGeneralAPI, deleteGeneralAPI, patchGeneralAPI, postGeneralAPI } from "./general.js";

async function getCommentsByPostId(postId) {
    const res = await getGeneralAPI(`/comments?postId=${postId}`);
    if (!res.ok) throw new Error("fetch failed");
    const comments = await res.json();
    return comments;
}

async function postCommentForPost(postId, user, body) {
    const res = await postGeneralAPI(`/comments`, {
        postId: postId,
        userId: user.id,
        name: user.name,
        email: user.email,
        body: body
    });
    if (!res.ok) throw new Error("post failed");
    const created = await res.json();
    return created;
}

async function deleteCommentById(id) {
    const res = await deleteGeneralAPI(`/comments/${id}`);
    if (!res.ok) throw new Error("delete failed");
}

async function patchCommentBodyById(id, newBody) {
    const res = await patchGeneralAPI(`/comments/${id}`, { body: newBody });
    if (!res.ok) throw new Error("patch failed");
    const updated = await res.json();
    return updated;
}

export { getCommentsByPostId, postCommentForPost, deleteCommentById, patchCommentBodyById };
