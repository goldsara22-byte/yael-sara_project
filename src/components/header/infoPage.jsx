import { useAuth, useState } from "../AuthContext";
import { getInfoByUserId } from "../../API/infoAPI.js";
export default function InfoPage() {
  const [err, setErr] = useState("");
  const { user } = useAuth();
  if (!user) return null;
  async function handleClick() {
    try{
    const infoUser= await getInfoByUserId(user.id);
      } catch (e) {
      setErr(e);
    })
    {}
    return (
  <button onClick={handleClick}>Info</button>
  );
}

  // <div>
  //     <h3>Personal Info</h3>
  //     <p><strong>Name:</strong> {user.name}</p>
  //     <p><strong>Username:</strong> {user.username}</p>
  //     <p><strong>Email:</strong> {user.email}</p>
  //     <p><strong>Phone:</strong> {user.phone}</p>
  //   </div>
