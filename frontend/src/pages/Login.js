import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const loginUser = async () => {
    try {
      const res = await API.post("token/", {
        phone,
        password,
      });
      console.log("LOGIN RESPONSE:", res.data);
      localStorage.setItem("token", res.data.access);

      navigate("/feed");
    } catch (error) {
        console.log(error);

        if (error.response) {
            alert(JSON.stringify(error.response.data));
        } else {
            alert("Server not reachable or backend not running");
        }
    }
  };

  return (
    <div>
      <h2>ScrollGuru Login</h2>

      <input
        placeholder="Phone"
        onChange={(e) => setPhone(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={loginUser}>Login</button>
    </div>
  );
}