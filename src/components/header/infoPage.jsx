import { useAuth } from "../AuthContext";
import { getInfoByUserId } from "../../API/infoAPI.js";
export default function InfoPage() {
  const { user } = useAuth();
  if (!user) return null;
  async function handleClick() {
      }  return (
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