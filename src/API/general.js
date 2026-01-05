const LOCALHOST = "http://localhost:3000";

async function getGeneralAPI(path) {
  return await fetch(`${LOCALHOST}${path}`);
}

async function postGeneralAPI(path, createData) {
  console.log("Posting to:", `${LOCALHOST}${path}`, "with data:", createData);
  return await fetch(`${LOCALHOST}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(createData),
  });
  
}

async function deleteGeneralAPI(path) {
  return await fetch(`${LOCALHOST}${path}`, {
    method: "DELETE",
  });
}

async function patchGeneralAPI(path, updateData) {
  return await fetch(`${LOCALHOST}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateData),
  });
}




export { getGeneralAPI, postGeneralAPI, deleteGeneralAPI, patchGeneralAPI };