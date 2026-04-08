import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const loginUser = async () => {
    if (!phone || !password) {
      alert("Please enter phone and password");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("token/", {
        phone,
        password,
      });

      console.log("LOGIN RESPONSE:", res.data);
      localStorage.setItem("token", res.data.access);

      navigate("/feed");
    } catch (error) {
      console.error("Login Error:", error);

      if (error.response?.data) {
        alert(JSON.stringify(error.response.data));
      } else {
        alert("Server not reachable or backend not running");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logoContainer}>
          <div style={styles.logo}>🔥</div>
          <h1 style={styles.appName}>ScrollGuru</h1>
          <p style={styles.tagline}>Learn While You Scroll</p>
        </div>

        {/* Login Form */}
        <div style={styles.form}>
          <div style={styles.inputGroup}>
            <input
              style={styles.input}
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div style={styles.inputGroup}>
            <input
              style={styles.input}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            onClick={loginUser}
            disabled={loading}
            style={{
              ...styles.loginButton,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>

          {/* Forgot Password (optional) */}
          <p style={styles.forgotText}>Forgot your password?</p>
        </div>

        {/* Register Link */}
        <div style={styles.registerSection}>
          <p style={styles.registerText}>
            Don't have an account?{" "}
            <a href="/register" style={styles.registerLink}>
              Sign up
            </a>
          </p>
        </div>
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
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },

  card: {
    background: "#111",
    width: "100%",
    maxWidth: "380px",
    borderRadius: "20px",
    padding: "40px 24px",
    textAlign: "center",
    border: "1px solid #333",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.6)",
  },

  logoContainer: {
    marginBottom: "40px",
  },

  logo: {
    fontSize: "52px",
    marginBottom: "8px",
  },

  appName: {
    fontSize: "32px",
    fontWeight: "700",
    background: "linear-gradient(90deg, #f56040, #c13584, #833ab4)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: "0 0 6px 0",
  },

  tagline: {
    color: "#aaa",
    fontSize: "15px",
    margin: 0,
  },

  form: {
    marginBottom: "30px",
  },

  inputGroup: {
    marginBottom: "16px",
  },

  input: {
    width: "100%",
    padding: "16px 18px",
    background: "#1a1a1a",
    border: "1px solid #444",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "16px",
    outline: "none",
    transition: "all 0.3s",
  },

  loginButton: {
    width: "100%",
    padding: "16px",
    background: "linear-gradient(90deg, #f56040, #c13584)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "17px",
    fontWeight: "700",
    marginTop: "20px",
    cursor: "pointer",
    transition: "all 0.3s",
  },

  forgotText: {
    color: "#0095f6",
    fontSize: "14px",
    marginTop: "20px",
    cursor: "pointer",
  },

  registerSection: {
    marginTop: "30px",
    paddingTop: "20px",
    borderTop: "1px solid #333",
  },

  registerText: {
    color: "#aaa",
    fontSize: "15px",
  },

  registerLink: {
    color: "#0095f6",
    fontWeight: "600",
    textDecoration: "none",
  },
};