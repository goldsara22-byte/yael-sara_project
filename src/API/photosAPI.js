import { getGeneralAPI, postGeneralAPI, deleteGeneralAPI, patchGeneralAPI } from "./general.js";

async function getPhotosByAlbum(albumId, start = 0, limit = 1) {
  const res = await getGeneralAPI(
    `/photos?albumId=${albumId}&_start=${start}&_limit=${limit}`
  );
  if (!res.ok) throw new Error("fetch failed");
  return await res.json();
}

async function postPhotoForAlbum(albumId, title, url) {
  const res = await postGeneralAPI(`/photos`, { albumId, title, url });
  if (!res.ok) throw new Error("post failed");
  return await res.json();
}

async function deletePhotoById(id) {
  const res = await deleteGeneralAPI(`/photos/${id}`);
  if (!res.ok) throw new Error("delete failed");
}

async function patchPhotoTitleById(id, newTitle) {
  const res = await patchGeneralAPI(`/photos/${id}`, { title: newTitle });
  if (!res.ok) throw new Error("patch failed");
  return await res.json();
}

async function patchPhotoUrlById(id, newUrl) {
  const res = await patchGeneralAPI(`/photos/${id}`, { url: newUrl });
  if (!res.ok) throw new Error("patch failed");
  return await res.json();
}

export { getPhotosByAlbum, postPhotoForAlbum, deletePhotoById, patchPhotoTitleById, patchPhotoUrlById };
