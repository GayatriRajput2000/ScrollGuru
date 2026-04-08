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
    <>
      <style>
        {`
          @keyframes float1 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(30px, -20px) scale(1.1); }
          }
          @keyframes float2 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(-20px, 30px) scale(1.05); }
          }
          @keyframes fadeUp {
            0% { opacity: 0; transform: translateY(24px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
          @keyframes shimmer {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

      <div style={styles.container}>
        {/* Ambient Glows */}
        <div style={styles.glow1} />
        <div style={styles.glow2} />
        <div style={styles.glow3} />

        {/* Floating particles */}
        <div style={styles.particle1} />
        <div style={styles.particle2} />
        <div style={styles.particle3} />

        <div style={styles.card}>
          {/* Top accent line */}
          <div style={styles.accentLine} />

          {/* Logo */}
          <div style={styles.logoContainer}>
            <div style={styles.logoWrapper}>
              <div style={styles.logoRing} />
              <div style={styles.logo}>🔥</div>
            </div>
            <h1 style={styles.appName}>ScrollGuru</h1>
            <p style={styles.tagline}>Learn While You Scroll</p>
          </div>

          {/* Login Form */}
          <div style={styles.form}>
            {/* Phone Input */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Phone Number</label>
              <div style={styles.inputWrapper}>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="Enter your phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            {/* Password Input */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrapper}>
                <input
                  style={styles.input}
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Forgot Password */}
            <div style={styles.forgotRow}>
              <p style={styles.forgotText}>Forgot your password?</p>
            </div>

            {/* Login Button */}
            <button
              onClick={loginUser}
              disabled={loading}
              style={{
                ...styles.loginButton,
                opacity: loading ? 0.8 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? (
                <span style={styles.loadingRow}>
                  <span style={styles.spinner} />
                  Logging in...
                </span>
              ) : (
                "Log In"
              )}
            </button>
          </div>

          {/* Divider */}
          <div style={styles.dividerRow}>
            <div style={styles.dividerLine} />
            <span style={styles.dividerText}>OR</span>
            <div style={styles.dividerLine} />
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

        {/* Bottom text */}
        <p style={styles.bottomText}>ScrollGuru © 2025</p>
      </div>
    </>
  );
}

const styles = {
  container: {
    background: "#000",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    position: "relative",
    overflow: "hidden",
  },

  // Ambient Glows
  glow1: {
    position: "absolute",
    top: "-10%",
    right: "-10%",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(245,96,64,0.1) 0%, transparent 70%)",
    animation: "float1 8s ease-in-out infinite",
    pointerEvents: "none",
  },
  glow2: {
    position: "absolute",
    bottom: "-5%",
    left: "-10%",
    width: "350px",
    height: "350px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(131,58,180,0.1) 0%, transparent 70%)",
    animation: "float2 10s ease-in-out infinite",
    pointerEvents: "none",
  },
  glow3: {
    position: "absolute",
    top: "40%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(193,53,132,0.06) 0%, transparent 60%)",
    pointerEvents: "none",
  },

  // Floating Particles
  particle1: {
    position: "absolute",
    top: "15%",
    left: "12%",
    width: "4px",
    height: "4px",
    borderRadius: "50%",
    background: "rgba(245,96,64,0.4)",
    animation: "pulse 3s ease-in-out infinite",
    pointerEvents: "none",
  },
  particle2: {
    position: "absolute",
    top: "70%",
    right: "15%",
    width: "3px",
    height: "3px",
    borderRadius: "50%",
    background: "rgba(0,149,246,0.4)",
    animation: "pulse 4s ease-in-out infinite 1s",
    pointerEvents: "none",
  },
  particle3: {
    position: "absolute",
    top: "30%",
    right: "25%",
    width: "5px",
    height: "5px",
    borderRadius: "50%",
    background: "rgba(193,53,132,0.3)",
    animation: "pulse 3.5s ease-in-out infinite 0.5s",
    pointerEvents: "none",
  },

  // Card
  card: {
    background: "rgba(17,17,17,0.8)",
    backdropFilter: "blur(40px)",
    WebkitBackdropFilter: "blur(40px)",
    width: "100%",
    maxWidth: "400px",
    borderRadius: "28px",
    padding: "44px 28px 32px",
    textAlign: "center",
    border: "1px solid rgba(255,255,255,0.06)",
    boxShadow:
      "0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03) inset",
    position: "relative",
    zIndex: 1,
    animation: "fadeUp 0.6s ease both",
  },
  accentLine: {
    position: "absolute",
    top: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: "80px",
    height: "3px",
    borderRadius: "0 0 4px 4px",
    background: "linear-gradient(90deg, #f56040, #c13584, #833ab4)",
  },

  // Logo
  logoContainer: {
    marginBottom: "36px",
  },
  logoWrapper: {
    position: "relative",
    display: "inline-block",
    marginBottom: "12px",
  },
  logoRing: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    border: "1.5px solid rgba(245,96,64,0.15)",
    pointerEvents: "none",
  },
  logo: {
    fontSize: "52px",
    display: "block",
    filter: "drop-shadow(0 4px 12px rgba(245,96,64,0.3))",
  },
  appName: {
    fontSize: "30px",
    fontWeight: "800",
    background: "linear-gradient(135deg, #f56040, #c13584, #833ab4)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: "0 0 6px 0",
    letterSpacing: "-0.5px",
  },
  tagline: {
    color: "#666",
    fontSize: "14px",
    margin: 0,
    fontWeight: "500",
    letterSpacing: "0.3px",
  },

  // Form
  form: {
    marginBottom: "24px",
  },
  inputGroup: {
    marginBottom: "18px",
    textAlign: "left",
  },
  label: {
    display: "block",
    fontSize: "12px",
    fontWeight: "600",
    color: "#888",
    marginBottom: "8px",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
  },
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  inputIcon: {
    position: "absolute",
    left: "16px",
    fontSize: "16px",
    pointerEvents: "none",
    zIndex: 1,
  },
  input: {
    width: "100%",
    padding: "15px 16px 15px 46px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "14px",
    color: "#fff",
    fontSize: "15px",
    outline: "none",
    transition: "all 0.25s ease",
    boxSizing: "border-box",
  },

  // Forgot Password
  forgotRow: {
    textAlign: "right",
    marginBottom: "4px",
  },
  forgotText: {
    color: "#0095f6",
    fontSize: "13px",
    margin: 0,
    cursor: "pointer",
    fontWeight: "500",
    transition: "color 0.2s ease",
  },

  // Login Button
  loginButton: {
    width: "100%",
    padding: "16px",
    background: "linear-gradient(135deg, #f56040, #c13584, #833ab4)",
    backgroundSize: "200% 200%",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    fontSize: "16px",
    fontWeight: "700",
    marginTop: "20px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    letterSpacing: "0.2px",
    position: "relative",
    overflow: "hidden",
  },
  loadingRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  },
  spinner: {
    display: "inline-block",
    width: "18px",
    height: "18px",
    border: "2.5px solid rgba(255,255,255,0.3)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  },

  // Divider
  dividerRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    margin: "24px 0 20px",
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    background: "rgba(255,255,255,0.08)",
  },
  dividerText: {
    fontSize: "12px",
    color: "#555",
    fontWeight: "600",
    letterSpacing: "1px",
  },

  // Register Section
  registerSection: {
    marginTop: "0",
  },
  registerText: {
    color: "#777",
    fontSize: "14px",
    margin: 0,
    fontWeight: "500",
  },
  registerLink: {
    color: "#0095f6",
    fontWeight: "700",
    textDecoration: "none",
    transition: "color 0.2s ease",
  },

  // Bottom Text
  bottomText: {
    position: "relative",
    zIndex: 1,
    color: "#333",
    fontSize: "12px",
    marginTop: "32px",
    fontWeight: "500",
    letterSpacing: "0.5px",
  },
};
