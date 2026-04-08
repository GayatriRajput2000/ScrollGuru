import { useState } from "react";
import API from "../api/axios";

export default function Register() {
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");

    const registerUser = async () => {
    const registerUser = async () => {
        try {
            const formData = new FormData();

            formData.append("phone", phone);
            formData.append("password", password);

            await API.post("users/create/", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            });

            // login after register
            const res = await API.post("token/", {
            phone,
            password,
            });

            localStorage.setItem("token", res.data.access);
            window.location.href = "/feed";
        } catch (err) {
            console.log(err.response?.data);
            alert("Registration failed");
        }
        };

    const res = await API.post("token/", { phone, password });

    localStorage.setItem("token", res.data.access);
    window.location.href = "/feed";
  };

  return (
    <>
      <style>
        {`
          @keyframes float1 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(25px, -25px) scale(1.1); }
          }
          @keyframes float2 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(-20px, 25px) scale(1.05); }
          }
          @keyframes fadeUp {
            0% { opacity: 0; transform: translateY(24px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
          }
          @keyframes ringPulse {
            0% { transform: translate(-50%, -50%) scale(1); opacity: 0.2; }
            100% { transform: translate(-50%, -50%) scale(1.6); opacity: 0; }
          }
          @keyframes shimmer {
            0% { opacity: 0.5; }
            50% { opacity: 1; }
            100% { opacity: 0.5; }
          }
        `}
      </style>

      <div style={styles.container}>
        {/* Ambient Glows */}
        <div style={styles.glow1} />
        <div style={styles.glow2} />
        <div style={styles.glow3} />

        {/* Floating Particles */}
        <div style={styles.particle1} />
        <div style={styles.particle2} />
        <div style={styles.particle3} />
        <div style={styles.particle4} />

        <div style={styles.card}>
          {/* Top accent line */}
          <div style={styles.accentLine} />

          {/* Logo */}
          <div style={styles.logoWrapper}>
            <div style={styles.logoRing1} />
            <div style={styles.logoRing2} />
            <div style={styles.logoEmoji}>🔥</div>
          </div>
          <div style={styles.logoText}>ScrollGuru</div>

          {/* Heading */}
          <h2 style={styles.heading}>Create Account</h2>
          <p style={styles.subheading}>Join the learning community</p>

          {/* Form */}
          <div style={styles.form}>
            {/* Phone Input */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Phone Number</label>
              <div style={styles.inputWrapper}>
                <input
                  style={styles.input}
                  placeholder="Enter your phone"
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            {/* Password Input */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrapper}>
                <input
                  type="password"
                  style={styles.input}
                  placeholder="Create a password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Register Button */}
            <button onClick={registerUser} style={styles.button}>
              <span style={styles.buttonInner}>Create Account</span>
            </button>
          </div>

          {/* Divider */}
          <div style={styles.dividerRow}>
            <div style={styles.dividerLine} />
            <span style={styles.dividerText}>OR</span>
            <div style={styles.dividerLine} />
          </div>

          {/* Footer */}
          <p style={styles.footerText}>
            Already have an account?{" "}
            <a href="/login" style={styles.link}>
              Login here
            </a>
          </p>
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
    top: "-8%",
    left: "-8%",
    width: "380px",
    height: "380px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(131,58,180,0.12) 0%, transparent 70%)",
    animation: "float2 9s ease-in-out infinite",
    pointerEvents: "none",
  },
  glow2: {
    position: "absolute",
    bottom: "-5%",
    right: "-8%",
    width: "350px",
    height: "350px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(245,96,64,0.1) 0%, transparent 70%)",
    animation: "float1 8s ease-in-out infinite",
    pointerEvents: "none",
  },
  glow3: {
    position: "absolute",
    top: "45%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(193,53,132,0.05) 0%, transparent 60%)",
    pointerEvents: "none",
  },

  // Floating Particles
  particle1: {
    position: "absolute",
    top: "12%",
    right: "18%",
    width: "4px",
    height: "4px",
    borderRadius: "50%",
    background: "rgba(193,53,132,0.4)",
    animation: "pulse 3s ease-in-out infinite",
    pointerEvents: "none",
  },
  particle2: {
    position: "absolute",
    top: "65%",
    left: "10%",
    width: "3px",
    height: "3px",
    borderRadius: "50%",
    background: "rgba(0,149,246,0.35)",
    animation: "pulse 4s ease-in-out infinite 1s",
    pointerEvents: "none",
  },
  particle3: {
    position: "absolute",
    top: "25%",
    left: "22%",
    width: "5px",
    height: "5px",
    borderRadius: "50%",
    background: "rgba(245,96,64,0.25)",
    animation: "pulse 3.5s ease-in-out infinite 0.5s",
    pointerEvents: "none",
  },
  particle4: {
    position: "absolute",
    bottom: "20%",
    right: "12%",
    width: "3px",
    height: "3px",
    borderRadius: "50%",
    background: "rgba(131,58,180,0.35)",
    animation: "pulse 4.5s ease-in-out infinite 1.5s",
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
    padding: "40px 28px 32px",
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
  logoWrapper: {
    position: "relative",
    display: "inline-block",
    marginBottom: "8px",
  },
  logoRing1: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    border: "1.5px solid rgba(245,96,64,0.15)",
    pointerEvents: "none",
  },
  logoRing2: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    border: "1px solid rgba(193,53,132,0.08)",
    pointerEvents: "none",
  },
  logoEmoji: {
    fontSize: "48px",
    display: "block",
    filter: "drop-shadow(0 4px 12px rgba(245,96,64,0.3))",
  },
  logoText: {
    fontSize: "28px",
    fontWeight: "800",
    background: "linear-gradient(135deg, #f56040, #c13584, #833ab4)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "20px",
    letterSpacing: "-0.5px",
  },

  // Headings
  heading: {
    fontSize: "24px",
    fontWeight: "800",
    margin: "0 0 6px",
    color: "#fff",
    letterSpacing: "-0.3px",
  },
  subheading: {
    color: "#666",
    fontSize: "14px",
    margin: "0 0 30px",
    fontWeight: "500",
  },

  // Form
  form: {
    marginBottom: "20px",
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
    padding: "15px 16px 15px 20px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "14px",
    color: "#fff",
    fontSize: "15px",
    outline: "none",
    transition: "all 0.25s ease",
    boxSizing: "border-box",
  },

  // Button
  button: {
    width: "100%",
    padding: "16px",
    background: "linear-gradient(135deg, #f56040, #c13584, #833ab4)",
    backgroundSize: "200% 200%",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    fontSize: "16px",
    fontWeight: "700",
    marginTop: "10px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    letterSpacing: "0.2px",
    position: "relative",
    overflow: "hidden",
  },
  buttonInner: {
    position: "relative",
    zIndex: 1,
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

  // Footer
  footerText: {
    color: "#777",
    fontSize: "14px",
    margin: 0,
    fontWeight: "500",
  },
  link: {
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
