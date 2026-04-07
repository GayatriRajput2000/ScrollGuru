import { useState } from "react";
import API from "../api/axios";

export default function Register() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const registerUser = async () => {
  await API.post("users/create/", {
    phone,
    password,
  });

  const res = await API.post("token/", {
    phone,
    password,
  });

  localStorage.setItem("token", res.data.access);

  window.location.href = "/feed";
};
  return (
    <div>
      <h2>Register</h2>

      <input onChange={(e) => setPhone(e.target.value)} placeholder="Phone" />
      <input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />

      <button onClick={registerUser}>Register</button>
    </div>
  );
}