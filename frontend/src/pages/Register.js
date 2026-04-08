import { useState } from "react";
import API from "../api/axios";

export default function Register() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const registerUser = async () => {
    await API.post("users/create/", { phone, password });

    const res = await API.post("token/", { phone, password });

    localStorage.setItem("token", res.data.access);
    window.location.href = "/feed";
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>
          🔥 <span style={styles.logoText}>ScrollGuru</span>
        </div>
        <h2 style={styles.heading}>Create Account</h2>
        <p style={styles.subheading}>Join the learning community</p>

        <div style={styles.inputGroup}>
          <input
            style={styles.input}
            placeholder="Phone Number"
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div style={styles.inputGroup}>
          <input
            type="password"
            style={styles.input}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button onClick={registerUser} style={styles.button}>
          Register
        </button>

        <p style={styles.footerText}>
          Already have an account?{" "}
          <a href="/login" style={styles.link}>Login here</a>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: "#000",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  card: {
    background: "#111",
    padding: "40px 24px",
    borderRadius: "20px",
    width: "100%",
    maxWidth: "380px",
    textAlign: "center",
    border: "1px solid #333",
  },
  logo: {
    fontSize: "42px",
    marginBottom: "10px",
  },
  logoText: {
    fontSize: "28px",
    fontWeight: "700",
    background: "linear-gradient(90deg, #f56040, #c13584)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "700",
    margin: "10px 0 6px",
  },
  subheading: {
    color: "#aaa",
    marginBottom: "30px",
  },
  inputGroup: {
    marginBottom: "18px",
  },
  input: {
    width: "100%",
    padding: "16px",
    background: "#1a1a1a",
    border: "1px solid #444",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "16px",
    outline: "none",
  },
  button: {
    width: "100%",
    padding: "16px",
    background: "linear-gradient(90deg, #f56040, #c13584)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "17px",
    fontWeight: "700",
    marginTop: "10px",
    cursor: "pointer",
  },
  footerText: {
    marginTop: "25px",
    color: "#888",
    fontSize: "14px",
  },
  link: {
    color: "#0095f6",
    textDecoration: "none",
  },
};