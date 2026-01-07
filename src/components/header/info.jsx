import { useState } from "react";
import { useAuth } from "../AuthContext.jsx";
import { getInfoByUserId } from "../../API/infoAPI.js";

export default function InfoPage() {// לשנות את הסטייל כך ששאר העמוד יהיה חסום
  const [err, setErr] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const { user } = useAuth();

  if (!user) return null;

  async function handleClick() {
    try {
      const result = await getInfoByUserId(user.id);
      setUserData(result.data);
      setIsOpen(true);
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <div>
      {isOpen && userData && (
        <div>
          <button onClick={() => { setIsOpen(false); setUserData(null); }} style={{ float: "right" }}>✕</button>
          {/* General Information */}
          <div className="info-section">
            <h4>General Information</h4>
            <p><strong>Name:</strong> {userData.name}</p>
            <p><strong>Username:</strong> {userData.username}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Phone:</strong> {userData.phone}</p>
          </div>

          {/* Address Information */}
          <div className="info-section">
            <h4>Address Information</h4>
            <p><strong>Street:</strong> {userData.address?.street}</p>
            <p><strong>Suite:</strong> {userData.address?.suite}</p>
            <p><strong>City:</strong> {userData.address?.city}</p>
            <p><strong>Zipcode:</strong> {userData.address?.zipcode}</p>
            <p><strong>Geo:</strong> Lat {userData.address?.geo?.lat}, Lng {userData.address?.geo?.lng}</p>
          </div>

          {/* Company Information */}
          <div className="info-section">
            <h4>Company Information</h4>
            <p><strong>Name:</strong> {userData.company?.name}</p>
            <p><strong>Catchphrase:</strong> {userData.company?.catchPhrase}</p>
            <p><strong>BS:</strong> {userData.company?.bs}</p>
          </div>

          {err && <p className="error">{err}</p>}
        </div>
      )}
      <button onClick={handleClick}>Info</button>
    </div>
  );
}

