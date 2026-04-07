import { useState } from "react";
import API from "../api/axios";

export default function ProfileSetup() {
  const [avatar, setAvatar] = useState(null);

  const saveProfile = async () => {
    const form = new FormData();
    form.append("avatar", avatar);

    await API.patch("users/me/", form);

    window.location.href = "/feed";
  };

  return (
    <div>
      <h2>Create Profile</h2>

      <input type="file" onChange={(e)=>setAvatar(e.target.files[0])}/>
      <button onClick={saveProfile}>Continue</button>
    </div>
  );
}